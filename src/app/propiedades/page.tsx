'use client'

import { useState, useEffect, useCallback } from 'react'
import { DEPARTMENTS, getStatusLabel, getPropertyTypeLabel } from '@/lib/demo-data'
import { getPropertiesClient } from '@/lib/queries-client'
import { PropertyCard } from '@/components/properties/PropertyCard'
import type { Property } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PROPERTY_TYPES = ['apartment', 'house', 'land', 'commercial'] as const
const STATUSES = ['coming_soon', 'funding', 'funded', 'renting', 'closed'] as const

export default function PropiedadesPage() {
  const [department, setDepartment] = useState<string>('all')
  const [propertyType, setPropertyType] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [filtered, setFiltered] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const handleDepartmentChange = (value: string | null) => setDepartment(value ?? 'all')
  const handleTypeChange = (value: string | null) => setPropertyType(value ?? 'all')
  const handleStatusChange = (value: string | null) => setStatus(value ?? 'all')

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    const data = await getPropertiesClient({
      department,
      property_type: propertyType,
      status,
    })
    setFiltered(data)
    setLoading(false)
  }, [department, propertyType, status])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
          Inversiones disponibles
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Propiedades</h1>
        <p className="mt-2 text-slate-500">
          Explora las oportunidades de inversion inmobiliaria tokenizada en Uruguay.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Departamento
          </label>
          <Select value={department} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-48 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {DEPARTMENTS.map((dep) => (
                <SelectItem key={dep} value={dep}>
                  {dep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Tipo
          </label>
          <Select value={propertyType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-48 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {getPropertyTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Estado
          </label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {getStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-slate-400">
        {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-20">
          <p className="text-lg font-medium text-slate-500">
            No se encontraron propiedades
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Proba ajustando los filtros de busqueda.
          </p>
        </div>
      )}
    </div>
  )
}
