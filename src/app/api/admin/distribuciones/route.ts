import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('distributions')
    .select('*, property:properties(id, name, slug, total_tokens, token_price)')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { property_id, period, total_amount } = body

  if (!property_id || !period || !total_amount) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos: property_id, period, total_amount' },
      { status: 400 }
    )
  }

  // Validate property exists
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('id, name, total_tokens, status')
    .eq('id', property_id)
    .single()

  if (propError || !property) {
    return NextResponse.json(
      { error: 'Propiedad no encontrada' },
      { status: 404 }
    )
  }

  if (!['funded', 'renting'].includes(property.status)) {
    return NextResponse.json(
      { error: 'La propiedad debe estar en estado "funded" o "renting"' },
      { status: 400 }
    )
  }

  // Check for duplicate period
  const { data: existing } = await supabase
    .from('distributions')
    .select('id')
    .eq('property_id', property_id)
    .eq('period', period)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: `Ya existe una distribución para el período ${period} en esta propiedad` },
      { status: 409 }
    )
  }

  const per_token_amount = Number((total_amount / property.total_tokens).toFixed(4))

  const { data: distribution, error: insertError } = await supabase
    .from('distributions')
    .insert({
      property_id,
      period,
      total_amount,
      per_token_amount,
      status: 'pending',
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json(distribution, { status: 201 })
}
