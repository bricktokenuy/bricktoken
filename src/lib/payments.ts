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

/**
 * Verify a MercadoPago webhook request.
 * In mock mode, always returns true.
 */
export function verifyPaymentWebhook(
  body: string,
  signature: string | null
): boolean {
  if (env.mercadopago.isMockMode) {
    return true
  }

  // MercadoPago sends x-signature header with ts and v1 parts
  // Format: ts=<timestamp>,v1=<hash>
  if (!signature || !env.mercadopago.webhookSecret) {
    return false
  }

  // Basic verification: check that the signature header is present and well-formed
  // For production, implement full HMAC verification per MP docs
  const parts = signature.split(',')
  const tsEntry = parts.find((p) => p.startsWith('ts='))
  const v1Entry = parts.find((p) => p.startsWith('v1='))

  if (!tsEntry || !v1Entry) {
    return false
  }

  // In production, you would compute HMAC-SHA256 of the template string
  // and compare it with v1. For now we trust the presence of both parts.
  return true
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
