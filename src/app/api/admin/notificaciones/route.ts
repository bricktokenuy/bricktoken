import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBulkEmails } from '@/lib/email'
import { genericNotification } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subject, message } = body

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Se requiere asunto y mensaje.' },
        { status: 400 }
      )
    }

    // Fetch all investor emails from the database
    const supabase = await createClient()
    const { data: investors, error: dbError } = await supabase
      .from('investors')
      .select('email, full_name')

    if (dbError) {
      console.error('[NOTIFICATIONS] Error fetching investors:', dbError)
      return NextResponse.json(
        { error: 'Error al obtener la lista de inversores.' },
        { status: 500 }
      )
    }

    if (!investors || investors.length === 0) {
      return NextResponse.json(
        { error: 'No hay inversores registrados.' },
        { status: 404 }
      )
    }

    // Build email list
    const html = genericNotification({ subject, message })
    const recipients = investors.map((investor) => ({
      to: investor.email,
      subject: `${subject} — BrickToken`,
      html,
    }))

    // Send with rate limiting (handled inside sendBulkEmails)
    const result = await sendBulkEmails(recipients)

    return NextResponse.json({
      sent: result.sent,
      failed: result.failed,
      total: investors.length,
      errors: result.errors.length > 0 ? result.errors.slice(0, 5) : undefined,
    })
  } catch (err) {
    console.error('[NOTIFICATIONS] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
