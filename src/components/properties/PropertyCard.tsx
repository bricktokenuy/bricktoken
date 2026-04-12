import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Property } from '@/lib/types'
import { formatUSD, formatPercent, getStatusLabel, getStatusColor, getPropertyTypeLabel } from '@/lib/demo-data'

export function PropertyCard({ property }: { property: Property }) {
  const fundingProgress = (property.tokens_sold / property.total_tokens) * 100
  const available = property.total_tokens - property.tokens_sold

  return (
    <Link href={`/propiedades/${property.slug}`}>
      <Card className="group overflow-hidden border-slate-200 bg-white transition-all hover:shadow-md hover:border-slate-300">
        {/* Image placeholder */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-800 to-blue-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <PropertyIcon type={property.property_type} />
          </div>
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="bg-gold/90 text-navy font-semibold">
              {getStatusLabel(property.status)}
            </Badge>
          </div>
          <div className="absolute right-3 top-3">
            <Badge variant="secondary" className="bg-white/90 text-slate-700 text-xs">
              {getPropertyTypeLabel(property.property_type)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {property.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {property.location}
          </div>

          {/* Property specs */}
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" /> {property.area_m2}m²
            </span>
          </div>

          {/* Price & yield */}
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs text-slate-400">Valor total</p>
              <p className="text-lg font-semibold text-slate-900">{formatUSD(property.total_value)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Desde</p>
              <p className="text-lg font-semibold text-gold">{formatUSD(property.token_price)}</p>
            </div>
          </div>

          {/* Yield */}
          {property.annual_yield_pct > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gold">
              <TrendingUp className="h-3.5 w-3.5" />
              {formatPercent(property.annual_yield_pct)} rendimiento anual est.
            </div>
          )}

          {/* Funding progress */}
          {property.status === 'funding' && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>{formatPercent(fundingProgress)} financiado</span>
                <span>{available.toLocaleString()} disponibles</span>
              </div>
              <Progress value={fundingProgress} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-gold" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function PropertyIcon({ type }: { type: string }) {
  const cls = 'h-12 w-12 text-white/20'
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
