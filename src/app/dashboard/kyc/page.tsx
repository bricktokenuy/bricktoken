'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield,
  ShieldCheck,
  Camera,
  Upload,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import type { KycStatus } from '@/lib/types'

interface KycData {
  kyc_status: KycStatus
  document_type: 'CI' | 'Pasaporte' | 'DNI'
  document_number: string
  full_name: string
  email: string
  has_documents: boolean
}

export default function KycPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [kycData, setKycData] = useState<KycData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [documentType, setDocumentType] = useState<'CI' | 'Pasaporte' | 'DNI'>('CI')
  const [documentNumber, setDocumentNumber] = useState('')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)

  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadKyc() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      try {
        const res = await fetch('/api/kyc')
        if (res.ok) {
          const data: KycData = await res.json()
          setKycData(data)
          setDocumentType(data.document_type || 'CI')
          setDocumentNumber(data.document_number || '')
        }
      } catch {
        setError('Error al cargar datos de verificacion')
      } finally {
        setLoading(false)
      }
    }

    loadKyc()
  }, [router, supabase.auth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Sesion expirada')
        return
      }

      if (!frontFile || !backFile || !selfieFile) {
        setError('Todas las fotos son requeridas')
        setSubmitting(false)
        return
      }

      if (!documentNumber.trim()) {
        setError('El numero de documento es requerido')
        setSubmitting(false)
        return
      }

      // Upload front
      const { error: frontError } = await supabase.storage
        .from('kyc-documents')
        .upload(`${user.id}/front.jpg`, frontFile, { upsert: true })
      if (frontError) throw new Error('Error al subir foto frontal')

      // Upload back
      const { error: backError } = await supabase.storage
        .from('kyc-documents')
        .upload(`${user.id}/back.jpg`, backFile, { upsert: true })
      if (backError) throw new Error('Error al subir foto trasera')

      // Upload selfie
      const { error: selfieError } = await supabase.storage
        .from('kyc-documents')
        .upload(`${user.id}/selfie.jpg`, selfieFile, { upsert: true })
      if (selfieError) throw new Error('Error al subir selfie')

      // Get URLs
      const { data: { publicUrl: frontUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(`${user.id}/front.jpg`)

      const { data: { publicUrl: backUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(`${user.id}/back.jpg`)

      const { data: { publicUrl: selfieUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(`${user.id}/selfie.jpg`)

      // Submit KYC
      const res = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: documentType,
          document_number: documentNumber,
          front_url: frontUrl,
          back_url: backUrl,
          selfie_url: selfieUrl,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar documentos')
      }

      setSuccess(true)
      setKycData((prev) =>
        prev ? { ...prev, kyc_status: 'pending', has_documents: true } : prev
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const status = kycData?.kyc_status ?? 'pending'
  const hasDocuments = kycData?.has_documents ?? false

  // Verified state
  if (status === 'verified') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Verificacion
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Verificacion de identidad
            </h1>
          </div>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="rounded-full bg-green-50 p-4">
                <ShieldCheck className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Tu identidad fue verificada
              </h2>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                Verificado
              </Badge>
              <p className="text-sm text-slate-500 text-center max-w-sm">
                Tu cuenta esta verificada y podes realizar inversiones en la
                plataforma.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Pending with docs submitted
  if (status === 'pending' && hasDocuments && !success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Verificacion
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Verificacion de identidad
            </h1>
          </div>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="rounded-full bg-yellow-50 p-4">
                <FileCheck className="h-12 w-12 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Tu verificacion esta en proceso
              </h2>
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                En revision
              </Badge>
              <p className="text-sm text-slate-500 text-center max-w-sm">
                Tus documentos fueron enviados y estan siendo revisados por
                nuestro equipo. Te notificaremos cuando se complete la
                verificacion.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Success after submission
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Verificacion
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Verificacion de identidad
            </h1>
          </div>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="rounded-full bg-green-50 p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Documentos enviados correctamente
              </h2>
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                En revision
              </Badge>
              <p className="text-sm text-slate-500 text-center max-w-sm">
                Tus documentos fueron enviados exitosamente. Nuestro equipo los
                revisara y te notificaremos el resultado.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Rejected or pending without docs - show form
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Verificacion
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Verificacion de identidad
          </h1>
        </div>

        {status === 'rejected' && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-red-800">
                Tu verificacion fue rechazada
              </p>
              <p className="text-sm text-red-600 mt-1">
                Por favor, volve a enviar tus documentos asegurandote de que las
                fotos sean claras y legibles.
              </p>
            </div>
          </div>
        )}

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
              <Shield className="h-5 w-5 text-blue-600" />
              Documentos de identidad
            </CardTitle>
            <p className="text-sm text-slate-500">
              Subi fotos de tu documento de identidad para verificar tu cuenta.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Document type */}
              <div className="space-y-2">
                <Label htmlFor="document_type">Tipo de documento</Label>
                <select
                  id="document_type"
                  value={documentType}
                  onChange={(e) =>
                    setDocumentType(
                      e.target.value as 'CI' | 'Pasaporte' | 'DNI'
                    )
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="CI">Cedula de Identidad (CI)</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="DNI">DNI</option>
                </select>
              </div>

              {/* Document number */}
              <div className="space-y-2">
                <Label htmlFor="document_number">Numero de documento</Label>
                <Input
                  id="document_number"
                  type="text"
                  placeholder="Ej: 1.234.567-8"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  required
                />
              </div>

              {/* Front photo */}
              <div className="space-y-2">
                <Label>Foto frontal del documento</Label>
                <div
                  onClick={() => frontRef.current?.click()}
                  className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
                >
                  {frontFile ? (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileCheck className="h-5 w-5" />
                      <span>{frontFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        Click para subir la foto frontal
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPG, PNG o WEBP
                      </p>
                    </>
                  )}
                  <input
                    ref={frontRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFrontFile(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>

              {/* Back photo */}
              <div className="space-y-2">
                <Label>Foto trasera del documento</Label>
                <div
                  onClick={() => backRef.current?.click()}
                  className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
                >
                  {backFile ? (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileCheck className="h-5 w-5" />
                      <span>{backFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        Click para subir la foto trasera
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPG, PNG o WEBP
                      </p>
                    </>
                  )}
                  <input
                    ref={backRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setBackFile(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>

              {/* Selfie */}
              <div className="space-y-2">
                <Label>Selfie con el documento</Label>
                <div
                  onClick={() => selfieRef.current?.click()}
                  className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
                >
                  {selfieFile ? (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileCheck className="h-5 w-5" />
                      <span>{selfieFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        Click para subir una selfie sosteniendo tu documento
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPG, PNG o WEBP
                      </p>
                    </>
                  )}
                  <input
                    ref={selfieRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setSelfieFile(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Enviar documentos
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
