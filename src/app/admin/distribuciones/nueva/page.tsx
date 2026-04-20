'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Calculator } from 'lucide-react'
import { formatUSD } from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/client'
import type { Property } from '@/lib/types'

export default function NuevaDistribucion() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [period, setPeriod] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [holdersCount, setHoldersCount] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    async function loadProperties() {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .in('status', ['funded', 'renting'])
        .order('name')

      if (data) setProperties(data)
    }
    loadProperties()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId)
  const amount = parseFloat(totalAmount) || 0
  const perToken = selectedProperty && amount > 0
    ? amount / selectedProperty.total_tokens
    : 0

  useEffect(() => {
    if (!selectedPropertyId) {
      setHoldersCount(null)
      return
    }

    async function loadHolders() {
      const { count } = await supabase
        .from('holdings')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', selectedPropertyId)
        .eq('status', 'active')

      setHoldersCount(count ?? 0)
    }
    loadHolders()
  }, [selectedPropertyId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!selectedPropertyId || !period || !totalAmount) {
      setError('Completa todos los campos')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/distribuciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: selectedPropertyId,
          period,
          total_amount: amount,
        }),
      })

      if (res.ok) {
        router.push('/admin/distribuciones')
      } else {
        const data = await res.json()
        setError(data.error || 'Error al crear la distribución')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Link
          href="/admin/distribuciones"
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a distribuciones
        </Link>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
          Nueva distribución
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          Crear distribución de rendimientos
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property select */}
                <div className="space-y-2">
                  <Label htmlFor="property" className="text-sm font-medium text-slate-700">
                    Propiedad
                  </Label>
                  <select
                    id="property"
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Seleccionar propiedad...</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.total_tokens.toLocaleString()} tokens)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Period */}
                <div className="space-y-2">
                  <Label htmlFor="period" className="text-sm font-medium text-slate-700">
                    Periodo
                  </Label>
                  <Input
                    id="period"
                    placeholder="Ej: 2026-Q1, 2026-Q2"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="border-slate-200"
                  />
                  <p className="text-xs text-slate-400">
                    Formato sugerido: YYYY-Q# (trimestre) o YYYY-MM (mes)
                  </p>
                </div>

                {/* Total amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                    Ingreso total del periodo (USD)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="border-slate-200"
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || !selectedPropertyId || !period || !totalAmount}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  {submitting ? 'Creando...' : 'Crear distribución'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Vista previa</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Propiedad</span>
                  <span className="font-medium text-slate-900">
                    {selectedProperty?.name ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total tokens</span>
                  <span className="font-medium text-slate-900">
                    {selectedProperty
                      ? selectedProperty.total_tokens.toLocaleString()
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Monto total</span>
                  <span className="font-medium text-slate-900">
                    {amount > 0 ? formatUSD(amount) : '-'}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3" />

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Por token</span>
                  <span className="font-semibold text-blue-600">
                    {perToken > 0 ? `US$ ${perToken.toFixed(4)}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Inversores</span>
                  <span className="font-medium text-slate-900">
                    {holdersCount !== null ? holdersCount : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
