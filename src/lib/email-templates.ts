/**
 * HTML email templates for BrickToken notifications.
 * All templates use inline CSS for maximum email client compatibility.
 * All text is in Spanish (es-UY).
 */

// URL base para links en emails. En producción debe setearse NEXT_PUBLIC_APP_URL
// al dominio definitivo (ej: https://bricktoken.uy). Fallback al deploy de preview.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bricktoken-beige.vercel.app'

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                BrickToken
              </h1>
              <p style="margin:4px 0 0;color:#bfdbfe;font-size:12px;letter-spacing:1px;text-transform:uppercase;">
                Inversión inmobiliaria tokenizada
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
                BrickToken — Inversión inmobiliaria tokenizada<br />
                Montevideo, Uruguay
              </p>
              <p style="margin:12px 0 0;color:#cbd5e1;font-size:12px;">
                <a href="#" style="color:#94a3b8;text-decoration:underline;">Desuscribirme de estas notificaciones</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Purchase confirmation
// ---------------------------------------------------------------------------

interface PurchaseConfirmationData {
  investorName: string
  propertyName: string
  tokens: number
  amount: number
  date: string
}

export function purchaseConfirmation(data: PurchaseConfirmationData): string {
  const body = `
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">
      Compra confirmada
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
      Hola ${data.investorName}, tu compra fue procesada exitosamente.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;">
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Propiedad</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">${data.propertyName}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Tokens adquiridos</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">${data.tokens}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Monto total</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">USD ${data.amount.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Fecha</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">${data.date}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      Podés ver el detalle de tu inversión en tu <a href="${APP_URL}/dashboard" style="color:#2563eb;text-decoration:underline;">panel de control</a>.
    </p>`

  return layout('Compra confirmada — BrickToken', body)
}

// ---------------------------------------------------------------------------
// Yield distribution
// ---------------------------------------------------------------------------

interface YieldDistributionData {
  investorName: string
  propertyName: string
  amount: number
  period: string
}

export function yieldDistribution(data: YieldDistributionData): string {
  const body = `
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">
      Rendimiento distribuido
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
      Hola ${data.investorName}, se distribuyó el rendimiento correspondiente al período <strong>${data.period}</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;">
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Propiedad</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">${data.propertyName}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Monto acreditado</p>
          <p style="margin:4px 0 0;color:#2563eb;font-size:20px;font-weight:700;">USD ${data.amount.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Período</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">${data.period}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      El monto fue acreditado en tu billetera. Revisá tu <a href="${APP_URL}/dashboard" style="color:#2563eb;text-decoration:underline;">historial de transacciones</a> para más detalle.
    </p>`

  return layout('Rendimiento distribuido — BrickToken', body)
}

// ---------------------------------------------------------------------------
// KYC approved
// ---------------------------------------------------------------------------

interface KycApprovedData {
  investorName: string
}

export function kycApproved(data: KycApprovedData): string {
  const body = `
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">
      Identidad verificada
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
      Hola ${data.investorName}, tu identidad fue verificada exitosamente.
    </p>
    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center;">
      <p style="margin:0;color:#166534;font-size:16px;font-weight:600;">
        &#10003; Verificación completada
      </p>
    </div>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      Ya podés invertir en todas las propiedades disponibles en la plataforma. Explorá las <a href="${APP_URL}/propiedades" style="color:#2563eb;text-decoration:underline;">oportunidades de inversión</a>.
    </p>`

  return layout('Identidad verificada — BrickToken', body)
}

// ---------------------------------------------------------------------------
// KYC rejected
// ---------------------------------------------------------------------------

interface KycRejectedData {
  investorName: string
  reason?: string
}

export function kycRejected(data: KycRejectedData): string {
  const reasonText = data.reason
    ? `<p style="margin:12px 0 0;color:#991b1b;font-size:14px;"><strong>Motivo:</strong> ${data.reason}</p>`
    : ''

  const body = `
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">
      Verificación rechazada
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
      Hola ${data.investorName}, lamentablemente no pudimos verificar tu identidad.
    </p>
    <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;margin-bottom:20px;">
      <p style="margin:0;color:#991b1b;font-size:15px;font-weight:600;">
        Verificación no aprobada
      </p>
      ${reasonText}
    </div>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      Podés volver a intentar el proceso de verificación o contactarnos a <a href="mailto:soporte@bricktoken.uy" style="color:#2563eb;text-decoration:underline;">soporte@bricktoken.uy</a> si creés que es un error.
    </p>`

  return layout('Verificación rechazada — BrickToken', body)
}

// ---------------------------------------------------------------------------
// Welcome email
// ---------------------------------------------------------------------------

interface WelcomeEmailData {
  investorName: string
}

export function welcomeEmail(data: WelcomeEmailData): string {
  const body = `
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">
      Bienvenido a BrickToken
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
      Hola ${data.investorName}, gracias por unirte a BrickToken. Estamos encantados de tenerte.
    </p>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
      Con BrickToken podés invertir en propiedades uruguayas desde USD 50, recibiendo rendimientos por alquiler de forma automática.
    </p>
    <h3 style="margin:0 0 12px;color:#0f172a;font-size:16px;font-weight:600;">Próximos pasos:</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;">
          <span style="display:inline-block;width:28px;height:28px;background-color:#2563eb;color:#ffffff;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-weight:600;margin-right:12px;">1</span>
          <span style="color:#0f172a;font-size:14px;">Completá la verificación de identidad (KYC)</span>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <span style="display:inline-block;width:28px;height:28px;background-color:#2563eb;color:#ffffff;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-weight:600;margin-right:12px;">2</span>
          <span style="color:#0f172a;font-size:14px;">Explorá las propiedades disponibles</span>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <span style="display:inline-block;width:28px;height:28px;background-color:#2563eb;color:#ffffff;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-weight:600;margin-right:12px;">3</span>
          <span style="color:#0f172a;font-size:14px;">Adquirí tus primeros tokens y empezá a recibir rendimientos</span>
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin-top:24px;">
      <a href="${APP_URL}/propiedades" style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;">
        Ver propiedades
      </a>
    </div>`

  return layout('Bienvenido a BrickToken', body)
}

// ---------------------------------------------------------------------------
// Sell order filled
// ---------------------------------------------------------------------------

interface SellOrderFilledData {
  investorName: string
  propertyName: string
  tokens: number
  amount: number
}

export function sellOrderFilled(data: SellOrderFilledData): string {
  const body = `
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">
      Orden de venta completada
    </h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
      Hola ${data.investorName}, tu orden de venta fue ejecutada exitosamente.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;">
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Propiedad</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">${data.propertyName}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Tokens vendidos</p>
          <p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600;">${data.tokens}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Monto recibido</p>
          <p style="margin:4px 0 0;color:#2563eb;font-size:20px;font-weight:700;">USD ${data.amount.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      El monto fue acreditado en tu billetera. Revisá tu <a href="${APP_URL}/dashboard" style="color:#2563eb;text-decoration:underline;">panel de control</a> para más detalle.
    </p>`

  return layout('Orden de venta completada — BrickToken', body)
}

// ---------------------------------------------------------------------------
// Generic notification (for bulk/admin messages)
// ---------------------------------------------------------------------------

interface GenericNotificationData {
  subject: string
  message: string
}

export function genericNotification(data: GenericNotificationData): string {
  const body = `
    <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">
      ${data.subject}
    </h2>
    <div style="color:#475569;font-size:15px;line-height:1.7;">
      ${data.message.replace(/\n/g, '<br />')}
    </div>`

  return layout(`${data.subject} — BrickToken`, body)
}
