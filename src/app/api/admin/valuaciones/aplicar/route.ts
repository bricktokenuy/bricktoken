import { NextRequest, NextResponse } from 'next/server'
import { demoProperties, demoValuations } from '@/lib/demo-data'

// POST: apply a pending valuation
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { valuation_id } = body

  if (!valuation_id) {
    return NextResponse.json({ error: 'valuation_id es requerido' }, { status: 400 })
  }

  // Find the valuation
  const valuation = demoValuations.find((v) => v.id === valuation_id)
  if (!valuation) {
    return NextResponse.json({ error: 'Valuación no encontrada' }, { status: 404 })
  }

  if (valuation.status === 'applied') {
    return NextResponse.json({ error: 'Esta valuación ya fue aplicada' }, { status: 400 })
  }

  // Find the property
  const property = demoProperties.find((p) => p.id === valuation.property_id)
  if (!property) {
    return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
  }

  // In production, this would be a Supabase transaction:
  // const supabase = await createClient()
  // await supabase.from('properties').update({
  //   total_value: valuation.new_value,
  //   token_price: valuation.new_token_price,
  // }).eq('id', valuation.property_id)
  // await supabase.from('valuations').update({
  //   status: 'applied',
  //   applied_at: new Date().toISOString(),
  // }).eq('id', valuation_id)

  // Update property values (demo mutation)
  property.total_value = valuation.new_value
  property.token_price = valuation.new_token_price

  // Update valuation status
  valuation.status = 'applied'
  valuation.applied_at = new Date().toISOString()

  return NextResponse.json({
    message: 'Valuación aplicada exitosamente',
    valuation,
    property: {
      id: property.id,
      name: property.name,
      total_value: property.total_value,
      token_price: property.token_price,
    },
  })
}
