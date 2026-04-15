'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Coins,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  demoProperties,
  formatUSD,
  formatPercent,
} from '@/lib/demo-data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Property } from '@/lib/types'

export default function ComprarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState<Property | null>(null)
  const [tokenCount, setTokenCount] = useState([1])
  const [purchasing, setPurchasing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<{
    tokens: number
    amount: number
    fee: number
    total: number
  } | null>(null)

  const selectedTokens = tokenCount[0]

  // Check auth and load property
  useEffect(() => {
    async function init() {
      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Try to load from Supabase first, fall back to demo data
      const { data: dbProperty } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .single()

      if (dbProperty) {
        setProperty(dbProperty as Property)
      } else {
        const demo = demoProperties.find((p) => p.slug === slug)
        if (demo) {
          setProperty(demo)
        }
      }

      setLoading(false)
    }

    init()
  }, [slug, router, supabase])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Propiedad no encontrada
        </h1>
        <Link
          href="/propiedades"
          className="text-blue-600 hover:underline"
        >
          Volver a propiedades
        </Link>
      </div>
    )
  }

  const tokensAvailable = property.total_tokens - property.tokens_sold
  const maxTokens = Math.min(tokensAvailable, 500)
  const totalCost = selectedTokens * property.token_price
  const fee = Math.round(totalCost * 0.025 * 100) / 100
  const grandTotal = totalCost + fee
  const estimatedYield =
    property.annual_yield_pct > 0
      ? (totalCost * property.annual_yield_pct) / 100
      : 0

  async function handlePurchase() {
    if (!property) return

    setError(null)
    setPurchasing(true)

    try {
      const res = await fetch('/api/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property.id,
          tokens: selectedTokens,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al procesar la compra.')
        setPurchasing(false)
        return
      }

      setPurchaseResult(data.data)
      setSuccess(true)
    } catch {
      setError('Error de conexion. Intente nuevamente.')
    } finally {
      setPurchasing(false)
    }
  }

  // Success state
  if (success && purchaseResult) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-lg">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Compra exitosa
                </h1>
                <p className="text-slate-500">
                  Tu inversion en {property.name} ha sido confirmada.
                </p>
              </div>

              <Separator className="border-slate-100" />

              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Tokens adquiridos</span>
                  <span className="font-semibold text-slate-900">
                    {purchaseResult.tokens}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Monto</span>
                  <span className="font-semibold text-slate-900">
                    {formatUSD(purchaseResult.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Comision (2.5%)</span>
                  <span className="font-semibold text-slate-900">
                    {formatUSD(purchaseResult.fee)}
                  </span>
                </div>
                <Separator className="border-slate-100" />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatUSD(purchaseResult.total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700"
                >
                  Ir al Dashboard
                </Link>
                <Link
                  href={`/propiedades/${property.slug}`}
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Volver a la propiedad
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Purchase form
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href={`/propiedades/${property.slug}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la propiedad
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Left: Property summary */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Propiedad seleccionada
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              {property.name}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                  Resumen del activo
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-slate-400">Precio por token</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatUSD(property.token_price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Tokens disponibles</p>
                  <p className="text-xl font-bold text-slate-900">
                    {tokensAvailable.toLocaleString()}
                    <span className="text-sm font-normal text-slate-400">
                      {' '}
                      / {property.total_tokens.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Valor total</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatUSD(property.total_value)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Rendimiento anual</p>
                  <p className="text-xl font-bold text-blue-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {property.annual_yield_pct > 0
                      ? formatPercent(property.annual_yield_pct)
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {property.fideicomiso_number && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  Fideicomiso: {property.fideicomiso_number}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Purchase form */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Compra de tokens
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Configurar inversion
            </h2>
          </div>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6 space-y-6">
              {/* Token selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">
                    Cantidad de tokens
                  </label>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-blue-600" />
                    <Input
                      type="number"
                      min={1}
                      max={maxTokens}
                      value={selectedTokens}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10)
                        if (!isNaN(val) && val >= 1 && val <= maxTokens) {
                          setTokenCount([val])
                        }
                      }}
                      className="w-20 text-center font-bold text-blue-600"
                    />
                  </div>
                </div>
                <Slider
                  value={tokenCount}
                  onValueChange={(val) =>
                    setTokenCount(Array.isArray(val) ? val : [val])
                  }
                  min={1}
                  max={maxTokens}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>1</span>
                  <span>{maxTokens}</span>
                </div>
              </div>

              <Separator className="border-slate-100" />

              {/* Investment summary */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">
                  Resumen de inversion
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-400">
                      {selectedTokens} tokens x {formatUSD(property.token_price)}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatUSD(totalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-400">
                      Comision plataforma (2.5%)
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatUSD(fee)}
                    </span>
                  </div>
                  <Separator className="border-slate-100" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-slate-900">
                      Total a pagar
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatUSD(grandTotal)}
                    </span>
                  </div>
                  {estimatedYield > 0 && (
                    <div className="flex justify-between items-baseline rounded-lg bg-blue-50 p-3 mt-2">
                      <span className="text-sm text-blue-700">
                        Renta anual estimada
                      </span>
                      <span className="font-bold text-blue-700">
                        {formatUSD(estimatedYield)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="border-slate-100" />

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Confirm button */}
              <button
                onClick={handlePurchase}
                disabled={purchasing || tokensAvailable === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar compra'
                )}
              </button>

              <p className="text-xs text-slate-400 text-center">
                Al confirmar, acepta los terminos y condiciones de la plataforma.
                La compra es irrevocable una vez confirmada.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
