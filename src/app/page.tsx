import Link from 'next/link'
import { ArrowRight, Shield, Coins, BarChart3, Building2, Users, FileText } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { HeroSkyline } from '@/components/HeroSkyline'
import { demoProperties } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const featuredProperties = demoProperties.filter(p => p.status === 'funding').slice(0, 3)

  return (
    <div>
      {/* Hero — fondo oscuro */}
      <section className="relative bg-slate-900 py-24 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900" />
        {/* Cityscape skyline */}
        <HeroSkyline />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.1]">
              Tokenizamos Inmuebles.
            </h1>
            <p className="mt-4 text-xl text-blue-200 sm:text-2xl">
              Invertir en Real Estate nunca fue más fácil.
            </p>
            <p className="mt-8 text-base leading-relaxed text-slate-400 sm:text-lg max-w-xl mx-auto">
              Elegí propiedades verificadas, invertí el monto que quieras
              y recibí rendimientos. Cada token representa tu participación
              en un fideicomiso real.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/propiedades"
                className={cn(buttonVariants({ size: 'lg' }), 'bg-blue-600 hover:bg-blue-500 text-white text-sm px-8 h-11')}
              >
                Ver propiedades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/como-funciona"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-slate-400 bg-transparent text-white hover:bg-white/10 hover:text-white text-sm px-8 h-11')}
              >
                Cómo funciona
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-12 sm:grid-cols-4">
            {[
              { label: 'Propiedades', value: '6' },
              { label: 'Valor tokenizado', value: 'USD 3.3M' },
              { label: 'Inversores', value: '127' },
              { label: 'Yield promedio', value: '7.5%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona — blanco */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-blue-600">Proceso</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Cómo funciona</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                icon: Building2,
                step: '01',
                title: 'Elegí una propiedad',
                description: 'Explorá propiedades verificadas en todo Uruguay. Cada una cuenta con escritura, valuación independiente y fideicomiso constituido.',
              },
              {
                icon: Coins,
                step: '02',
                title: 'Comprá tokens',
                description: 'Invertí desde USD 50 comprando tokens que representan tu participación en el fideicomiso. Sin papeleos, sin intermediarios.',
              },
              {
                icon: BarChart3,
                step: '03',
                title: 'Cobrá rendimientos',
                description: 'Recibí tu parte proporcional de los alquileres directamente. Vendé tus tokens cuando quieras en el mercado secundario.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">Paso {item.step}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Propiedades destacadas — slate oscuro */}
      <section className="bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-blue-400">Oportunidades</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Propiedades en financiación</h2>
            </div>
            <Link
              href="/propiedades"
              className={cn(buttonVariants({ variant: 'ghost' }), 'hidden text-slate-400 hover:text-white sm:flex')}
            >
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/propiedades"
              className={cn(buttonVariants({ variant: 'outline' }), 'border-slate-700 text-slate-300')}
            >
              Ver todas las propiedades
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué BrickToken — blanco */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-blue-600">Ventajas</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Por qué BrickToken</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Respaldo legal real',
                description: 'Cada propiedad está en un fideicomiso escriturado por escribano público bajo la Ley 17.703. Tu inversión tiene respaldo jurídico.',
              },
              {
                icon: Coins,
                title: 'Desde USD 50',
                description: 'No necesitás USD 200.000 para invertir en inmuebles. Empezá con lo que tengas y diversificá entre varias propiedades.',
              },
              {
                icon: BarChart3,
                title: 'Rendimientos reales',
                description: 'Cobrá tu parte del alquiler proporcionalmente a tus tokens. Sin letra chica, con transparencia total.',
              },
              {
                icon: Users,
                title: 'Due diligence profesional',
                description: 'Cada propiedad pasa por estudio de títulos, valuación independiente y análisis de mercado antes de ser listada.',
              },
              {
                icon: FileText,
                title: 'Transparencia total',
                description: 'Accedé a toda la documentación: escrituras, planos, contratos de alquiler, estados financieros y distribuciones.',
              },
              {
                icon: Building2,
                title: 'Todo Uruguay',
                description: 'Desde Punta del Este hasta Colonia, de Montevideo a Rocha. Invertí en los mejores mercados inmobiliarios del país.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — azul profundo */}
      <section className="bg-blue-950 py-20">
        <div className="absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Empezá a invertir hoy
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-200/70">
            Creá tu cuenta en 2 minutos y accedé a las mejores oportunidades
            inmobiliarias de Uruguay.
          </p>
          <div className="mt-10">
            <Link
              href="/auth/registro"
              className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-blue-950 hover:bg-blue-50 text-sm px-8 h-11 font-semibold')}
            >
              Crear cuenta gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
