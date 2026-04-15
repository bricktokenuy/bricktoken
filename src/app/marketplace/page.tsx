'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Store, ShoppingCart, Tag, Building2, ArrowUpDown, PackageOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { formatUSD } from '@/lib/demo-data'
import type { SellOrder, Property } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

const MARKETPLACE_FEE_RATE = 0.015

export default function MarketplacePage() {
  const router = useRouter()
  const [orders, setOrders] = useState<SellOrder[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string>('all')
  const [sortAsc, setSortAsc] = useState(true)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [investorId, setInvestorId] = useState<string | null>(null)

  // Buy dialog
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [buyOrder, setBuyOrder] = useState<SellOrder | null>(null)
  const [buyTokens, setBuyTokens] = useState(1)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState('')

  // Cancel state
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.email) {
        supabase
          .from('investors')
          .select('id')
          .eq('email', data.user.email)
          .single()
          .then(({ data: inv }) => {
            if (inv) setInvestorId(inv.id)
          })
      }
    })
  }, [])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const url = selectedProperty && selectedProperty !== 'all'
        ? `/api/marketplace?property_id=${selectedProperty}`
        : '/api/marketplace'
      const res = await fetch(url)
      const data = await res.json()
      if (data.orders) {
        setOrders(data.orders)
        // Extract unique properties
        const propMap = new Map<string, Property>()
        data.orders.forEach((o: SellOrder) => {
          if (o.property) propMap.set(o.property.id, o.property)
        })
        setProperties(Array.from(propMap.values()))
      }
    } catch {
      // Silently handle
    } finally {
      setLoading(false)
    }
  }, [selectedProperty])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const sortedOrders = [...orders].sort((a, b) =>
    sortAsc
      ? a.price_per_token - b.price_per_token
      : b.price_per_token - a.price_per_token
  )

  function openBuyDialog(order: SellOrder) {
    if (!user) {
      router.push('/auth/login')
      return
    }
    setBuyOrder(order)
    setBuyTokens(1)
    setBuyError('')
    setBuyDialogOpen(true)
  }

  async function handleBuy() {
    if (!buyOrder) return
    setBuying(true)
    setBuyError('')

    try {
      const res = await fetch('/api/marketplace/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sell_order_id: buyOrder.id,
          tokens: buyTokens,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBuyError(data.error || 'Error al comprar')
      } else {
        setBuyDialogOpen(false)
        fetchOrders()
      }
    } catch {
      setBuyError('Error de conexión')
    } finally {
      setBuying(false)
    }
  }

  async function handleCancel(orderId: string) {
    setCancelling(orderId)
    try {
      const res = await fetch(`/api/marketplace/sell?order_id=${orderId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch {
      // Silently handle
    } finally {
      setCancelling(null)
    }
  }

  function anonymizeSeller(seller?: { full_name: string }) {
    if (!seller?.full_name) return 'Inversor'
    const parts = seller.full_name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1][0]}.`
    }
    return parts[0]
  }

  const buyTotal = buyOrder ? buyTokens * buyOrder.price_per_token : 0
  const buyFee = Math.round(buyTotal * MARKETPLACE_FEE_RATE * 100) / 100
  const buyGrandTotal = buyTotal + buyFee

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Mercado secundario
            </p>
            <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
            <p className="text-slate-500 mt-1">
              Comprá y vendé tokens de propiedades entre inversores
            </p>
          </div>
          {user && (
            <Button
              onClick={() => router.push('/dashboard/vender')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Tag className="h-4 w-4 mr-2" />
              Vender mis tokens
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <Select value={selectedProperty} onValueChange={(v) => v && setSelectedProperty(v)}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Todas las propiedades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las propiedades</SelectItem>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortAsc(!sortAsc)}
            className="gap-1.5"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Precio {sortAsc ? '↑ menor a mayor' : '↓ mayor a menor'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="flex items-center gap-3 pt-6">
              <Store className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-400">Órdenes activas</p>
                <p className="text-xl font-bold text-slate-900">{orders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="flex items-center gap-3 pt-6">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-400">Tokens en venta</p>
                <p className="text-xl font-bold text-slate-900">
                  {orders.reduce((sum, o) => sum + o.tokens_remaining, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="flex items-center gap-3 pt-6">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-400">Propiedades</p>
                <p className="text-xl font-bold text-slate-900">{properties.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders table */}
        {loading ? (
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">Cargando órdenes...</p>
            </CardContent>
          </Card>
        ) : sortedOrders.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-300 bg-white">
            <CardContent className="py-16 text-center">
              <PackageOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-500">
                No hay órdenes de venta activas
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Sé el primero en listar tus tokens en el marketplace
              </p>
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
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400">
                      Vendedor
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                      Tokens
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                      Precio/token
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-400 text-right">
                      Total
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
                  {sortedOrders.map((order) => {
                    const isOwn = investorId && order.seller_id === investorId
                    const total = order.tokens_remaining * order.price_per_token

                    return (
                      <TableRow key={order.id} className="border-slate-100">
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {order.property?.name ?? 'Propiedad'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {order.property?.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {anonymizeSeller(order.seller)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-slate-900">
                          {order.tokens_remaining}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-slate-900">
                          {formatUSD(order.price_per_token)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-slate-900">
                          {formatUSD(total)}
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
                          {isOwn ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancel(order.id)}
                              disabled={cancelling === order.id}
                              className="text-slate-500 hover:text-red-600 hover:border-red-300"
                            >
                              {cancelling === order.id ? 'Cancelando...' : 'Cancelar'}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => openBuyDialog(order)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Comprar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Buy dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comprar tokens</DialogTitle>
            <DialogDescription>
              {buyOrder?.property?.name} — {formatUSD(buyOrder?.price_per_token ?? 0)}/token
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Cantidad de tokens</Label>
              <Input
                type="number"
                min={1}
                max={buyOrder?.tokens_remaining ?? 1}
                value={buyTokens}
                onChange={(e) => setBuyTokens(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <p className="text-xs text-slate-400">
                Disponibles: {buyOrder?.tokens_remaining ?? 0} tokens
              </p>
            </div>

            <div className="space-y-2 rounded-lg bg-slate-50 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">{formatUSD(buyTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Comisión (1.5%)</span>
                <span className="text-slate-900">{formatUSD(buyFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-semibold">
                <span className="text-slate-700">Total</span>
                <span className="text-slate-900">{formatUSD(buyGrandTotal)}</span>
              </div>
            </div>

            {buyError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{buyError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleBuy}
              disabled={buying || buyTokens < 1}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {buying ? 'Procesando...' : `Comprar ${buyTokens} token${buyTokens !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
