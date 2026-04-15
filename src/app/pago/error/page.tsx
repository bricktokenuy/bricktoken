'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RotateCcw, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'

function PagoErrorContent() {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transaction_id')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-slate-200 shadow-lg bg-white">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Error en el pago
            </h1>
            <p className="mt-2 text-slate-500">
              No se pudo procesar tu pago. No se realizo ningun cobro. Podes
              intentar nuevamente o elegir otra forma de pago.
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
              href="/propiedades"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
              )}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Intentar nuevamente
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al portafolio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PagoErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-slate-400">Cargando...</p>
        </div>
      }
    >
      <PagoErrorContent />
    </Suspense>
  )
}
