'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatUSD, formatPercent } from '@/lib/demo-data'
import type { Valuation } from '@/lib/types'
import { Separator } from '@/components/ui/separator'

export function ValuationHistory({ propertyId }: { propertyId: string }) {
  const [valuations, setValuations] = useState<Valuation[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('valuations')
      .select('*')
      .eq('property_id', propertyId)
      .eq('status', 'applied')
      .order('valuation_date', { ascending: false })
      .then(({ data }) => {
        if (data) setValuations(data as Valuation[])
      })
  }, [propertyId])

  if (valuations.length === 0) return null

  return (
    <>
      <Separator className="border-slate-100" />
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Historial
        </p>
        <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Historial de valuaciones
        </h2>
        <div className="space-y-3">
          {valuations.map((valuation) => (
            <div
              key={valuation.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    {new Date(valuation.valuation_date).toLocaleDateString('es-UY', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  {valuation.appraiser && (
                    <span className="text-xs text-slate-400">
                      por {valuation.appraiser}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>{formatUSD(valuation.previous_value)}</span>
                  <span className="text-slate-300">&rarr;</span>
                  <span className="font-medium text-slate-900">
                    {formatUSD(valuation.new_value)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {valuation.change_pct > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                ) : valuation.change_pct < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" aria-hidden="true" />
                ) : null}
                <span
                  className={`text-sm font-semibold ${
                    valuation.change_pct > 0
                      ? 'text-green-600'
                      : valuation.change_pct < 0
                        ? 'text-red-600'
                        : 'text-slate-500'
                  }`}
                >
                  {valuation.change_pct > 0 ? '+' : ''}
                  {formatPercent(valuation.change_pct)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
