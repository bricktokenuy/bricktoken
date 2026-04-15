import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { distribution_id } = body

  if (!distribution_id) {
    return NextResponse.json(
      { error: 'Falta distribution_id' },
      { status: 400 }
    )
  }

  // Get the distribution
  const { data: distribution, error: distError } = await supabase
    .from('distributions')
    .select('*')
    .eq('id', distribution_id)
    .single()

  if (distError || !distribution) {
    return NextResponse.json(
      { error: 'Distribución no encontrada' },
      { status: 404 }
    )
  }

  if (distribution.status === 'distributed') {
    return NextResponse.json(
      { error: 'Esta distribución ya fue ejecutada' },
      { status: 400 }
    )
  }

  // Get all active holdings for this property
  const { data: holdings, error: holdError } = await supabase
    .from('holdings')
    .select('id, investor_id, tokens')
    .eq('property_id', distribution.property_id)
    .eq('status', 'active')

  if (holdError) {
    return NextResponse.json({ error: holdError.message }, { status: 500 })
  }

  if (!holdings || holdings.length === 0) {
    return NextResponse.json(
      { error: 'No hay holdings activos para esta propiedad' },
      { status: 400 }
    )
  }

  // Create yield transactions for each holding
  const transactions = holdings.map((holding) => ({
    investor_id: holding.investor_id,
    property_id: distribution.property_id,
    type: 'yield' as const,
    tokens: 0,
    amount: Number((holding.tokens * distribution.per_token_amount).toFixed(2)),
    fee: 0,
    status: 'confirmed' as const,
  }))

  const { error: txError } = await supabase
    .from('transactions')
    .insert(transactions)

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 })
  }

  // Update distribution status
  const { error: updateError } = await supabase
    .from('distributions')
    .update({
      status: 'distributed',
      distributed_at: new Date().toISOString(),
    })
    .eq('id', distribution_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const totalDistributed = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return NextResponse.json({
    success: true,
    summary: {
      distribution_id,
      total_distributed: totalDistributed,
      num_investors: holdings.length,
      transactions_created: transactions.length,
    },
  })
}
