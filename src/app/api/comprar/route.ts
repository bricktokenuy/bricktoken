import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Validate auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado. Inicie sesion para continuar.' },
        { status: 401 }
      )
    }

    // Parse body
    const body = await request.json()
    const { property_id, tokens } = body as {
      property_id: string
      tokens: number
    }

    if (!property_id || !tokens || tokens <= 0 || !Number.isInteger(tokens)) {
      return NextResponse.json(
        { error: 'Datos invalidos. Verifique la cantidad de tokens.' },
        { status: 400 }
      )
    }

    // Fetch property
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

    // Validate property status
    if (property.status !== 'funding') {
      return NextResponse.json(
        { error: 'Esta propiedad no esta en periodo de financiacion.' },
        { status: 400 }
      )
    }

    // Validate available tokens
    const tokensAvailable = property.total_tokens - property.tokens_sold
    if (tokens > tokensAvailable) {
      return NextResponse.json(
        {
          error: `Solo hay ${tokensAvailable} tokens disponibles.`,
        },
        { status: 400 }
      )
    }

    // Calculate amounts
    const amount = tokens * property.token_price
    const fee = Math.round(amount * 0.025 * 100) / 100 // 2.5% fee

    // Insert holding
    const { error: holdingError } = await supabase.from('holdings').insert({
      investor_id: user.id,
      property_id: property.id,
      tokens,
      purchase_price: property.token_price,
      status: 'active',
    })

    if (holdingError) {
      console.error('Error inserting holding:', holdingError)
      return NextResponse.json(
        { error: 'Error al registrar la tenencia. Intente nuevamente.' },
        { status: 500 }
      )
    }

    // Insert transaction
    const { error: txError } = await supabase.from('transactions').insert({
      investor_id: user.id,
      property_id: property.id,
      type: 'buy',
      tokens,
      amount,
      fee,
      status: 'confirmed',
    })

    if (txError) {
      console.error('Error inserting transaction:', txError)
      return NextResponse.json(
        { error: 'Error al registrar la transaccion. Intente nuevamente.' },
        { status: 500 }
      )
    }

    // Update tokens_sold on property
    const { error: updateError } = await supabase
      .from('properties')
      .update({ tokens_sold: property.tokens_sold + tokens })
      .eq('id', property.id)

    if (updateError) {
      console.error('Error updating property:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar la propiedad. Intente nuevamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        tokens,
        amount,
        fee,
        total: amount + fee,
        property_name: property.name,
      },
    })
  } catch (err) {
    console.error('Unexpected error in /api/comprar:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
