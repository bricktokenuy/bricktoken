'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
const SOFT_MAX_TOKENS = 5000

interface Props {
  slug: string
  tokenPrice: number
  tokensAvailable: number
  annualYieldPct: number
}

export function InvestmentCalculator({
  slug,
  tokenPrice,
  tokensAvailable,
  annualYieldPct,
}: Props) {
  const sliderMax = Math.min(tokensAvailable, SOFT_MAX_TOKENS)
  const [tokenCount, setTokenCount] = useState<number[]>([1])
  const selectedTokens = tokenCount[0]
  const totalCost = selectedTokens * tokenPrice
  const estimatedYield = (totalCost * annualYieldPct) / 100

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Simular
          </p>
          <h2 className="text-lg font-semibold text-slate-900">Calculadora de inversión</h2>
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
            onValueChange={(val) => setTokenCount(Array.isArray(val) ? val : [val])}
            min={1}
            max={sliderMax}
            aria-label="Cantidad de tokens a comprar"
            aria-valuemin={1}
            aria-valuemax={sliderMax}
            aria-valuenow={selectedTokens}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>1</span>
            <span>{sliderMax.toLocaleString()}</span>
          </div>
        </div>

        <Separator className="border-slate-100" />

        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-slate-400">Inversión total</span>
            <span className="text-lg font-bold text-slate-900">
              USD {totalCost.toFixed(2)}
            </span>
          </div>
          {annualYieldPct > 0 && (
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-slate-400">
                Renta anual estimada
              </span>
              <span className="text-lg font-bold text-blue-600">
                USD {estimatedYield.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/propiedades/${slug}/comprar`}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
          )}
        >
          Invertir
        </Link>
      </CardContent>
    </Card>
  )
}

