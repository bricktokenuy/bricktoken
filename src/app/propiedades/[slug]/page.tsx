'use client'

import { useState, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  TrendingUp,
  FileText,
  Shield,
  Coins,
  ArrowLeft,
} from 'lucide-react'
import { demoProperties, formatUSD, formatPercent, getStatusLabel, getStatusColor, getPropertyTypeLabel } from '@/lib/demo-data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

function PropertyTypeIcon({ type }: { type: string }) {
  const cls = 'h-24 w-24'
  switch (type) {
    case 'house':
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    case 'land':
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    case 'commercial':
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    default:
      return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  }
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const property = demoProperties.find((p) => p.slug === slug)

  if (!property) {
    notFound()
  }

  const fundingProgress = (property.tokens_sold / property.total_tokens) * 100
  const tokensAvailable = property.total_tokens - property.tokens_sold

  const [tokenCount, setTokenCount] = useState([1])
  const selectedTokens = tokenCount[0]
  const totalCost = selectedTokens * property.token_price
  const estimatedYield = (totalCost * property.annual_yield_pct) / 100

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/propiedades"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a propiedades
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Left column: property info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image placeholder */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-blue-900 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <PropertyTypeIcon type={property.property_type} />
            </div>
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge className={getStatusColor(property.status)}>
                {getStatusLabel(property.status)}
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-slate-700">
                {getPropertyTypeLabel(property.property_type)}
              </Badge>
            </div>
          </div>

          {/* Header */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Propiedad
            </p>
            <h1 className="text-3xl font-bold text-slate-900">{property.name}</h1>
            <div className="mt-3 flex items-center gap-1.5 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Acerca de
            </p>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Descripcion</h2>
            <p className="text-slate-500 leading-relaxed">
              {property.description}
            </p>
          </div>

          <Separator className="border-slate-100" />

          {/* Specs */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Detalles
            </p>
            <h2 className="text-lg font-semibold text-slate-900 mb-5">Caracteristicas</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {property.bedrooms !== null && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Bed className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-400">Dormitorios</p>
                    <p className="font-semibold text-slate-900">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Bath className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-400">Banos</p>
                    <p className="font-semibold text-slate-900">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <Maximize className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-slate-400">Superficie</p>
                  <p className="font-semibold text-slate-900">{property.area_m2.toLocaleString()} m²</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="border-slate-100" />

          {/* Documents */}
          {property.documents.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                Legal
              </p>
              <h2 className="text-lg font-semibold text-slate-900 mb-5">Documentos</h2>
              <div className="space-y-2">
                {property.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-900">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Fideicomiso */}
          {property.fideicomiso_number && (
            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-400">Fideicomiso</p>
                <p className="font-semibold text-blue-900">
                  {property.fideicomiso_number}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right column: investment panel */}
        <div className="space-y-6">
          {/* Tokenomics */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Inversion
                </p>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-600" />
                  Tokenomics
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-slate-400">Valor total</p>
                  <p className="text-xl font-bold text-slate-900">{formatUSD(property.total_value)}</p>
                </div>
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
                      {' '}/ {property.total_tokens.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Rendimiento anual</p>
                  <p className="text-xl font-bold flex items-center gap-1 text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    {property.annual_yield_pct > 0
                      ? formatPercent(property.annual_yield_pct)
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Funding progress */}
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progreso de financiacion</span>
                  <span className="font-semibold text-slate-900">{formatPercent(fundingProgress)}</span>
                </div>
                <Progress value={fundingProgress} className="h-2.5" />
              </div>
            </CardContent>
          </Card>

          {/* Investment calculator */}
          {tokensAvailable > 0 && (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                    Simular
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">Calculadora de inversion</h2>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-400">Cantidad de tokens</span>
                    <span className="font-bold text-blue-600">{selectedTokens}</span>
                  </div>
                  <Slider
                    value={tokenCount}
                    onValueChange={(val) => setTokenCount(Array.isArray(val) ? val : [val])}
                    min={1}
                    max={Math.min(tokensAvailable, 500)}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                    <span>1</span>
                    <span>{Math.min(tokensAvailable, 500)}</span>
                  </div>
                </div>

                <Separator className="border-slate-100" />

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-400">Inversion total</span>
                    <span className="text-lg font-bold text-slate-900">{formatUSD(totalCost)}</span>
                  </div>
                  {property.annual_yield_pct > 0 && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-slate-400">
                        Renta anual estimada
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatUSD(estimatedYield)}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href="/auth/registro"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
                  )}
                >
                  Invertir
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
