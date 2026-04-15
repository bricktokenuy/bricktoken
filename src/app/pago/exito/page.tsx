'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'

function PagoExitoContent() {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transaction_id')
  const isPending = searchParams.get('pending') === 'true'

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-slate-200 shadow-lg bg-white">
        <CardContent className="p-8 text-center space-y-6">
          {isPending ? (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isPending ? 'Pago en proceso' : 'Pago exitoso'}
            </h1>
            <p className="mt-2 text-slate-500">
              {isPending
                ? 'Tu pago esta siendo procesado. Te notificaremos cuando se confirme.'
                : 'Tu inversion ha sido registrada exitosamente. Los tokens fueron asignados a tu cuenta.'}
            </p>
          </div>

          {transactionId && (
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-400 mb-1">
                ID de transaccion
              </p>
              <p className="text-sm font-mono text-slate-700 break-all">
                {transactionId}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
              )}
            >
              Ver mi portafolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/propiedades"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              Explorar mas propiedades
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PagoExitoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-slate-400">Cargando...</p>
        </div>
      }
    >
      <PagoExitoContent />
    </Suspense>
  )
}
