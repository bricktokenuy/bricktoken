import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentPreference } from '@/lib/payments'
import { env } from '@/lib/env'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado. Inicia sesion para continuar.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { property_id, tokens } = body as {
      property_id: string
      tokens: number
    }

    if (!property_id || !tokens || tokens < 1) {
      return NextResponse.json(
        { error: 'Datos invalidos. Se requiere property_id y tokens >= 1.' },
        { status: 400 }
      )
    }

    // Get property info
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', property_id)
      .single()

    if (propError || !property) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada.' },
        { status: 404 }
      )
    }

    // Validate property is in funding status
    if (property.status !== 'funding') {
      return NextResponse.json(
        { error: 'Esta propiedad no esta aceptando inversiones actualmente.' },
        { status: 400 }
      )
    }

    // Check token availability
    const tokensAvailable = property.total_tokens - property.tokens_sold
    if (tokens > tokensAvailable) {
      return NextResponse.json(
        {
          error: `Solo quedan ${tokensAvailable} tokens disponibles.`,
        },
        { status: 400 }
      )
    }

    // Get investor record
    const { data: investor, error: invError } = await supabase
      .from('investors')
      .select('id, email, kyc_status')
      .eq('id', user.id)
      .single()

    if (invError || !investor) {
      return NextResponse.json(
        { error: 'Perfil de inversor no encontrado.' },
        { status: 404 }
      )
    }

    // Calculate amounts
    const amount = tokens * property.token_price
    const fee = Math.round(amount * 0.025 * 100) / 100 // 2.5% platform fee

    // Create PENDING transaction (holding created after payment confirmation)
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        investor_id: investor.id,
        property_id: property.id,
        type: 'buy',
        tokens,
        amount,
        fee,
        status: 'pending',
      })
      .select('id')
      .single()

    if (txError || !transaction) {
      console.error('Error creating transaction:', txError)
      return NextResponse.json(
        { error: 'Error al crear la transaccion.' },
        { status: 500 }
      )
    }

    // Create payment record
    const { error: payError } = await supabase.from('payments').insert({
      transaction_id: transaction.id,
      investor_id: investor.id,
      amount,
      fee,
      status: 'pending',
      provider: env.mercadopago.isMockMode ? 'mock' : 'mercadopago',
    })

    if (payError) {
      console.error('Error creating payment record:', payError)
    }

    // Create MercadoPago preference (or mock)
    const preference = await createPaymentPreference({
      transactionId: transaction.id,
      propertyName: property.name,
      tokens,
      amount,
      fee,
      investorEmail: investor.email,
    })

    // Update payment with external reference
    await supabase
      .from('payments')
      .update({ external_id: preference.id })
      .eq('transaction_id', transaction.id)

    // In mock mode, also auto-approve the transaction and create holdings
    if (env.mercadopago.isMockMode) {
      // Update transaction to confirmed
      await supabase
        .from('transactions')
        .update({ status: 'confirmed' })
        .eq('id', transaction.id)

      // Create holding
      await supabase.from('holdings').insert({
        investor_id: investor.id,
        property_id: property.id,
        tokens,
        purchase_price: property.token_price,
        status: 'active',
      })

      // Update tokens_sold
      await supabase
        .from('properties')
        .update({ tokens_sold: property.tokens_sold + tokens })
        .eq('id', property.id)

      // Update payment to approved
      await supabase
        .from('payments')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('transaction_id', transaction.id)
    }

    return NextResponse.json({
      success: true,
      transaction_id: transaction.id,
      checkout_url: preference.init_point,
      mock_mode: env.mercadopago.isMockMode,
    })
  } catch (err) {
    console.error('Error in purchase API:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
