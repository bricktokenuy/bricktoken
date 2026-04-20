import { AlertTriangle } from 'lucide-react'

export function DraftBanner() {
  return (
    <div
      role="alert"
      className="mb-8 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4"
    >
      <AlertTriangle
        className="h-5 w-5 text-amber-600 mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div className="text-sm text-amber-900 leading-relaxed">
        <p className="font-semibold uppercase tracking-wider text-amber-700 mb-1">
          Documento borrador — no vinculante
        </p>
        <p>
          Este texto es un placeholder mientras se redacta el documento legal
          definitivo por el escribano responsable. No utilizar como referencia
          legal.
        </p>
      </div>
    </div>
  )
}
