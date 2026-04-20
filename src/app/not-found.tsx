import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, Compass } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscás no existe en BrickToken.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-50 p-4">
            <Compass className="h-12 w-12 text-blue-600" aria-hidden="true" />
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Error 404
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          La página que buscás no existe
        </h1>
        <p className="text-slate-500">
          Es posible que el enlace esté roto o que la página haya sido movida.
          Volvé al inicio o explorá las propiedades disponibles.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            Volver al inicio
          </Link>
          <Link
            href="/propiedades"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'border-slate-200 text-slate-700 hover:bg-slate-50'
            )}
          >
            <Building2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Ver propiedades
          </Link>
        </div>
      </div>
    </div>
  )
}
