'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { translateAuthError, isValidCI } from '@/lib/auth-errors'

function RegistroForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [ciError, setCiError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    document_type: 'CI',
    document_number: '',
    terms: false,
  })

  function updateField(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'document_number' || field === 'document_type') {
      // clear previous CI error when user edits
      setCiError('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return // prevent double submit

    if (!form.terms) {
      setError('Debés aceptar los términos y condiciones.')
      return
    }

    // Client-side CI validation (Uruguay) — server-side validation is also enforced
    if (form.document_type === 'CI' && !isValidCI(form.document_number)) {
      setCiError('La cédula uruguaya no es válida. Verificá el número y el dígito verificador.')
      return
    }

    setLoading(true)
    setError('')
    setCiError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        data: {
          full_name: form.full_name,
          phone: form.phone,
          document_type: form.document_type,
          document_number: form.document_number,
        },
      },
    })

    setLoading(false)
    if (error) {
      setError(translateAuthError(error.message))
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12 bg-slate-50">
        <Card className="w-full max-w-md border-slate-200 shadow-sm bg-white">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Registro exitoso
            </p>
            <CardTitle className="text-2xl font-bold text-slate-900">Revisá tu email</CardTitle>
            <CardDescription className="text-slate-500">
              Te enviamos un link de verificación a <strong>{form.email}</strong>. Revisá
              tu bandeja de entrada (y la carpeta de spam) y hacé clic en el
              link para activar tu cuenta.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12 bg-slate-50">
      <Card className="w-full max-w-md border-slate-200 shadow-sm bg-white">
        <CardHeader className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Registro
          </p>
          <CardTitle className="text-2xl font-bold text-slate-900">Crear cuenta</CardTitle>
          <CardDescription className="text-slate-500">
            Completá tus datos para comenzar a invertir en propiedades tokenizadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-slate-900">Nombre completo</Label>
              <Input
                id="full_name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Juan Pérez"
                required
                value={form.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                disabled={loading}
                className="border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="tu@email.com"
                required
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                disabled={loading}
                className="border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-900">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+598 99 123 456"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                disabled={loading}
                className="border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document_type" className="text-slate-900">Tipo de documento</Label>
                <Select
                  value={form.document_type}
                  onValueChange={(v) => updateField('document_type', v ?? 'CI')}
                  disabled={loading}
                >
                  <SelectTrigger id="document_type" className="border-slate-200">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CI">CI</SelectItem>
                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="DNI">DNI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document_number" className="text-slate-900">Nro. de documento</Label>
                <Input
                  id="document_number"
                  name="document_number"
                  type="text"
                  autoComplete="off"
                  placeholder={form.document_type === 'CI' ? '1.234.567-8' : 'Número'}
                  required
                  value={form.document_number}
                  onChange={(e) => updateField('document_number', e.target.value)}
                  disabled={loading}
                  aria-invalid={ciError ? true : undefined}
                  aria-describedby={ciError ? 'ci-error' : undefined}
                  className="border-slate-200 focus-visible:ring-blue-600"
                />
                {ciError && (
                  <p id="ci-error" className="text-xs text-red-600" role="alert">
                    {ciError}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={(e) => updateField('terms', e.target.checked)}
                required
                disabled={loading}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-snug text-slate-500">
                Acepto los{' '}
                <Link href="/legal/terminos" className="text-blue-600 hover:text-blue-700">
                  términos y condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/legal/privacidad" className="text-blue-600 hover:text-blue-700">
                  política de privacidad
                </Link>
              </Label>
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-500">
            ¿Ya tenés cuenta?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense fallback={null}>
      <RegistroForm />
    </Suspense>
  )
}
