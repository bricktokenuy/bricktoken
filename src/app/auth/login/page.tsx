'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12 bg-slate-50">
        <Card className="w-full max-w-md border-slate-200 shadow-sm bg-white">
          <CardHeader className="text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Email enviado
            </p>
            <CardTitle className="text-2xl font-bold text-slate-900">Revisá tu email</CardTitle>
            <CardDescription className="text-slate-500">
              Te enviamos un link de acceso a <strong>{email}</strong>. Hacé clic en el link para iniciar sesión.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setSent(false)}
            >
              Enviar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12 bg-slate-50">
      <Card className="w-full max-w-md border-slate-200 shadow-sm bg-white">
        <CardHeader className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Acceso
          </p>
          <CardTitle className="text-2xl font-bold text-slate-900">Iniciar sesión</CardTitle>
          <CardDescription className="text-slate-500">
            Ingresá tu email y te enviaremos un link de acceso seguro. Sin contraseñas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Enviando...' : 'Enviar link de acceso'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-500">
            ¿No tenés cuenta?{' '}
            <Link href="/auth/registro" className="text-blue-600 hover:text-blue-700 font-medium">
              Crear cuenta
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
