import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { holding_id, tokens, price_per_token } = body

    if (!holding_id || !tokens || !price_per_token) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (tokens <= 0 || price_per_token <= 0) {
      return NextResponse.json(
        { error: 'Los valores deben ser positivos' },
        { status: 400 }
      )
    }

    // Get investor record
    const { data: investor } = await supabase
      .from('investors')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!investor) {
      return NextResponse.json(
        { error: 'Perfil de inversor no encontrado' },
        { status: 404 }
      )
    }

    // Get holding and verify ownership
    const { data: holding } = await supabase
      .from('holdings')
      .select('*')
      .eq('id', holding_id)
      .eq('investor_id', investor.id)
      .eq('status', 'active')
      .single()

    if (!holding) {
      return NextResponse.json(
        { error: 'Holding no encontrado o no activo' },
        { status: 404 }
      )
    }

    // Check already listed tokens for this holding
    const { data: existingOrders } = await supabase
      .from('sell_orders')
      .select('tokens_remaining')
      .eq('holding_id', holding_id)
      .in('status', ['active', 'partial'])

    const alreadyListed = (existingOrders ?? []).reduce(
      (sum: number, o: { tokens_remaining: number }) => sum + o.tokens_remaining,
      0
    )
    const available = holding.tokens - alreadyListed

    if (tokens > available) {
      return NextResponse.json(
        { error: `Solo tenés ${available} tokens disponibles para listar` },
        { status: 400 }
      )
    }

    // Create sell order
    const { data: order, error } = await supabase
      .from('sell_orders')
      .insert({
        seller_id: investor.id,
        property_id: holding.property_id,
        holding_id: holding_id,
        tokens,
        price_per_token,
        tokens_remaining: tokens,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      return NextResponse.json(
        { error: 'order_id requerido' },
        { status: 400 }
      )
    }

    // Get investor record
    const { data: investor } = await supabase
      .from('investors')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!investor) {
      return NextResponse.json(
        { error: 'Perfil de inversor no encontrado' },
        { status: 404 }
      )
    }

    // Verify ownership and active status
    const { data: order } = await supabase
      .from('sell_orders')
      .select('*')
      .eq('id', orderId)
      .eq('seller_id', investor.id)
      .in('status', ['active', 'partial'])
      .single()

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada o no cancelable' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('sell_orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
