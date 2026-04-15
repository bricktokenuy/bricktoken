import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MARKETPLACE_FEE_RATE = 0.015 // 1.5%

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { sell_order_id, tokens } = body

    if (!sell_order_id || !tokens || tokens <= 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos o valores inválidos' },
        { status: 400 }
      )
    }

    // Get buyer investor record
    const { data: buyer } = await supabase
      .from('investors')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!buyer) {
      return NextResponse.json(
        { error: 'Perfil de inversor no encontrado' },
        { status: 404 }
      )
    }

    // Get sell order
    const { data: order } = await supabase
      .from('sell_orders')
      .select('*')
      .eq('id', sell_order_id)
      .in('status', ['active', 'partial'])
      .single()

    if (!order) {
      return NextResponse.json(
        { error: 'Orden de venta no encontrada o no activa' },
        { status: 404 }
      )
    }

    // Cannot buy own tokens
    if (order.seller_id === buyer.id) {
      return NextResponse.json(
        { error: 'No podés comprar tus propios tokens' },
        { status: 400 }
      )
    }

    // Validate tokens available
    if (tokens > order.tokens_remaining) {
      return NextResponse.json(
        { error: `Solo hay ${order.tokens_remaining} tokens disponibles` },
        { status: 400 }
      )
    }

    const totalAmount = tokens * order.price_per_token
    const fee = Math.round(totalAmount * MARKETPLACE_FEE_RATE * 100) / 100

    // Create trade record
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .insert({
        sell_order_id: order.id,
        buyer_id: buyer.id,
        seller_id: order.seller_id,
        property_id: order.property_id,
        tokens,
        price_per_token: order.price_per_token,
        total_amount: totalAmount,
        fee,
      })
      .select()
      .single()

    if (tradeError) {
      return NextResponse.json({ error: tradeError.message }, { status: 500 })
    }

    // Update or create buyer holding
    const { data: existingBuyerHolding } = await supabase
      .from('holdings')
      .select('*')
      .eq('investor_id', buyer.id)
      .eq('property_id', order.property_id)
      .eq('status', 'active')
      .single()

    if (existingBuyerHolding) {
      await supabase
        .from('holdings')
        .update({
          tokens: existingBuyerHolding.tokens + tokens,
        })
        .eq('id', existingBuyerHolding.id)
    } else {
      await supabase
        .from('holdings')
        .insert({
          investor_id: buyer.id,
          property_id: order.property_id,
          tokens,
          purchase_price: order.price_per_token,
          status: 'active',
        })
    }

    // Update seller holding
    const { data: sellerHolding } = await supabase
      .from('holdings')
      .select('*')
      .eq('id', order.holding_id)
      .single()

    if (sellerHolding) {
      const newTokens = sellerHolding.tokens - tokens
      if (newTokens <= 0) {
        await supabase
          .from('holdings')
          .update({ tokens: 0, status: 'sold' })
          .eq('id', sellerHolding.id)
      } else {
        await supabase
          .from('holdings')
          .update({ tokens: newTokens })
          .eq('id', sellerHolding.id)
      }
    }

    // Update sell order
    const newRemaining = order.tokens_remaining - tokens
    const newStatus = newRemaining <= 0 ? 'filled' : 'partial'
    await supabase
      .from('sell_orders')
      .update({
        tokens_remaining: Math.max(0, newRemaining),
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // Create transaction records for buyer
    await supabase.from('transactions').insert({
      investor_id: buyer.id,
      property_id: order.property_id,
      type: 'buy',
      tokens,
      amount: totalAmount,
      fee,
      status: 'confirmed',
    })

    // Create transaction record for seller
    await supabase.from('transactions').insert({
      investor_id: order.seller_id,
      property_id: order.property_id,
      type: 'sell',
      tokens,
      amount: totalAmount,
      fee: 0,
      status: 'confirmed',
    })

    return NextResponse.json({ trade })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
