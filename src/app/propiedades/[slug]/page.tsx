import type { Metadata } from 'next'
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
  ImageIcon,
} from 'lucide-react'
import { demoProperties, formatUSD, formatPercent, getStatusLabel, getStatusColor, getPropertyTypeLabel } from '@/lib/demo-data'
import { getPropertyBySlug } from '@/lib/queries'
import type { Property } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ValuationHistory } from './ValuationHistory'
import { InvestmentCalculator } from './InvestmentCalculator'

async function findProperty(slug: string): Promise<Property | null> {
  const dbProperty = await getPropertyBySlug(slug)
  if (dbProperty) return dbProperty
  // Fallback to demo data (pre-launch) when DB is empty or slug not found
  return demoProperties.find((p) => p.slug === slug) ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const property = await findProperty(slug)
  if (!property) {
    return { title: 'Propiedad no encontrada' }
  }
  return {
    title: property.name,
    description: property.description.slice(0, 160),
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = await findProperty(slug)

  if (!property) {
    notFound()
  }

  const fundingProgress = (property.tokens_sold / property.total_tokens) * 100
  const tokensAvailable = property.total_tokens - property.tokens_sold

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
          {/* Gallery placeholder — pendiente de carga real */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-3">
            <ImageIcon className="h-12 w-12 opacity-50" aria-hidden="true" />
            <p className="text-sm font-medium">Galería pendiente de carga</p>
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
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
              Acerca de
            </p>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Descripción</h2>
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
            <h2 className="text-lg font-semibold text-slate-900 mb-5">Características</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {property.bedrooms !== null && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Bed className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-slate-400">Dormitorios</p>
                    <p className="font-semibold text-slate-900">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Bath className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-slate-400">Baños</p>
                    <p className="font-semibold text-slate-900">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <Maximize className="h-5 w-5 text-blue-600" aria-hidden="true" />
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
                    <FileText className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-slate-900">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Fideicomiso */}
          {property.fideicomiso_number && (
            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-400">Fideicomiso</p>
                <p className="font-semibold text-blue-900">
                  {property.fideicomiso_number}
                </p>
              </div>
            </div>
          )}

          {/* Historial de valuaciones */}
          <ValuationHistory propertyId={property.id} />
        </div>

        {/* Right column: investment panel */}
        <div className="space-y-6">
          {/* Tokenomics */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Inversión
                </p>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-600" aria-hidden="true" />
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
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    {property.annual_yield_pct > 0
                      ? formatPercent(property.annual_yield_pct)
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Funding progress */}
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progreso de financiación</span>
                  <span className="font-semibold text-slate-900">{formatPercent(fundingProgress)}</span>
                </div>
                <Progress value={fundingProgress} className="h-2.5" />
              </div>
            </CardContent>
          </Card>

          {/* Investment calculator */}
          {tokensAvailable > 0 && (
            <InvestmentCalculator
              slug={property.slug}
              tokenPrice={property.token_price}
              tokensAvailable={tokensAvailable}
              annualYieldPct={property.annual_yield_pct}
            />
          )}
        </div>
      </div>
    </div>
  )
}
