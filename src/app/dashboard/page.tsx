'use client'

import { useState, useEffect } from 'react'
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
import { formatUSD, formatPercent, getStatusLabel } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/client'
import type { Holding, Transaction, Property } from '@/lib/types'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const transactionTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  buy: { label: 'Compra', icon: <ArrowUpRight className="h-4 w-4" />, color: 'text-blue-600' },
  sell: { label: 'Venta', icon: <ArrowDownLeft className="h-4 w-4" />, color: 'text-slate-400' },
  yield: { label: 'Rendimiento', icon: <TrendingUp className="h-4 w-4" />, color: 'text-slate-600' },
}

type HoldingWithProperty = Holding & { properties: Property }
type TransactionWithProperty = Transaction & { properties: Property }

export default function DashboardPage() {
  const [holdings, setHoldings] = useState<HoldingWithProperty[]>([])
  const [transactions, setTransactions] = useState<TransactionWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get investor profile
      const { data: investor } = await supabase
        .from('investors')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (investor) setUserName(investor.full_name)

      // Get holdings with property data
      const { data: holdingsData } = await supabase
        .from('holdings')
        .select('*, properties(*)')
        .eq('investor_id', user.id)
        .eq('status', 'active')

      if (holdingsData) setHoldings(holdingsData as HoldingWithProperty[])

      // Get transactions with property data
      const { data: txData } = await supabase
        .from('transactions')
        .select('*, properties(*)')
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (txData) setTransactions(txData as TransactionWithProperty[])

      setLoading(false)
    }
    fetchData()
  }, [])

  const totalInvested = holdings.reduce(
    (sum, h) => sum + h.tokens * Number(h.purchase_price),
    0
  )

  const estimatedAnnualYield = holdings.reduce((sum, h) => {
    const yieldPct = h.properties?.annual_yield_pct ?? 0
    const value = h.tokens * Number(h.purchase_price)
    return sum + value * (Number(yieldPct) / 100)
  }, 0)

  const weightedYieldPct =
    totalInvested > 0 ? (estimatedAnnualYield / totalInvested) * 100 : 0

  const propertyCount = new Set(holdings.map((h) => h.property_id)).size

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Portfolio
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {userName ? `Hola, ${userName.split(' ')[0]}` : 'Mi portafolio'}
          </h1>
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
              {weightedYieldPct > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  {formatPercent(weightedYieldPct)} promedio ponderado
                </p>
              )}
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
          {holdings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {holdings.map((holding) => {
                const currentValue = holding.tokens * Number(holding.purchase_price)
                const yieldPct = Number(holding.properties?.annual_yield_pct ?? 0)

                return (
                  <Card key={holding.id} className="border-slate-200 shadow-sm bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-slate-900">
                        {holding.properties?.name ?? 'Propiedad'}
                      </CardTitle>
                      <p className="text-sm text-slate-400">
                        {holding.properties?.location}
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
                          {getStatusLabel(holding.properties?.status ?? '')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-dashed border-slate-200 bg-white">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Building2 className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-500 mb-2">
                  Todavía no tenés inversiones
                </p>
                <p className="text-sm text-slate-400 mb-6">
                  Explorá las propiedades disponibles y empezá a invertir.
                </p>
                <Link
                  href="/propiedades"
                  className={cn(
                    buttonVariants(),
                    'bg-blue-600 hover:bg-blue-700 text-white'
                  )}
                >
                  Ver propiedades
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Transactions */}
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Actividad
            </p>
            <h2 className="text-xl font-semibold text-slate-900">Historial de transacciones</h2>
          </div>
          {transactions.length > 0 ? (
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
                    {transactions.map((tx) => {
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
                            {tx.properties?.name ?? 'Propiedad'}
                          </TableCell>
                          <TableCell>
                            <span className={`flex items-center gap-1 text-sm ${config?.color ?? ''}`}>
                              {config?.icon}
                              {config?.label ?? tx.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-sm text-slate-500">
                            {tx.tokens > 0 ? tx.tokens : '-'}
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium text-slate-900">
                            {formatUSD(Number(tx.amount))}
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
          ) : (
            <Card className="border-dashed border-slate-200 bg-white">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-slate-500">No hay transacciones aún</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
