import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPaymentWebhook, getPaymentStatus } from '@/lib/payments'
import { env } from '@/lib/env'

// Use service role client for webhook operations (bypasses RLS)
function createServiceClient() {
  return createClient(env.supabase.url, env.supabase.serviceRoleKey)
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature')
    const requestId = request.headers.get('x-request-id')
    // MercadoPago signs the `data.id` query param of the notification URL.
    const dataId = new URL(request.url).searchParams.get('data.id')

    // Verify webhook signature (HMAC-SHA256 over the MercadoPago manifest).
    if (!verifyPaymentWebhook({ dataId, requestId, signature })) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(body)

    // MercadoPago sends different event types
    // We care about "payment" notifications
    if (payload.type !== 'payment' && payload.action !== 'payment.updated') {
      // Acknowledge other event types without processing
      return NextResponse.json({ received: true })
    }

    const paymentId = String(payload.data?.id)
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing payment ID' },
        { status: 400 }
      )
    }

    // Get payment status from MercadoPago
    const paymentStatus = await getPaymentStatus(paymentId)

    const supabase = createServiceClient()

    // Find the payment record by external reference
    // The external_reference in MP corresponds to our transaction_id
    const externalRef =
      paymentStatus.metadata?.transaction_id ??
      payload.data?.metadata?.transaction_id

    // Try to find by external_id first, then by transaction_id from metadata
    let paymentRecord = null

    if (externalRef) {
      const { data } = await supabase
        .from('payments')
        .select('*, transaction_id')
        .eq('transaction_id', String(externalRef))
        .single()
      paymentRecord = data
    }

    if (!paymentRecord) {
      // Try finding by external_id
      const { data } = await supabase
        .from('payments')
        .select('*, transaction_id')
        .eq('external_id', paymentId)
        .single()
      paymentRecord = data
    }

    if (!paymentRecord) {
      console.error('Payment record not found for:', paymentId)
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      )
    }

    const transactionId = paymentRecord.transaction_id

    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: paymentStatus.status,
        external_id: paymentStatus.externalId,
        metadata: paymentStatus.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.id)

    if (paymentStatus.status === 'approved') {
      // Get the pending transaction
      const { data: transaction } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .eq('status', 'pending')
        .single()

      if (transaction) {
        // Atomically reserve the tokens before confirming. This is the single
        // source of truth for stock under concurrency (two payments confirming
        // at once can no longer oversell). The `.eq('status', 'pending')` filter
        // above also makes this idempotent: a duplicate webhook delivery won't
        // re-find a pending transaction and so won't reserve tokens twice.
        const { data: reservation, error: reserveError } = await supabase
          .rpc('reserve_property_tokens', {
            p_property_id: transaction.property_id,
            p_tokens: transaction.tokens,
          })
          .single<{
            reserved: boolean
            tokens_sold: number | null
            total_tokens: number | null
            tokens_available: number | null
          }>()

        if (reserveError || !reservation) {
          console.error('Error reserving tokens (webhook):', reserveError, {
            transaction_id: transactionId,
            property_id: transaction.property_id,
            tokens: transaction.tokens,
          })
          return NextResponse.json(
            { error: 'Error reserving tokens' },
            { status: 500 }
          )
        }

        if (!reservation.reserved) {
          // Payment approved but property is sold out. Do NOT create a holding.
          // Flag the transaction so ops can reconcile / refund the payment.
          console.error('Oversell prevented: paid order cannot be filled', {
            transaction_id: transactionId,
            property_id: transaction.property_id,
            tokens: transaction.tokens,
            tokens_available: reservation.tokens_available,
          })
          await supabase
            .from('transactions')
            .update({ status: 'failed' })
            .eq('id', transactionId)
          return NextResponse.json({
            received: true,
            status: paymentStatus.status,
            oversell_blocked: true,
          })
        }

        // Reservation succeeded (tokens_sold already incremented atomically).
        // Update transaction status to confirmed
        await supabase
          .from('transactions')
          .update({ status: 'confirmed' })
          .eq('id', transactionId)

        // Create the holding
        await supabase.from('holdings').insert({
          investor_id: transaction.investor_id,
          property_id: transaction.property_id,
          tokens: transaction.tokens,
          purchase_price: transaction.amount / transaction.tokens,
          status: 'active',
        })
      }
    } else if (
      paymentStatus.status === 'rejected' ||
      paymentStatus.status === 'cancelled'
    ) {
      // Update transaction to failed
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transactionId)
    }

    return NextResponse.json({ received: true, status: paymentStatus.status })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
