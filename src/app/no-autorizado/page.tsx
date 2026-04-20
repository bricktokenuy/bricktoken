import Link from 'next/link'
import { ShieldX } from 'lucide-react'

export default function NoAutorizadoPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <ShieldX className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Acceso denegado
        </h1>
        <p className="text-slate-500">
          No tenés permisos para acceder a esta página.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  )
}
