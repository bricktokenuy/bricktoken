'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Coins,
  Shield,
  Loader2,
  AlertCircle,
  Info,
} from 'lucide-react'
import { demoProperties, formatUSD, formatPercent } from '@/lib/demo-data'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type PurchaseState = 'idle' | 'loading' | 'error'

// Cualquier UUID (no estricto a v4) — los IDs reales en DB son uuid de Postgres.
// Si no matchea, asumimos que es demo data (IDs '1'..'6').
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function ComprarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const property = demoProperties.find((p) => p.slug === slug)

  const [tokenCount, setTokenCount] = useState([1])
  const [state, setState] = useState<PurchaseState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-slate-500">Propiedad no encontrada.</p>
        <Link
          href="/propiedades"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Volver a propiedades
        </Link>
      </div>
    )
  }

  const tokensAvailable = property.total_tokens - property.tokens_sold
  const selectedTokens = tokenCount[0]
  const totalCost = selectedTokens * property.token_price
  const fee = Math.round(totalCost * 0.025 * 100) / 100
  const totalWithFee = totalCost + fee
  const estimatedYield = (totalCost * property.annual_yield_pct) / 100
  const isDemoProperty = !UUID_REGEX.test(property.id)

  async function handlePurchase() {
    setState('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property!.id,
          tokens: selectedTokens,
        }),
      })

      // Session expired or never existed. The proxy normally catches this
      // before the request lands here, but if cookies are stale (e.g. logged
      // out in another tab) the API answers 401 and we bounce to login.
      if (res.status === 401) {
        const next = `/propiedades/${slug}/comprar`
        router.push(`/auth/login?next=${encodeURIComponent(next)}`)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setState('error')
        setErrorMessage(data.error || 'Error al procesar la compra.')
        return
      }

      // Redirect to checkout URL (MercadoPago or mock success page)
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        // Fallback: go to success page
        router.push(`/pago/exito?transaction_id=${data.transaction_id}`)
      }
    } catch {
      setState('error')
      setErrorMessage('Error de conexión. Intentá nuevamente.')
    }
  }

  const canPurchase =
    property.status === 'funding' && tokensAvailable > 0

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-2xl px-4 py-10">
        {/* Back link */}
        <Link
          href={`/propiedades/${slug}`}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la propiedad
        </Link>

        <div className="mt-6 space-y-6">
          {/* Header */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Confirmar inversión
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              {property.name}
            </h1>
            <p className="mt-1 text-slate-500">{property.location}</p>
          </div>

          {/* Token selector */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Seleccioná tokens
                </h2>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-400">Cantidad de tokens</span>
                  <span
                    className="font-bold text-blue-600"
                    aria-live="polite"
                  >
                    {selectedTokens}
                  </span>
                </div>
                <Slider
                  value={tokenCount}
                  onValueChange={(val) =>
                    setTokenCount(Array.isArray(val) ? val : [val])
                  }
                  min={1}
                  max={Math.min(tokensAvailable, 5000)}
                  disabled={state === 'loading'}
                  aria-label="Cantidad de tokens a comprar"
                  aria-valuemin={1}
                  aria-valuemax={Math.min(tokensAvailable, 5000)}
                  aria-valuenow={selectedTokens}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>1</span>
                  <span>{Math.min(tokensAvailable, 5000).toLocaleString()}</span>
                </div>
              </div>

              <Separator className="border-slate-100" />

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Precio por token</span>
                  <span className="text-slate-900">
                    {formatUSD(property.token_price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Subtotal ({selectedTokens} tokens)
                  </span>
                  <span className="text-slate-900">{formatUSD(totalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Comisión plataforma (2.5%)
                  </span>
                  <span className="text-slate-900">{formatUSD(fee)}</span>
                </div>
                <Separator className="border-slate-100" />
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-slate-900">Total</span>
                  <span className="text-xl font-bold text-slate-900">
                    {formatUSD(totalWithFee)}
                  </span>
                </div>
                {property.annual_yield_pct > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Renta anual estimada
                    </span>
                    <span className="font-semibold text-blue-600">
                      {formatUSD(estimatedYield)}/año (
                      {formatPercent(property.annual_yield_pct)})
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security notice */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Pago seguro con MercadoPago</p>
              <p className="mt-1 text-blue-700">
                Serás redirigido a MercadoPago para completar el pago de forma
                segura. Aceptamos tarjetas de crédito, débito y transferencias
                bancarias.
              </p>
            </div>
          </div>

          {/* Risk disclaimer */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-900 leading-relaxed">
              Confirmás que entendés que esta es una inversión con riesgos, que las
              rentabilidades son estimadas y no garantizadas, y que aceptás los{' '}
              <Link href="/legal/terminos" className="underline font-medium hover:text-amber-700">
                Términos
              </Link>
              , la{' '}
              <Link href="/legal/privacidad" className="underline font-medium hover:text-amber-700">
                Política de privacidad
              </Link>
              {' '}y las{' '}
              <Link href="/legal/regulaciones" className="underline font-medium hover:text-amber-700">
                Regulaciones aplicables
              </Link>
              .
            </p>
          </div>

          {/* Error message */}
          {state === 'error' && errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            {isDemoProperty ? (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <Info className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-medium text-slate-900">Función disponible próximamente.</span>{' '}
                  Esta es una propiedad de demostración mientras la plataforma está en preview.
                </p>
              </div>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={!canPurchase || state === 'loading'}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando pago...
                  </>
                ) : (
                  `Confirmar compra por ${formatUSD(totalWithFee)}`
                )}
              </button>
            )}
            <Link
              href={`/propiedades/${slug}`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
