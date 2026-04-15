'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wallet, TrendingUp, Building2, ArrowUpRight, ArrowDownLeft, Clock, Shield, ShieldCheck, AlertTriangle } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { demoHoldings, demoTransactions, formatUSD, formatPercent, getStatusLabel } from '@/lib/demo-data'
import type { KycStatus } from '@/lib/types'

const transactionTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  buy: { label: 'Compra', icon: <ArrowUpRight className="h-4 w-4" />, color: 'text-blue-600' },
  sell: { label: 'Venta', icon: <ArrowDownLeft className="h-4 w-4" />, color: 'text-slate-400' },
  yield: { label: 'Rendimiento', icon: <TrendingUp className="h-4 w-4" />, color: 'text-slate-600' },
}

export default function DashboardPage() {
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null)
  const [hasDocuments, setHasDocuments] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function checkKyc() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setIsAuthenticated(true)

      try {
        const res = await fetch('/api/kyc')
        if (res.ok) {
          const data = await res.json()
          setKycStatus(data.kyc_status)
          setHasDocuments(data.has_documents)
        }
      } catch {
        // silently fail - banner just won't show
      }
    }

    checkKyc()
  }, [])

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

        {/* KYC Banner */}
        {isAuthenticated && kycStatus !== 'verified' && (
          <div
            className={`rounded-xl border p-5 flex items-start gap-4 ${
              kycStatus === 'rejected'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            {kycStatus === 'rejected' ? (
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 shrink-0" />
            ) : hasDocuments ? (
              <Shield className="h-6 w-6 text-yellow-600 mt-0.5 shrink-0" />
            ) : (
              <Shield className="h-6 w-6 text-yellow-600 mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  kycStatus === 'rejected' ? 'text-red-800' : 'text-yellow-800'
                }`}
              >
                {kycStatus === 'rejected'
                  ? 'Tu verificacion fue rechazada - intenta de nuevo'
                  : hasDocuments
                    ? 'Tu verificacion esta en proceso'
                    : 'Completa tu verificacion de identidad para poder invertir'}
              </p>
              <p
                className={`text-sm mt-1 ${
                  kycStatus === 'rejected' ? 'text-red-600' : 'text-yellow-700'
                }`}
              >
                {kycStatus === 'rejected'
                  ? 'Volve a enviar tus documentos con fotos claras y legibles.'
                  : hasDocuments
                    ? 'Tus documentos estan siendo revisados por nuestro equipo.'
                    : 'Necesitas verificar tu identidad antes de realizar tu primera inversion.'}
              </p>
              <Link href="/dashboard/kyc">
                <Button
                  size="sm"
                  className={`mt-3 ${
                    kycStatus === 'rejected'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  <Shield className="mr-1.5 h-4 w-4" />
                  {kycStatus === 'rejected'
                    ? 'Reintentar verificacion'
                    : hasDocuments
                      ? 'Ver estado'
                      : 'Verifica tu identidad'}
                </Button>
              </Link>
            </div>
          </div>
        )}

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
