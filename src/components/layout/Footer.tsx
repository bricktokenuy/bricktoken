import Link from 'next/link'
import { BrandWordmark } from '@/components/BrandLogo'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/">
              <BrandWordmark size="sm" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Inversión inmobiliaria fraccionada en Uruguay.
              Respaldada por fideicomisos escriturados.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Plataforma</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/propiedades" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-slate-600">Términos y condiciones</li>
              <li className="text-sm text-slate-600">Política de privacidad</li>
              <li className="text-sm text-slate-600">Marco regulatorio</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-slate-600">info@bricktoken.uy</li>
              <li className="text-sm text-slate-600">Montevideo, Uruguay</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} BrickToken. Todos los derechos reservados.
          Cada token representa una participación beneficiaria en un fideicomiso inmobiliario constituido bajo la Ley 17.703.
        </div>
      </div>
    </footer>
  )
}
