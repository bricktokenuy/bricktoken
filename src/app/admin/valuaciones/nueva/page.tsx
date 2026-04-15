'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  demoProperties,
  formatUSD,
  formatPercent,
} from '@/lib/demo-data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Building2,
} from 'lucide-react'

export default function NuevaValuacionPage() {
  const router = useRouter()
  const [propertyId, setPropertyId] = useState<string>('')
  const [newValue, setNewValue] = useState<string>('')
  const [appraiser, setAppraiser] = useState('')
  const [valuationDate, setValuationDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedProperty = useMemo(
    () => demoProperties.find((p) => p.id === propertyId),
    [propertyId]
  )

  const newValueNum = parseFloat(newValue) || 0

  const calculations = useMemo(() => {
    if (!selectedProperty || newValueNum <= 0) return null

    const previousValue = selectedProperty.total_value
    const previousTokenPrice = selectedProperty.token_price
    const newTokenPrice = newValueNum / selectedProperty.total_tokens
    const changePct = ((newValueNum - previousValue) / previousValue) * 100

    return {
      previousValue,
      previousTokenPrice,
      newTokenPrice: Math.round(newTokenPrice * 100) / 100,
      changePct: Math.round(changePct * 100) / 100,
    }
  }, [selectedProperty, newValueNum])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!propertyId || !newValue || !valuationDate) {
      setError('Completa todos los campos requeridos')
      return
    }
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/valuaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          new_value: newValueNum,
          appraiser: appraiser || null,
          valuation_date: valuationDate,
          notes: notes || null,
        }),
      })

      if (res.ok) {
        router.push('/admin/valuaciones')
      } else {
        const data = await res.json()
        setError(data.error || 'Error al crear la valuacion')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/admin/valuaciones"
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Valuaciones
          </p>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva valuacion</h1>
        <p className="mt-1 text-sm text-slate-500">
          Registra una nueva tasacion para una propiedad
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property selection */}
        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Propiedad</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property" className="text-sm text-slate-600">
                Seleccionar propiedad *
              </Label>
              <Select value={propertyId} onValueChange={(v) => v && setPropertyId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {demoProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} — {property.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProperty && (
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-400">Valor actual</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatUSD(selectedProperty.total_value)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Precio del token</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatUSD(selectedProperty.token_price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total tokens</p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedProperty.total_tokens.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ubicacion</p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedProperty.location}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Valuation details */}
        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Datos de tasacion</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new_value" className="text-sm text-slate-600">
                  Nuevo valor tasado (USD) *
                </Label>
                <Input
                  id="new_value"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="450000"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valuation_date" className="text-sm text-slate-600">
                  Fecha de tasacion *
                </Label>
                <Input
                  id="valuation_date"
                  type="date"
                  value={valuationDate}
                  onChange={(e) => setValuationDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appraiser" className="text-sm text-slate-600">
                Tasador / Empresa
              </Label>
              <Input
                id="appraiser"
                placeholder="Nombre del tasador o empresa"
                value={appraiser}
                onChange={(e) => setAppraiser(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm text-slate-600">
                Notas
              </Label>
              <Textarea
                id="notes"
                placeholder="Notas adicionales sobre la tasacion..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Impact preview */}
        {calculations && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                  Vista previa
                </p>
                <h2 className="text-lg font-semibold text-slate-900">Impacto de la valuacion</h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-400 mb-1">Valor anterior</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatUSD(calculations.previousValue)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-400 mb-1">Nuevo valor</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatUSD(newValueNum)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-400 mb-1">Cambio</p>
                  <div className="flex items-center gap-1">
                    {calculations.changePct > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : calculations.changePct < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-slate-500" />
                    )}
                    <p
                      className={`text-lg font-bold ${
                        calculations.changePct > 0
                          ? 'text-green-600'
                          : calculations.changePct < 0
                            ? 'text-red-600'
                            : 'text-slate-500'
                      }`}
                    >
                      {calculations.changePct > 0 ? '+' : ''}
                      {formatPercent(calculations.changePct)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="border-blue-200" />

              <div
                className={`rounded-xl border p-4 ${
                  calculations.changePct > 0
                    ? 'border-green-200 bg-green-50'
                    : calculations.changePct < 0
                      ? 'border-red-200 bg-red-50'
                      : 'border-slate-200 bg-slate-50'
                }`}
              >
                <p className="text-sm font-medium text-slate-700">
                  El precio del token pasara de{' '}
                  <span className="font-bold">{formatUSD(calculations.previousTokenPrice)}</span>
                  {' '}a{' '}
                  <span className="font-bold">{formatUSD(calculations.newTokenPrice)}</span>
                  {' '}(
                  <span
                    className={
                      calculations.changePct > 0
                        ? 'text-green-600'
                        : calculations.changePct < 0
                          ? 'text-red-600'
                          : 'text-slate-500'
                    }
                  >
                    {calculations.changePct > 0 ? '+' : ''}
                    {formatPercent(calculations.changePct)}
                  </span>
                  )
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={submitting || !propertyId || !newValue || !valuationDate}
          >
            {submitting ? 'Creando...' : 'Crear valuacion'}
          </Button>
          <Link
            href="/admin/valuaciones"
            className="text-sm text-slate-400 hover:text-slate-900 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
