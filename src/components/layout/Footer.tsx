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
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-slate-400">Términos de uso</li>
              <li className="text-sm text-slate-400">Privacidad</li>
              <li className="text-sm text-slate-400">Regulaciones</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-slate-400">info@bricktoken.uy</li>
              <li className="text-sm text-slate-400">LinkedIn</li>
              <li className="text-sm text-slate-400">Twitter</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} BrickToken. Todos los derechos reservados.
          Operado bajo la Ley 17.703 de Fideicomisos.
        </div>
      </div>
    </footer>
  )
}
