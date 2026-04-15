'use client'

import { useState, useMemo, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DEPARTMENTS } from "@/lib/demo-data"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function EditarPropiedad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [department, setDepartment] = useState("")
  const [address, setAddress] = useState("")
  const [totalValue, setTotalValue] = useState("")
  const [tokenPrice, setTokenPrice] = useState("")
  const [tokensSold, setTokensSold] = useState("")
  const [annualYield, setAnnualYield] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [areaM2, setAreaM2] = useState("")
  const [status, setStatus] = useState("coming_soon")
  const [fideicomisoNumber, setFideicomisoNumber] = useState("")

  const slug = useMemo(() => slugify(name), [name])

  const totalTokens = useMemo(() => {
    const value = parseFloat(totalValue)
    const price = parseFloat(tokenPrice)
    if (!isNaN(value) && !isNaN(price) && price > 0) {
      return Math.floor(value / price)
    }
    return 0
  }, [totalValue, tokenPrice])

  useEffect(() => {
    async function fetchProperty() {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setError('No se pudo cargar la propiedad')
        setLoading(false)
        return
      }

      setName(data.name ?? "")
      setDescription(data.description ?? "")
      setLocation(data.location ?? "")
      setDepartment(data.department ?? "")
      setAddress(data.address ?? "")
      setTotalValue(data.total_value?.toString() ?? "")
      setTokenPrice(data.token_price?.toString() ?? "")
      setTokensSold(data.tokens_sold?.toString() ?? "0")
      setAnnualYield(data.annual_yield_pct?.toString() ?? "")
      setPropertyType(data.property_type ?? "")
      setBedrooms(data.bedrooms?.toString() ?? "")
      setBathrooms(data.bathrooms?.toString() ?? "")
      setAreaM2(data.area_m2?.toString() ?? "")
      setStatus(data.status ?? "coming_soon")
      setFideicomisoNumber(data.fideicomiso_number ?? "")
      setLoading(false)
    }

    fetchProperty()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch('/api/admin/propiedades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name,
          description,
          location,
          department,
          address,
          total_value: parseFloat(totalValue),
          token_price: parseFloat(tokenPrice),
          tokens_sold: parseInt(tokensSold) || 0,
          annual_yield_pct: parseFloat(annualYield) || 0,
          property_type: propertyType,
          bedrooms: bedrooms ? parseInt(bedrooms) : null,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          area_m2: parseFloat(areaM2),
          status,
          fideicomiso_number: fideicomisoNumber || null,
          images: [],
          documents: [],
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al actualizar')
      }

      setSuccess("Propiedad actualizada correctamente")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError("")

    try {
      const res = await fetch('/api/admin/propiedades', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al eliminar')
      }

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
            Editar
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Editar propiedad</h1>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informacion basica */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Informacion basica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Nombre
                </Label>
                <Input
                  id="name"
                  placeholder="Ej: Apartamento Pocitos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium text-slate-700">
                  Slug (auto-generado)
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Descripcion
              </Label>
              <Textarea
                id="description"
                placeholder="Descripcion detallada de la propiedad..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="propertyType" className="text-sm font-medium text-slate-700">
                  Tipo de propiedad
                </Label>
                <Select value={propertyType} onValueChange={(v) => setPropertyType(v ?? "")}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="land">Terreno</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Estado
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v ?? "coming_soon")}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coming_soon">Proximamente</SelectItem>
                    <SelectItem value="funding">En financiacion</SelectItem>
                    <SelectItem value="funded">Financiado</SelectItem>
                    <SelectItem value="renting">Generando renta</SelectItem>
                    <SelectItem value="closed">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicacion */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Ubicacion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-slate-700">
                  Localidad
                </Label>
                <Input
                  id="location"
                  placeholder="Ej: Pocitos, Montevideo"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-slate-700">
                  Departamento
                </Label>
                <Select value={department} onValueChange={(v) => setDepartment(v ?? "")}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dep) => (
                      <SelectItem key={dep} value={dep}>
                        {dep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                Direccion
              </Label>
              <Input
                id="address"
                placeholder="Ej: Av. Brasil 2456"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Caracteristicas */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Caracteristicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-sm font-medium text-slate-700">
                  Dormitorios
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-sm font-medium text-slate-700">
                  Banos
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaM2" className="text-sm font-medium text-slate-700">
                  Superficie (m2)
                </Label>
                <Input
                  id="areaM2"
                  type="number"
                  min="0"
                  placeholder="95"
                  value={areaM2}
                  onChange={(e) => setAreaM2(e.target.value)}
                  required
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos financieros */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Datos financieros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="totalValue" className="text-sm font-medium text-slate-700">
                  Valor total (USD)
                </Label>
                <Input
                  id="totalValue"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="420000"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  required
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenPrice" className="text-sm font-medium text-slate-700">
                  Precio por token (USD)
                </Label>
                <Input
                  id="tokenPrice"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="100"
                  value={tokenPrice}
                  onChange={(e) => setTokenPrice(e.target.value)}
                  required
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Total de tokens</Label>
                <Input
                  value={totalTokens > 0 ? totalTokens.toLocaleString() : "\u2014"}
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-500"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tokensSold" className="text-sm font-medium text-slate-700">
                  Tokens vendidos
                </Label>
                <Input
                  id="tokensSold"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={tokensSold}
                  onChange={(e) => setTokensSold(e.target.value)}
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualYield" className="text-sm font-medium text-slate-700">
                  Rendimiento anual (%)
                </Label>
                <Input
                  id="annualYield"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="8.5"
                  value={annualYield}
                  onChange={(e) => setAnnualYield(e.target.value)}
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fideicomisoNumber" className="text-sm font-medium text-slate-700">
                Numero de fideicomiso
              </Label>
              <Input
                id="fideicomisoNumber"
                placeholder="Ej: FID-2026-001"
                value={fideicomisoNumber}
                onChange={(e) => setFideicomisoNumber(e.target.value)}
                className="border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                />
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar propiedad
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminar propiedad</DialogTitle>
                <DialogDescription>
                  Esta accion no se puede deshacer. Se eliminara permanentemente la propiedad
                  &quot;{name}&quot; y todos sus datos asociados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose
                  render={
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-500 hover:text-slate-900"
                    />
                  }
                >
                  Cancelar
                </DialogClose>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" type="button" className="border-slate-200 text-slate-500 hover:text-slate-900">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
