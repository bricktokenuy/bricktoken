'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Holding, Transaction, Property } from '@/lib/types'
import Link from 'next/link'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  Plus,
} from 'lucide-react'
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
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatUSD, formatPercent, getStatusLabel } from '@/lib/demo-data'

type HoldingWithProperty = Holding & { properties: Property }
type TransactionWithProperty = Transaction & { properties: Property }

const transactionTypeConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  buy: {
    label: 'Compra',
    icon: <ArrowUpRight className="h-4 w-4" />,
    color: 'text-blue-600',
  },
  sell: {
    label: 'Venta',
    icon: <ArrowDownLeft className="h-4 w-4" />,
    color: 'text-slate-400',
  },
  yield: {
    label: 'Rendimiento',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-slate-600',
  },
}

export default function DashboardPage() {
  const [holdings, setHoldings] = useState<HoldingWithProperty[]>([])
  const [transactions, setTransactions] = useState<TransactionWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [kycStatus, setKycStatus] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Fetch investor profile
      const { data: investor } = await supabase
        .from('investors')
        .select('full_name, kyc_status')
        .eq('id', user.id)
        .single()

      if (investor) {
        const firstName = investor.full_name?.split(' ')[0] ?? ''
        setUserName(firstName)
        setKycStatus(investor.kyc_status)
      }

      // Fetch holdings with properties
      const { data: holdingsData } = await supabase
        .from('holdings')
        .select('*, properties(*)')
        .eq('investor_id', user.id)
        .order('purchased_at', { ascending: false })

      if (holdingsData) {
        setHoldings(holdingsData as HoldingWithProperty[])
      }

      // Fetch transactions with properties
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*, properties(*)')
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false })

      if (transactionsData) {
        setTransactions(transactionsData as TransactionWithProperty[])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Cargando tu portafolio...</p>
        </div>
      </div>
    )
  }

  // Portfolio calculations
  const totalInvested = holdings.reduce(
    (sum, h) => sum + h.tokens * h.purchase_price,
    0
  )

  const totalCurrentValue = holdings.reduce(
    (sum, h) => sum + h.tokens * (h.properties?.token_price ?? h.purchase_price),
    0
  )

  const gainLoss = totalCurrentValue - totalInvested
  const gainLossPct = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0

  const estimatedAnnualYield = holdings.reduce((sum, h) => {
    const yieldPct = h.properties?.annual_yield_pct ?? 0
    const value = h.tokens * (h.properties?.token_price ?? h.purchase_price)
    return sum + value * (yieldPct / 100)
  }, 0)

  const weightedYieldPct =
    totalCurrentValue > 0 ? (estimatedAnnualYield / totalCurrentValue) * 100 : 0

  const propertyCount = new Set(holdings.map((h) => h.property_id)).size

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-10">
        {/* KYC Banner */}
        {kycStatus && kycStatus !== 'verified' && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border px-4 py-3',
              kycStatus === 'rejected'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-yellow-200 bg-yellow-50 text-yellow-800'
            )}
          >
            {kycStatus === 'rejected' ? (
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {kycStatus === 'rejected'
                  ? 'Tu verificacion de identidad fue rechazada. Por favor, vuelve a enviar tus documentos.'
                  : 'Tu verificacion de identidad esta pendiente. Completa el proceso para poder invertir.'}
              </p>
            </div>
            <Link
              href="/dashboard/kyc"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                kycStatus === 'rejected'
                  ? 'border-red-300 text-red-700 hover:bg-red-100'
                  : 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'
              )}
            >
              {kycStatus === 'rejected' ? 'Reintentar KYC' : 'Completar KYC'}
            </Link>
          </div>
        )}

        {/* Greeting + header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Portfolio
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {userName ? `Hola, ${userName}` : 'Mi portafolio'}
          </h1>
        </div>

        {/* Summary cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total invertido
              </CardTitle>
              <Wallet className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {formatUSD(totalInvested)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Valor actual
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {formatUSD(totalCurrentValue)}
              </p>
              {totalInvested > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {gainLoss > 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  ) : gainLoss < 0 ? (
                    <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                  ) : null}
                  <p
                    className={`text-sm font-medium ${
                      gainLoss > 0
                        ? 'text-green-600'
                        : gainLoss < 0
                          ? 'text-red-600'
                          : 'text-slate-500'
                    }`}
                  >
                    {gainLoss > 0 ? '+' : ''}
                    {formatUSD(gainLoss)} ({gainLoss > 0 ? '+' : ''}
                    {formatPercent(gainLossPct)})
                  </p>
                </div>
              )}
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

          {holdings.length === 0 ? (
            <Card className="border-2 border-dashed border-slate-300 bg-white shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-10 w-10 text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-1">
                  Aun no tienes inversiones
                </p>
                <p className="text-sm text-slate-400 mb-6 max-w-sm">
                  Explora las propiedades disponibles y comienza a invertir en bienes
                  raices tokenizados.
                </p>
                <Link
                  href="/propiedades"
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ver propiedades
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {holdings.map((holding) => {
                const investedValue = holding.tokens * holding.purchase_price
                const currentTokenPrice =
                  holding.properties?.token_price ?? holding.purchase_price
                const currentValue = holding.tokens * currentTokenPrice
                const holdingGain = currentValue - investedValue
                const holdingGainPct =
                  investedValue > 0 ? (holdingGain / investedValue) * 100 : 0
                const yieldPct = holding.properties?.annual_yield_pct ?? 0

                return (
                  <Card
                    key={holding.id}
                    className="border-slate-200 shadow-sm bg-white"
                  >
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
                        <span className="font-medium text-slate-900">
                          {holding.tokens}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Valor invertido</span>
                        <span className="font-medium text-slate-500">
                          {formatUSD(investedValue)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Valor actual</span>
                        <span className="font-medium text-slate-900">
                          {formatUSD(currentValue)}
                        </span>
                      </div>
                      {holdingGain !== 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Ganancia/Perdida</span>
                          <span
                            className={`font-medium flex items-center gap-1 ${
                              holdingGain > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {holdingGain > 0 ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5" />
                            )}
                            {holdingGain > 0 ? '+' : ''}
                            {formatUSD(holdingGain)} ({holdingGain > 0 ? '+' : ''}
                            {formatPercent(holdingGainPct)})
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Rendimiento</span>
                        <span className="font-medium text-blue-600">
                          {formatPercent(yieldPct)} anual
                        </span>
                      </div>
                      <div className="pt-2">
                        <Badge
                          variant="outline"
                          className="text-xs border-slate-200 text-slate-500"
                        >
                          {getStatusLabel(holding.properties?.status ?? '')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Transactions */}
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Actividad
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Historial de transacciones
            </h2>
          </div>

          {transactions.length === 0 ? (
            <Card className="border-2 border-dashed border-slate-300 bg-white shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-10 w-10 text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-1">
                  Sin transacciones aun
                </p>
                <p className="text-sm text-slate-400 mb-6 max-w-sm">
                  Cuando realices tu primera inversion, veras el historial de
                  transacciones aqui.
                </p>
                <Link
                  href="/propiedades"
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  Explorar propiedades
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400">
                        Fecha
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400">
                        Propiedad
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400">
                        Tipo
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                        Tokens
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                        Monto
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-center">
                        Estado
                      </TableHead>
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
                            <span
                              className={`flex items-center gap-1 text-sm ${config?.color ?? 'text-slate-500'}`}
                            >
                              {config?.icon}
                              {config?.label ?? tx.type}
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
                              variant={
                                tx.status === 'confirmed' ? 'default' : 'secondary'
                              }
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
          )}
        </section>
      </div>
    </div>
  )
}
