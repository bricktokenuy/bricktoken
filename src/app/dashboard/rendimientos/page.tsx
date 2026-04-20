'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Banknote, TrendingUp } from 'lucide-react'
import { formatUSD } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/client'
import type { Transaction, Property } from '@/lib/types'

interface YieldTransaction extends Transaction {
  property: Property
}

interface GroupedYields {
  property: Property
  transactions: YieldTransaction[]
  total: number
}

export default function Rendimientos() {
  const [yields, setYields] = useState<YieldTransaction[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadYields() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('transactions')
        .select('*, property:properties(*)')
        .eq('investor_id', user.id)
        .eq('type', 'yield')
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })

      if (data) {
        setYields(data as YieldTransaction[])
      }
      setLoading(false)
    }
    loadYields()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalYields = yields.reduce((sum, tx) => sum + tx.amount, 0)

  // Group by property
  const grouped: GroupedYields[] = []
  for (const tx of yields) {
    const existing = grouped.find((g) => g.property.id === tx.property_id)
    if (existing) {
      existing.transactions.push(tx)
      existing.total += tx.amount
    } else {
      grouped.push({
        property: tx.property,
        transactions: [tx],
        total: tx.amount,
      })
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
          Mis inversiones
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Rendimientos</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-blue-50 p-3">
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total recibido
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {formatUSD(totalYields)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-green-50 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Distribuciones recibidas
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {yields.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yields by property */}
      {loading ? (
        <div className="text-center text-slate-400 py-12">
          Cargando rendimientos...
        </div>
      ) : yields.length === 0 ? (
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-12 text-center text-slate-400">
            Todavía no recibiste rendimientos. Cuando se distribuyan ganancias de tus propiedades, van a aparecer acá.
          </CardContent>
        </Card>
      ) : (
        grouped.map((group) => (
          <div key={group.property.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {group.property.name}
              </h2>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                Total: {formatUSD(group.total)}
              </Badge>
            </div>
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 hover:bg-transparent">
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Fecha
                      </TableHead>
                      <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                        Monto recibido
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Estado
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-slate-100">
                        <TableCell className="text-slate-500">
                          {new Date(tx.created_at).toLocaleDateString('es-UY', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatUSD(tx.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            Confirmado
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ))
      )}
    </div>
  )
}
