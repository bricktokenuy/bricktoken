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

  const { data: investors, error } = await supabase
    .from('investors')
    .select('id, full_name, email, document_type, document_number, kyc_status, created_at')
    .eq('kyc_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: 'Error al obtener inversores' },
      { status: 500 }
    )
  }

  return NextResponse.json({ investors: investors ?? [] })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { investor_id, status } = body

  if (!investor_id || !status) {
    return NextResponse.json(
      { error: 'investor_id y status son requeridos' },
      { status: 400 }
    )
  }

  if (status !== 'verified' && status !== 'rejected') {
    return NextResponse.json(
      { error: 'Status debe ser verified o rejected' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('investors')
    .update({ kyc_status: status })
    .eq('id', investor_id)

  if (error) {
    return NextResponse.json(
      { error: 'Error al actualizar estado KYC' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
