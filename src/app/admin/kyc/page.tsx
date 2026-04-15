'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Users,
} from 'lucide-react'

interface PendingInvestor {
  id: string
  full_name: string
  email: string
  document_type: string
  document_number: string
  kyc_status: string
  created_at: string
}

export default function AdminKycPage() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [investors, setInvestors] = useState<PendingInvestor[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadInvestors() {
    try {
      const res = await fetch('/api/admin/kyc')
      if (res.ok) {
        const data = await res.json()
        setInvestors(data.investors)
      }
    } catch {
      setError('Error al cargar inversores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvestors()
  }, [])

  async function handleUpdateStatus(
    investorId: string,
    status: 'verified' | 'rejected'
  ) {
    setProcessingId(investorId)
    setError(null)

    try {
      const res = await fetch('/api/admin/kyc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investor_id: investorId, status }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al actualizar estado')
      }

      // Remove from list
      setInvestors((prev) => prev.filter((inv) => inv.id !== investorId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setProcessingId(null)
    }
  }

  function getDocumentUrls(investorId: string) {
    const frontUrl = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(`${investorId}/front.jpg`).data.publicUrl

    const backUrl = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(`${investorId}/back.jpg`).data.publicUrl

    const selfieUrl = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(`${investorId}/selfie.jpg`).data.publicUrl

    return { frontUrl, backUrl, selfieUrl }
  }

  function openDocuments(investorId: string) {
    const { frontUrl, backUrl, selfieUrl } = getDocumentUrls(investorId)
    window.open(frontUrl, '_blank')
    window.open(backUrl, '_blank')
    window.open(selfieUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
          Verificacion KYC
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          Revision de identidad
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Revisa y aprueba las verificaciones de identidad de los inversores.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-yellow-50 p-3">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Pendientes de revision
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {investors.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {investors.length === 0 ? (
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="rounded-full bg-slate-100 p-4">
              <Shield className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-900">
              No hay verificaciones pendientes
            </p>
            <p className="text-sm text-slate-500">
              Todas las solicitudes de KYC han sido procesadas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Inversor
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Documento
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
                {investors.map((investor) => (
                  <TableRow key={investor.id} className="border-slate-100">
                    <TableCell className="font-medium text-slate-900">
                      {investor.full_name}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {investor.email}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {investor.document_type} {investor.document_number}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pendiente
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(investor.created_at).toLocaleDateString(
                        'es-UY',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocuments(investor.id)}
                          className="text-slate-600"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Ver docs
                        </Button>
                        <Button
                          size="sm"
                          disabled={processingId === investor.id}
                          onClick={() =>
                            handleUpdateStatus(investor.id, 'verified')
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingId === investor.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Aprobar
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={processingId === investor.id}
                          onClick={() =>
                            handleUpdateStatus(investor.id, 'rejected')
                          }
                        >
                          {processingId === investor.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="mr-1 h-4 w-4" />
                              Rechazar
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
