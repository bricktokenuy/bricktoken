import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollText } from 'lucide-react'

export const metadata: Metadata = {
  title: { default: 'Documentos legales', template: '%s | Legal' },
  description:
    'Términos y condiciones, política de privacidad y regulaciones aplicables a BrickToken.',
}

const sections = [
  { href: '/legal/terminos', label: 'Términos y condiciones' },
  { href: '/legal/privacidad', label: 'Política de privacidad' },
  { href: '/legal/regulaciones', label: 'Regulaciones' },
]

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-200px)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-xs text-slate-400 flex items-center gap-1.5"
        >
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-600">Legal</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
              <ScrollText className="h-4 w-4" aria-hidden="true" />
              Documentos
            </p>
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
            {children}
          </article>
        </div>
      </div>
    </div>
  )
}
