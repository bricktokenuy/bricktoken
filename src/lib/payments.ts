import crypto from 'node:crypto'
import { env } from './env'

// ----- Types -----

export interface PaymentPreferenceData {
  transactionId: string
  propertyName: string
  tokens: number
  amount: number
  fee: number
  investorEmail: string
}

export interface PaymentPreference {
  id: string
  init_point: string
}

export interface PaymentStatus {
  id: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  externalId: string | null
  amount: number
  metadata: Record<string, unknown>
}

// ----- Mock mode helpers -----

function generateMockId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ----- MercadoPago REST helpers -----

const MP_BASE = 'https://api.mercadopago.com'

async function mpFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${MP_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.mercadopago.accessToken}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`MercadoPago API error ${res.status}: ${body}`)
  }

  return res.json() as Promise<T>
}

// ----- Public API -----

/**
 * Create a MercadoPago checkout preference (or mock equivalent).
 * Returns an id and the init_point URL to redirect the user to.
 */
export async function createPaymentPreference(
  data: PaymentPreferenceData
): Promise<PaymentPreference> {
  if (env.mercadopago.isMockMode) {
    const mockId = generateMockId()
    const successUrl = `${env.app.url}/pago/exito?transaction_id=${data.transactionId}&payment_id=${mockId}`
    return {
      id: mockId,
      init_point: successUrl,
    }
  }

  // Real MercadoPago preference
  const preference = await mpFetch<{
    id: string
    init_point: string
  }>('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify({
      items: [
        {
          title: `BrickToken - ${data.propertyName} (${data.tokens} tokens)`,
          quantity: 1,
          unit_price: data.amount + data.fee,
          currency_id: 'UYU',
        },
      ],
      payer: {
        email: data.investorEmail,
      },
      back_urls: {
        success: `${env.app.url}/pago/exito?transaction_id=${data.transactionId}`,
        failure: `${env.app.url}/pago/error?transaction_id=${data.transactionId}`,
        pending: `${env.app.url}/pago/exito?transaction_id=${data.transactionId}&pending=true`,
      },
      auto_return: 'approved',
      external_reference: data.transactionId,
      notification_url: `${env.app.url}/api/webhooks/mercadopago`,
      metadata: {
        transaction_id: data.transactionId,
        tokens: data.tokens,
        amount: data.amount,
        fee: data.fee,
      },
    }),
  })

  return {
    id: preference.id,
    init_point: preference.init_point,
  }
}

/** Max age (seconds) accepted for a webhook timestamp, to bound replay. */
const WEBHOOK_TS_TOLERANCE_SECONDS = 5 * 60

export interface WebhookVerificationInput {
  /** `data.id` query param of the notification URL (MercadoPago resource id). */
  dataId: string | null
  /** Value of the `x-request-id` request header. */
  requestId: string | null
  /** Value of the `x-signature` request header. */
  signature: string | null
}

/**
 * Verify a MercadoPago webhook request using the official x-signature scheme.
 *
 * MercadoPago sends `x-signature: ts=<unix-ts>,v1=<hex-hmac>`. The signed
 * manifest is:
 *
 *   id:<data.id>;request-id:<x-request-id>;ts:<ts>;
 *
 * where each segment is included only when its value is present, `data.id` is
 * lowercased when alphanumeric, and v1 is HMAC-SHA256(manifest, secret) as a
 * lowercase hex digest. See MercadoPago webhooks docs, "Validate origin".
 *
 * In mock mode this always returns true. Outside mock mode, if the webhook
 * secret is not configured we FAIL CLOSED (return false) — we never "pass
 * anyway" on missing config.
 */
export function verifyPaymentWebhook(input: WebhookVerificationInput): boolean {
  if (env.mercadopago.isMockMode) {
    return true
  }

  const secret = env.mercadopago.webhookSecret
  if (!secret) {
    // Real integration but no secret configured: reject and surface a config
    // error so it is caught in deploy, rather than accepting forged webhooks.
    console.error(
      'MERCADOPAGO_WEBHOOK_SECRET is not set — rejecting webhook (fail closed).'
    )
    return false
  }

  const { dataId, requestId, signature } = input
  if (!signature) {
    return false
  }

  // Parse `ts=<...>,v1=<...>` (order-independent, tolerant of spaces).
  let ts: string | undefined
  let v1: string | undefined
  for (const part of signature.split(',')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const key = part.slice(0, eq).trim()
    const value = part.slice(eq + 1).trim()
    if (key === 'ts') ts = value
    else if (key === 'v1') v1 = value
  }

  if (!ts || !v1) {
    return false
  }

  // Replay guard: reject stale timestamps.
  const tsSeconds = Number(ts)
  if (!Number.isFinite(tsSeconds)) {
    return false
  }
  const nowSeconds = Date.now() / 1000
  if (Math.abs(nowSeconds - tsSeconds) > WEBHOOK_TS_TOLERANCE_SECONDS) {
    console.error('MercadoPago webhook timestamp outside tolerance window.')
    return false
  }

  // Build the manifest, omitting absent segments. data.id is lowercased when
  // alphanumeric (MercadoPago rule).
  const normalizedDataId =
    dataId && /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId

  let manifest = ''
  if (normalizedDataId) manifest += `id:${normalizedDataId};`
  if (requestId) manifest += `request-id:${requestId};`
  manifest += `ts:${ts};`

  const expected = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  // Timing-safe comparison. Guard against length mismatch (timingSafeEqual
  // throws on differing lengths) and non-hex input.
  const expectedBuf = Buffer.from(expected, 'hex')
  let providedBuf: Buffer
  try {
    providedBuf = Buffer.from(v1, 'hex')
  } catch {
    return false
  }
  if (expectedBuf.length !== providedBuf.length || providedBuf.length === 0) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuf, providedBuf)
}

/**
 * Get the status of a payment from MercadoPago.
 * In mock mode, returns approved immediately.
 */
export async function getPaymentStatus(
  paymentId: string
): Promise<PaymentStatus> {
  if (env.mercadopago.isMockMode) {
    return {
      id: paymentId,
      status: 'approved',
      externalId: paymentId,
      amount: 0,
      metadata: {},
    }
  }

  const payment = await mpFetch<{
    id: number
    status: string
    transaction_amount: number
    external_reference: string
    metadata: Record<string, unknown>
  }>(`/v1/payments/${paymentId}`)

  const statusMap: Record<string, PaymentStatus['status']> = {
    approved: 'approved',
    pending: 'pending',
    in_process: 'pending',
    rejected: 'rejected',
    cancelled: 'cancelled',
    refunded: 'cancelled',
  }

  return {
    id: String(payment.id),
    status: statusMap[payment.status] ?? 'pending',
    externalId: String(payment.id),
    amount: payment.transaction_amount,
    metadata: payment.metadata ?? {},
  }
}
