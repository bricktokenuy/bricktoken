/**
 * Environment variables for the payment system.
 *
 * MERCADOPAGO_ACCESS_TOKEN
 *   MercadoPago access token for creating preferences and verifying payments.
 *   When not set, the payment system runs in mock mode (auto-approve).
 *
 * MERCADOPAGO_WEBHOOK_SECRET
 *   Secret used to verify MercadoPago webhook signatures.
 *   Only required in production with real MP integration.
 *
 * NEXT_PUBLIC_APP_URL
 *   Base URL for payment redirects (success/error pages).
 *   Defaults to http://localhost:3000 in development.
 */

export const env = {
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
    webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET ?? '',
    isMockMode: !process.env.MERCADOPAGO_ACCESS_TOKEN,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  },
} as const
