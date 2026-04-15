import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: investor, error } = await supabase
    .from('investors')
    .select('kyc_status, document_type, document_number, full_name, email')
    .eq('id', user.id)
    .single()

  if (error || !investor) {
    return NextResponse.json(
      { error: 'Inversor no encontrado' },
      { status: 404 }
    )
  }

  // Check if documents exist in storage
  const { data: files } = await supabase.storage
    .from('kyc-documents')
    .list(user.id)

  const hasDocuments = (files && files.length > 0) || false

  return NextResponse.json({ ...investor, has_documents: hasDocuments })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { document_type, document_number, front_url, back_url, selfie_url } =
    body

  if (!document_type || !document_number) {
    return NextResponse.json(
      { error: 'Tipo y número de documento son requeridos' },
      { status: 400 }
    )
  }

  if (!front_url || !back_url || !selfie_url) {
    return NextResponse.json(
      { error: 'Todas las fotos son requeridas' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('investors')
    .update({
      document_type,
      document_number,
      kyc_status: 'pending',
    })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json(
      { error: 'Error al actualizar datos' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
