'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  formatUSD,
  formatPercent,
  getStatusLabel,
  getStatusColor,
  getPropertyTypeLabel,
} from "@/lib/demo-data"
import { getPropertiesClient } from "@/lib/queries-client"
import type { Property } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Building2,
  DollarSign,
  Coins,
  Users,
  Plus,
  Pencil,
} from "lucide-react"

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    getPropertiesClient().then(setProperties)
  }, [])

  const totalValue = properties.reduce((sum, p) => sum + Number(p.total_value), 0)
  const totalTokensSold = properties.reduce(
    (sum, p) => sum + p.tokens_sold,
    0
  )
  const totalTokens = properties.reduce(
    (sum, p) => sum + p.total_tokens,
    0
  )
  const totalInvestors = 127

  const stats = [
    {
      label: "Propiedades",
      value: properties.length.toString(),
      icon: Building2,
    },
    {
      label: "Valor tokenizado",
      value: formatUSD(totalValue),
      icon: DollarSign,
    },
    {
      label: "Tokens vendidos",
      value: `${totalTokensSold.toLocaleString()} / ${totalTokens.toLocaleString()}`,
      icon: Coins,
    },
    {
      label: "Inversores",
      value: totalInvestors.toString(),
      icon: Users,
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Panel de administracion
          </h1>
        </div>
        <Link href="/admin/propiedades/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva propiedad
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-blue-50 p-3">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Properties table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Nombre
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Ubicacion
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Tipo
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Estado
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Valor total
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Tokens
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Rendimiento
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id} className="border-slate-100">
                  <TableCell className="font-medium text-slate-900">
                    {property.name}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {property.location}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {getPropertyTypeLabel(property.property_type)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(property.status)}
                    >
                      {getStatusLabel(property.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-900">
                    {formatUSD(property.total_value)}
                  </TableCell>
                  <TableCell className="text-right text-slate-500">
                    {property.tokens_sold.toLocaleString()} /{" "}
                    {property.total_tokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900">
                    {formatPercent(property.annual_yield_pct)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/propiedades/${property.id}/editar`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
