'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tag, Coins, XCircle, PackageOpen, ArrowLeft, Store } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'
import { formatUSD } from '@/lib/demo-data'
import type { Holding, SellOrder } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

export default function VenderPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [myOrders, setMyOrders] = useState<SellOrder[]>([])
  const [selectedHolding, setSelectedHolding] = useState<string>('')
  const [tokens, setTokens] = useState(1)
  const [pricePerToken, setPricePerToken] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/auth/login')
        return
      }
      setUser(data.user)
    })
  }, [router])

  const fetchData = useCallback(async () => {
    if (!user?.email) return
    setLoading(true)

    try {
      const supabase = createClient()

      // Get investor
      const { data: investor } = await supabase
        .from('investors')
        .select('id')
        .eq('email', user.email)
        .single()

      if (!investor) {
        setLoading(false)
        return
      }

      // Get holdings with property data
      const { data: holdingsData } = await supabase
        .from('holdings')
        .select('*, property:properties(*)')
        .eq('investor_id', investor.id)
        .eq('status', 'active')

      setHoldings(holdingsData ?? [])

      // Get my active sell orders
      const { data: ordersData } = await supabase
        .from('sell_orders')
        .select('*, property:properties(*)')
        .eq('seller_id', investor.id)
        .in('status', ['active', 'partial'])
        .order('created_at', { ascending: false })

      setMyOrders(ordersData ?? [])
    } catch {
      // Silently handle
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Calculate available tokens for selected holding
  const selectedHoldingData = holdings.find((h) => h.id === selectedHolding)
  const listedForHolding = myOrders
    .filter((o) => o.holding_id === selectedHolding)
    .reduce((sum, o) => sum + o.tokens_remaining, 0)
  const availableTokens = selectedHoldingData
    ? selectedHoldingData.tokens - listedForHolding
    : 0

  function handleHoldingChange(value: string) {
    setSelectedHolding(value)
    const holding = holdings.find((h) => h.id === value)
    if (holding?.property) {
      setPricePerToken(holding.property.token_price)
    }
    setTokens(1)
    setError('')
    setSuccess('')
  }

  async function handleSubmit() {
    setError('')
    setSuccess('')

    if (!selectedHolding) {
      setError('Seleccioná un holding')
      return
    }
    if (tokens <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }
    if (tokens > availableTokens) {
      setError(`Solo tenés ${availableTokens} tokens disponibles`)
      return
    }
    if (pricePerToken <= 0) {
      setError('El precio debe ser mayor a 0')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/marketplace/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holding_id: selectedHolding,
          tokens,
          price_per_token: pricePerToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al crear la orden')
      } else {
        setSuccess('Orden de venta publicada exitosamente')
        setTokens(1)
        fetchData()
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCancel(orderId: string) {
    setCancelling(orderId)
    try {
      const res = await fetch(`/api/marketplace/sell?order_id=${orderId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSuccess('Orden cancelada')
        fetchData()
      }
    } catch {
      // Silently handle
    } finally {
      setCancelling(null)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al dashboard
            </Link>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Vender tokens
            </p>
            <h1 className="text-3xl font-bold text-slate-900">Publicar orden de venta</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/marketplace')}
            className="gap-1.5"
          >
            <Store className="h-4 w-4" />
            Ver marketplace
          </Button>
        </div>

        {/* Create sell order form */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-600" />
              Nueva orden de venta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-slate-400 py-4">Cargando holdings...</p>
            ) : holdings.length === 0 ? (
              <div className="border-dashed border-2 border-slate-300 rounded-lg py-8 text-center">
                <PackageOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tenés holdings activos para vender</p>
                <Link href="/propiedades" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
                  Explorá propiedades
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Seleccioná un holding</Label>
                  <Select value={selectedHolding} onValueChange={(v) => v && handleHoldingChange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Elegí una inversión" />
                    </SelectTrigger>
                    <SelectContent>
                      {holdings.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.property?.name ?? 'Propiedad'} — {h.tokens} tokens
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedHoldingData && (
                  <>
                    <div className="rounded-lg bg-slate-50 p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Propiedad</span>
                        <span className="font-medium text-slate-900">
                          {selectedHoldingData.property?.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tokens en holding</span>
                        <span className="font-medium text-slate-900">
                          {selectedHoldingData.tokens}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Ya listados</span>
                        <span className="font-medium text-slate-900">{listedForHolding}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Disponibles para vender</span>
                        <span className="font-medium text-blue-600">{availableTokens}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Precio actual del token</span>
                        <span className="font-medium text-slate-900">
                          {formatUSD(selectedHoldingData.property?.token_price ?? 0)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Cantidad de tokens a vender</Label>
                        <Input
                          type="number"
                          min={1}
                          max={availableTokens}
                          value={tokens}
                          onChange={(e) =>
                            setTokens(Math.max(1, parseInt(e.target.value) || 1))
                          }
                        />
                        <p className="text-xs text-slate-400">
                          Máximo: {availableTokens}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Precio por token (USD)</Label>
                        <Input
                          type="number"
                          min={0.01}
                          step={0.01}
                          value={pricePerToken}
                          onChange={(e) =>
                            setPricePerToken(parseFloat(e.target.value) || 0)
                          }
                        />
                        <p className="text-xs text-slate-400">
                          Referencia: {formatUSD(selectedHoldingData.property?.token_price ?? 0)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Total de la orden</span>
                        <span className="font-semibold text-blue-900">
                          {formatUSD(tokens * pricePerToken)}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600">
                        Comisión del marketplace: 1.5% al comprador
                      </p>
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
                        {error}
                      </p>
                    )}
                    {success && (
                      <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">
                        {success}
                      </p>
                    )}

                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || availableTokens <= 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      {submitting ? 'Publicando...' : 'Publicar orden de venta'}
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* My active orders */}
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Mis órdenes
            </p>
            <h2 className="text-xl font-semibold text-slate-900">Órdenes de venta activas</h2>
          </div>

          {myOrders.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-300 bg-white">
              <CardContent className="py-12 text-center">
                <PackageOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tenés órdenes activas</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400">
                        Propiedad
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                        Tokens
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                        Restantes
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                        Precio/token
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-center">
                        Estado
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                        Acción
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myOrders.map((order) => (
                      <TableRow key={order.id} className="border-slate-100">
                        <TableCell className="text-sm font-medium text-slate-900">
                          {order.property?.name ?? 'Propiedad'}
                        </TableCell>
                        <TableCell className="text-right text-sm text-slate-500">
                          {order.tokens}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-slate-900">
                          {order.tokens_remaining}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-slate-900">
                          {formatUSD(order.price_per_token)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              order.status === 'partial'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }
                          >
                            {order.status === 'partial' ? 'Parcial' : 'Activa'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(order.id)}
                            disabled={cancelling === order.id}
                            className="text-slate-500 hover:text-red-600 hover:border-red-300"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            {cancelling === order.id ? 'Cancelando...' : 'Cancelar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
