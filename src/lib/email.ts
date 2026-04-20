/**
 * Email service abstraction for BrickToken.
 *
 * When RESEND_API_KEY is set, emails are sent via Resend API.
 * Otherwise, emails are logged to the console (development mode).
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
}

interface EmailResult {
  success: boolean
  error?: string
}

const FROM_ADDRESS = 'BrickToken <notificaciones@bricktoken.uy>'

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    // Console mode — development fallback. No volcamos el HTML para evitar
    // filtrar tokens, links de magic-link u otros datos sensibles a logs.
    console.warn('[email] RESEND_API_KEY no configurada — email no enviado', {
      to: options.to,
      subject: options.subject,
    })
    return { success: true }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[EMAIL] Error de Resend:', response.status, errorBody)
      return {
        success: false,
        error: `Resend API error: ${response.status} — ${errorBody}`,
      }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[EMAIL] Error al enviar:', message)
    return { success: false, error: message }
  }
}

/**
 * Send emails to multiple recipients with rate limiting.
 * Max 10 emails per second to respect Resend rate limits.
 */
export async function sendBulkEmails(
  recipients: { to: string; subject: string; html: string }[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
  let sent = 0
  let failed = 0
  const errors: string[] = []
  const BATCH_SIZE = 10
  const DELAY_MS = 1000

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE)

    const results = await Promise.allSettled(
      batch.map((recipient) => sendEmail(recipient))
    )

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        sent++
      } else {
        failed++
        const error =
          result.status === 'fulfilled'
            ? result.value.error ?? 'Error desconocido'
            : result.reason?.message ?? 'Error desconocido'
        errors.push(error)
      }
    }

    // Wait before next batch (except for the last one)
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
    }
  }

  return { sent, failed, errors }
}
