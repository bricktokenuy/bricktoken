'use client'

import { Wallet, TrendingUp, Building2, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { demoHoldings, demoTransactions, formatUSD, formatPercent, getStatusLabel } from '@/lib/demo-data'

const transactionTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  buy: { label: 'Compra', icon: <ArrowUpRight className="h-4 w-4" />, color: 'text-blue-600' },
  sell: { label: 'Venta', icon: <ArrowDownLeft className="h-4 w-4" />, color: 'text-slate-400' },
  yield: { label: 'Rendimiento', icon: <TrendingUp className="h-4 w-4" />, color: 'text-slate-600' },
}

export default function DashboardPage() {
  const totalInvested = demoHoldings.reduce(
    (sum, h) => sum + h.tokens * h.purchase_price,
    0
  )

  const estimatedAnnualYield = demoHoldings.reduce((sum, h) => {
    const yieldPct = h.property?.annual_yield_pct ?? 0
    const value = h.tokens * h.purchase_price
    return sum + value * (yieldPct / 100)
  }, 0)

  const weightedYieldPct =
    totalInvested > 0 ? (estimatedAnnualYield / totalInvested) * 100 : 0

  const propertyCount = new Set(demoHoldings.map((h) => h.property_id)).size

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Portfolio
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Mi portafolio</h1>
        </div>

        {/* Summary cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total invertido
              </CardTitle>
              <Wallet className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{formatUSD(totalInvested)}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Rendimiento anual estimado
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {formatUSD(estimatedAnnualYield)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {formatPercent(weightedYieldPct)} promedio ponderado
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Propiedades
              </CardTitle>
              <Building2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{propertyCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Activos
            </p>
            <h2 className="text-xl font-semibold text-slate-900">Mis inversiones</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoHoldings.map((holding) => {
              const currentValue = holding.tokens * holding.purchase_price
              const yieldPct = holding.property?.annual_yield_pct ?? 0

              return (
                <Card key={holding.id} className="border-slate-200 shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-slate-900">
                      {holding.property?.name ?? 'Propiedad'}
                    </CardTitle>
                    <p className="text-sm text-slate-400">
                      {holding.property?.location}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Tokens</span>
                      <span className="font-medium text-slate-900">{holding.tokens}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Valor actual</span>
                      <span className="font-medium text-slate-900">{formatUSD(currentValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Rendimiento</span>
                      <span className="font-medium text-blue-600">
                        {formatPercent(yieldPct)} anual
                      </span>
                    </div>
                    <div className="pt-2">
                      <Badge variant="outline" className="text-xs border-slate-200 text-slate-500">
                        {getStatusLabel(holding.property?.status ?? '')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Transactions */}
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Actividad
            </p>
            <h2 className="text-xl font-semibold text-slate-900">Historial de transacciones</h2>
          </div>
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400">Fecha</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400">Propiedad</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400">Tipo</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">Tokens</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">Monto</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoTransactions.map((tx) => {
                    const config = transactionTypeConfig[tx.type]
                    return (
                      <TableRow key={tx.id} className="border-slate-100">
                        <TableCell className="whitespace-nowrap text-sm text-slate-500">
                          {new Date(tx.created_at).toLocaleDateString('es-UY', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-900">
                          {tx.property?.name ?? 'Propiedad'}
                        </TableCell>
                        <TableCell>
                          <span className={`flex items-center gap-1 text-sm ${config.color}`}>
                            {config.icon}
                            {config.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm text-slate-500">
                          {tx.tokens > 0 ? tx.tokens : '-'}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-slate-900">
                          {formatUSD(tx.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={tx.status === 'confirmed' ? 'default' : 'secondary'}
                            className={
                              tx.status === 'confirmed'
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200'
                                : tx.status === 'failed'
                                  ? 'bg-slate-100 text-slate-500 hover:bg-slate-100 border border-slate-200'
                                  : 'bg-slate-50 text-slate-400 hover:bg-slate-50 border border-slate-200'
                            }
                          >
                            {tx.status === 'confirmed'
                              ? 'Confirmada'
                              : tx.status === 'pending'
                                ? 'Pendiente'
                                : 'Fallida'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
