import { NextRequest, NextResponse } from 'next/server'
import { demoProperties, demoValuations } from '@/lib/demo-data'
import { Valuation } from '@/lib/types'

// GET: list all valuations with property names
export async function GET() {
  // In production, this would query from Supabase:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('valuations')
  //   .select('*, property:properties(name, slug)')
  //   .order('created_at', { ascending: false })

  const valuations = demoValuations.map((v) => ({
    ...v,
    property_name: v.property?.name ?? 'Propiedad desconocida',
    property_slug: v.property?.slug ?? '',
  }))

  return NextResponse.json(valuations)
}

// POST: create new valuation
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { property_id, new_value, appraiser, valuation_date, notes } = body

  // Find the property
  const property = demoProperties.find((p) => p.id === property_id)
  if (!property) {
    return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
  }

  // Calculate derived values
  const previous_value = property.total_value
  const previous_token_price = property.token_price
  const new_token_price = new_value / property.total_tokens
  const change_pct = ((new_value - previous_value) / previous_value) * 100

  const newValuation: Valuation = {
    id: `v${Date.now()}`,
    property_id,
    previous_value,
    new_value,
    previous_token_price,
    new_token_price: Math.round(new_token_price * 100) / 100,
    change_pct: Math.round(change_pct * 100) / 100,
    appraiser: appraiser || null,
    notes: notes || null,
    valuation_date,
    applied_at: null,
    status: 'pending',
    created_at: new Date().toISOString(),
    property,
  }

  // In production, this would insert into Supabase:
  // const supabase = await createClient()
  // const { data, error } = await supabase.from('valuations').insert({...}).select().single()

  demoValuations.push(newValuation)

  return NextResponse.json(newValuation, { status: 201 })
}
