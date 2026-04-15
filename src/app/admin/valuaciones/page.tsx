'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  demoValuations,
  demoProperties,
  formatUSD,
  formatPercent,
} from '@/lib/demo-data'
import { Valuation } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle,
  Clock,
  BarChart3,
} from 'lucide-react'

function ChangeIndicator({ pct }: { pct: number }) {
  if (pct > 0) {
    return (
      <span className="flex items-center gap-1 text-green-600 font-medium">
        <TrendingUp className="h-4 w-4" />
        +{formatPercent(pct)}
      </span>
    )
  }
  if (pct < 0) {
    return (
      <span className="flex items-center gap-1 text-red-600 font-medium">
        <TrendingDown className="h-4 w-4" />
        {formatPercent(pct)}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-slate-500 font-medium">
      <Minus className="h-4 w-4" />
      {formatPercent(pct)}
    </span>
  )
}

export default function ValuacionesPage() {
  const [valuations, setValuations] = useState<Valuation[]>([...demoValuations])
  const [applying, setApplying] = useState<string | null>(null)

  const handleApply = async (valuationId: string) => {
    setApplying(valuationId)
    try {
      const res = await fetch('/api/admin/valuaciones/aplicar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valuation_id: valuationId }),
      })

      if (res.ok) {
        setValuations((prev) =>
          prev.map((v) =>
            v.id === valuationId
              ? { ...v, status: 'applied' as const, applied_at: new Date().toISOString() }
              : v
          )
        )
      }
    } catch (error) {
      console.error('Error applying valuation:', error)
    } finally {
      setApplying(null)
    }
  }

  const sortedValuations = [...valuations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const pendingCount = valuations.filter((v) => v.status === 'pending').length
  const appliedCount = valuations.filter((v) => v.status === 'applied').length

  const stats = [
    {
      label: 'Total valuaciones',
      value: valuations.length.toString(),
      icon: BarChart3,
    },
    {
      label: 'Pendientes',
      value: pendingCount.toString(),
      icon: Clock,
    },
    {
      label: 'Aplicadas',
      value: appliedCount.toString(),
      icon: CheckCircle,
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/admin"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Administracion
            </p>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Valuaciones</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las revaluaciones de propiedades
          </p>
        </div>
        <Link href="/admin/valuaciones/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva valuacion
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-blue-50 p-3">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Valuations table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Propiedad
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Fecha
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Valor anterior
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Nuevo valor
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Cambio
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Tasador
                </TableHead>
                <TableHead className="text-center text-xs font-medium uppercase tracking-wider text-slate-400">
                  Estado
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedValuations.map((valuation) => {
                const propertyName =
                  valuation.property?.name ??
                  demoProperties.find((p) => p.id === valuation.property_id)?.name ??
                  'Propiedad'

                return (
                  <TableRow key={valuation.id} className="border-slate-100">
                    <TableCell className="font-medium text-slate-900">
                      {propertyName}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(valuation.valuation_date).toLocaleDateString('es-UY', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {formatUSD(valuation.previous_value)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {formatUSD(valuation.new_value)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ChangeIndicator pct={valuation.change_pct} />
                    </TableCell>
                    <TableCell className="text-slate-500 max-w-[200px] truncate">
                      {valuation.appraiser ?? '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {valuation.status === 'applied' ? (
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Aplicada
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="mr-1 h-3 w-3" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {valuation.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={applying === valuation.id}
                          onClick={() => handleApply(valuation.id)}
                        >
                          {applying === valuation.id ? 'Aplicando...' : 'Aplicar'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {sortedValuations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                    No hay valuaciones registradas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
