import { createClient } from '@/lib/supabase/server'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    const slug = slugify(body.name)

    const totalTokens =
      body.total_value && body.token_price && body.token_price > 0
        ? Math.floor(body.total_value / body.token_price)
        : 0

    const propertyData = {
      name: body.name,
      slug,
      description: body.description,
      location: body.location,
      department: body.department,
      address: body.address,
      total_value: body.total_value,
      token_price: body.token_price,
      total_tokens: totalTokens,
      tokens_sold: body.tokens_sold ?? 0,
      annual_yield_pct: body.annual_yield_pct ?? 0,
      status: body.status ?? 'coming_soon',
      property_type: body.property_type,
      bedrooms: body.bedrooms ?? null,
      bathrooms: body.bathrooms ?? null,
      area_m2: body.area_m2,
      images: body.images ?? [],
      documents: body.documents ?? [],
      fideicomiso_number: body.fideicomiso_number ?? null,
    }

    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.id) {
      return Response.json({ error: 'ID requerido' }, { status: 400 })
    }

    const slug = slugify(body.name)

    const totalTokens =
      body.total_value && body.token_price && body.token_price > 0
        ? Math.floor(body.total_value / body.token_price)
        : 0

    const propertyData = {
      name: body.name,
      slug,
      description: body.description,
      location: body.location,
      department: body.department,
      address: body.address,
      total_value: body.total_value,
      token_price: body.token_price,
      total_tokens: totalTokens,
      tokens_sold: body.tokens_sold ?? 0,
      annual_yield_pct: body.annual_yield_pct ?? 0,
      status: body.status ?? 'coming_soon',
      property_type: body.property_type,
      bedrooms: body.bedrooms ?? null,
      bathrooms: body.bathrooms ?? null,
      area_m2: body.area_m2,
      images: body.images ?? [],
      documents: body.documents ?? [],
      fideicomiso_number: body.fideicomiso_number ?? null,
    }

    const { data, error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.id) {
      return Response.json({ error: 'ID requerido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', body.id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
