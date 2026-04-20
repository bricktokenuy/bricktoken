import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentPreference } from '@/lib/payments'
import { env } from '@/lib/env'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const MAX_TOKENS_PER_TX = 5000

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado. Iniciá sesión para comprar tokens.' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de la solicitud inválido.' },
        { status: 400 }
      )
    }

    const { property_id, tokens } = (body ?? {}) as {
      property_id?: unknown
      tokens?: unknown
    }

    if (typeof property_id !== 'string' || !UUID_RE.test(property_id)) {
      return NextResponse.json(
        { error: 'Identificador de propiedad inválido.' },
        { status: 400 }
      )
    }

    if (
      typeof tokens !== 'number' ||
      !Number.isInteger(tokens) ||
      tokens < 1 ||
      tokens > MAX_TOKENS_PER_TX
    ) {
      return NextResponse.json(
        {
          error: `Cantidad de tokens inválida. Debe ser un número entero entre 1 y ${MAX_TOKENS_PER_TX}.`,
        },
        { status: 400 }
      )
    }

    // Get property info
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('id, name, status, total_tokens, tokens_sold, token_price')
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
        { error: 'Esta propiedad no está aceptando inversiones actualmente.' },
        { status: 400 }
      )
    }

    // Check token availability
    const tokensAvailable = property.total_tokens - property.tokens_sold
    if (tokensAvailable <= 0) {
      return NextResponse.json(
        { error: 'No quedan tokens disponibles para esta propiedad.' },
        { status: 409 }
      )
    }
    if (tokens > tokensAvailable) {
      return NextResponse.json(
        {
          error: `Solo quedan ${tokensAvailable} tokens disponibles.`,
        },
        { status: 409 }
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
        {
          error:
            'Perfil de inversor no encontrado. Completá tu registro antes de comprar.',
        },
        { status: 404 }
      )
    }

    // KYC gate. Allow purchase only when verified. `pending` and `rejected`
    // both block, with their own message so the UI can guide the user.
    if (investor.kyc_status !== 'verified') {
      const message =
        investor.kyc_status === 'pending'
          ? 'Tu verificación de identidad (KYC) está en revisión. Te avisamos por email cuando esté aprobada.'
          : investor.kyc_status === 'rejected'
            ? 'Tu verificación de identidad (KYC) fue rechazada. Subí los documentos nuevamente desde tu panel.'
            : 'Tenés que completar la verificación de identidad (KYC) antes de comprar tokens.'
      return NextResponse.json({ error: message }, { status: 403 })
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
        { error: 'Error al crear la transacción.' },
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
