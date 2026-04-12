'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { DEPARTMENTS } from "@/lib/demo-data"
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
import { ArrowLeft, ImagePlus } from "lucide-react"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function NuevaPropiedad() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [department, setDepartment] = useState("")
  const [address, setAddress] = useState("")
  const [totalValue, setTotalValue] = useState("")
  const [tokenPrice, setTokenPrice] = useState("")
  const [annualYield, setAnnualYield] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [areaM2, setAreaM2] = useState("")
  const [status, setStatus] = useState("coming_soon")

  const slug = useMemo(() => slugify(name), [name])

  const totalTokens = useMemo(() => {
    const value = parseFloat(totalValue)
    const price = parseFloat(tokenPrice)
    if (!isNaN(value) && !isNaN(price) && price > 0) {
      return Math.floor(value / price)
    }
    return 0
  }, [totalValue, tokenPrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder - would call API
    alert("Propiedad creada (demo)")
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
            Crear
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Nueva propiedad</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Informacion basica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
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
                <Label htmlFor="slug" className="text-slate-700 font-medium">
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
              <Label htmlFor="description" className="text-slate-700 font-medium">
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
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Ubicacion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700 font-medium">
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
                <Label htmlFor="department" className="text-slate-700 font-medium">
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
              <Label htmlFor="address" className="text-slate-700 font-medium">
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

        {/* Financials */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Datos financieros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="totalValue" className="text-slate-700 font-medium">
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
                <Label htmlFor="tokenPrice" className="text-slate-700 font-medium">
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
                <Label className="text-slate-700 font-medium">Total de tokens</Label>
                <Input
                  value={totalTokens > 0 ? totalTokens.toLocaleString() : "—"}
                  readOnly
                  className="bg-slate-50 border-slate-200 text-slate-500"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="annualYield" className="text-slate-700 font-medium">
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

        {/* Property details */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Detalles de la propiedad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="propertyType" className="text-slate-700 font-medium">
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
                <Label htmlFor="status" className="text-slate-700 font-medium">
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
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-slate-700 font-medium">
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
                <Label htmlFor="bathrooms" className="text-slate-700 font-medium">
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
                <Label htmlFor="areaM2" className="text-slate-700 font-medium">
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

        {/* Images */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Imagenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-14 text-center hover:border-blue-400 transition-colors">
              <ImagePlus className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-500">
                Arrastra imagenes aqui
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG hasta 10MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link href="/admin">
            <Button variant="outline" type="button" className="border-slate-200 text-slate-500 hover:text-slate-900">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Crear propiedad
          </Button>
        </div>
      </form>
    </div>
  )
}
