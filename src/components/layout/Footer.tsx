import Link from 'next/link'
import { BrandWordmark } from '@/components/BrandLogo'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/">
              <BrandWordmark size="sm" variant="light" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Democratizando la inversión inmobiliaria en Uruguay a través de la tokenización.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Plataforma</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/propiedades" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Mi portfolio
                </Link>
              </li>
              <li>
                <Link href="/como-funciona#faq" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/legal/terminos" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/regulaciones" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Regulaciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:info@bricktoken.uy"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  info@bricktoken.uy
                </a>
              </li>
              <li className="text-sm text-slate-500">Montevideo, Uruguay</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed text-center sm:text-left">
            <em>
              BrickToken es una plataforma en desarrollo de tokenización
              inmobiliaria respaldada por fideicomisos bajo Ley 17.703 de
              Uruguay. La información presentada tiene carácter informativo y no
              constituye oferta pública de valores. Las rentabilidades estimadas
              son proyecciones basadas en datos históricos y no garantizan
              rentabilidades futuras.
            </em>
          </p>
          <p className="text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} BrickToken. Todos los derechos reservados.
            Operado bajo la Ley 17.703 de Fideicomisos.
          </p>
        </div>
      </div>
    </footer>
  )
}
