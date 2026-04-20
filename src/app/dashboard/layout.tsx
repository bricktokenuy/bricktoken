import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'

export const metadata: Metadata = {
  title: 'Mi portfolio',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" />
                <span className="font-semibold text-slate-900 tracking-tight">
                  Mi cuenta
                </span>
              </div>
              <nav className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Resumen
                </Link>
                <Link
                  href="/dashboard/rendimientos"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Rendimientos
                </Link>
                <Link
                  href="/dashboard/vender"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Vender
                </Link>
                <Link
                  href="/dashboard/kyc"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Verificación
                </Link>
                <Link
                  href="/dashboard/notificaciones"
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Notificaciones
                </Link>
              </nav>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al sitio
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
