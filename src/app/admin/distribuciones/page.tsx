'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
import { Plus, Banknote, Clock, CheckCircle2 } from 'lucide-react'
import { formatUSD } from '@/lib/demo-data'
import type { Distribution, Property } from '@/lib/types'

interface DistributionWithProperty extends Distribution {
  property: Pick<Property, 'id' | 'name' | 'slug' | 'total_tokens' | 'token_price'>
}

export default function AdminDistribuciones() {
  const [distributions, setDistributions] = useState<DistributionWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [distributing, setDistributing] = useState<string | null>(null)

  async function fetchDistributions() {
    try {
      const res = await fetch('/api/admin/distribuciones')
      if (res.ok) {
        const data = await res.json()
        setDistributions(data)
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistributions()
  }, [])

  async function handleDistribute(distributionId: string) {
    if (!confirm('¿Confirmar la distribución de rendimientos a todos los inversores?')) {
      return
    }

    setDistributing(distributionId)
    try {
      const res = await fetch('/api/admin/distribuciones/distribuir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distribution_id: distributionId }),
      })

      if (res.ok) {
        const result = await res.json()
        alert(
          `Distribución exitosa:\n- Total distribuido: ${formatUSD(result.summary.total_distributed)}\n- Inversores: ${result.summary.num_investors}\n- Transacciones creadas: ${result.summary.transactions_created}`
        )
        fetchDistributions()
      } else {
        const err = await res.json()
        alert(`Error: ${err.error}`)
      }
    } catch {
      alert('Error al ejecutar la distribución')
    } finally {
      setDistributing(null)
    }
  }

  const totalDistributed = distributions
    .filter((d) => d.status === 'distributed')
    .reduce((sum, d) => sum + d.total_amount, 0)

  const pendingCount = distributions.filter((d) => d.status === 'pending').length
  const distributedCount = distributions.filter((d) => d.status === 'distributed').length

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
            Administracion
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Distribuciones</h1>
        </div>
        <Link href="/admin/distribuciones/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva distribucion
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-blue-50 p-3">
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total distribuido
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {formatUSD(totalDistributed)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-green-50 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Ejecutadas
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {distributedCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-yellow-50 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Pendientes
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {pendingCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Cargando distribuciones...</div>
          ) : distributions.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No hay distribuciones aun. Crea la primera.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Propiedad
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Periodo
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                    Monto total
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                    Por token
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Estado
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Fecha
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributions.map((dist) => (
                  <TableRow key={dist.id} className="border-slate-100">
                    <TableCell className="font-medium text-slate-900">
                      {dist.property?.name ?? 'Propiedad eliminada'}
                    </TableCell>
                    <TableCell className="text-slate-500">{dist.period}</TableCell>
                    <TableCell className="text-right text-slate-900">
                      {formatUSD(dist.total_amount)}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      US$ {dist.per_token_amount.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      {dist.status === 'distributed' ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Distribuido
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {dist.distributed_at
                        ? new Date(dist.distributed_at).toLocaleDateString('es-UY')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {dist.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={distributing === dist.id}
                          onClick={() => handleDistribute(dist.id)}
                        >
                          {distributing === dist.id ? 'Distribuyendo...' : 'Distribuir'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
