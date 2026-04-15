import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Coins, BarChart3, Building2, FileText, MapPin } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { getFeaturedProperties } from '@/lib/queries'
import { cn } from '@/lib/utils'

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <div>
      {/* ══════════════════════════════════════════════════
          HERO — foto de edificio + overlay oscuro
         ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/hero-building.jpg"
          alt="Edificio premium en Uruguay"
          fill
          priority
          className="object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />

        <div className="relative w-full mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold-light">
              <span className="h-2 w-2 rounded-full bg-gold" />
              Inversión inmobiliaria tokenizada
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[5rem] leading-[1.08]">
            Tokenizamos<br />
            <span className="text-gold">Inmuebles.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Elegí propiedades verificadas, invertí el monto que quieras y recibí
            rendimientos. Cada token representa tu participación en un fideicomiso real.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/propiedades"
              className={cn(buttonVariants({ size: 'lg' }), 'bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-8 h-12')}
            >
              Ver propiedades
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/como-funciona"
              className={cn(buttonVariants({ size: 'lg' }), 'bg-white/90 hover:bg-white text-slate-900 font-semibold text-sm px-8 h-12')}
            >
              Cómo funciona
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-0">
            {[
              { label: 'Propiedades', value: '6' },
              { label: 'Valor tokenizado', value: 'USD 3.3M' },
              { label: 'Inversores', value: '127' },
              { label: 'Yield promedio', value: '7.5%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CÓMO FUNCIONA — 3 pasos
         ══════════════════════════════════════════════════ */}
      <section id="como-funciona" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">Proceso</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Cómo funciona</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
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
              <div key={item.step} className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
                  <item.icon className="h-6 w-6 text-gold" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Paso {item.step}</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROPIEDADES EN FINANCIACIÓN
         ══════════════════════════════════════════════════ */}
      <section id="propiedades" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">Oportunidades</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Propiedades en financiación</h2>
            </div>
            <Link
              href="/propiedades"
              className={cn(buttonVariants({ variant: 'ghost' }), 'hidden text-slate-500 hover:text-slate-900 sm:flex')}
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
              className={cn(buttonVariants({ variant: 'outline' }), 'border-slate-300 text-slate-600')}
            >
              Ver todas las propiedades
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          POR QUÉ BRICKTOKEN — 6 ventajas
         ══════════════════════════════════════════════════ */}
      <section id="ventajas" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">Ventajas</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Por qué BrickToken</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Respaldo legal real',
                description: 'Cada propiedad está en un fideicomiso escriturado por escribano público bajo la Ley 17.703.',
              },
              {
                icon: Coins,
                title: 'Desde USD 50',
                description: 'No necesitás USD 200.000 para invertir en inmuebles. Empezá con lo que tengas.',
              },
              {
                icon: BarChart3,
                title: 'Rendimientos reales',
                description: 'Cobrá tu parte del alquiler proporcionalmente a tus tokens. Sin letra chica.',
              },
              {
                icon: FileText,
                title: 'Due diligence profesional',
                description: 'Estudio de títulos, valuación independiente y análisis de mercado para cada propiedad.',
              },
              {
                icon: Building2,
                title: 'Transparencia total',
                description: 'Accedé a escrituras, planos, contratos de alquiler, estados financieros y distribuciones.',
              },
              {
                icon: MapPin,
                title: 'Todo Uruguay',
                description: 'Desde Punta del Este hasta Colonia. Invertí en los mejores mercados del país.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                  <item.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — fondo oscuro
         ══════════════════════════════════════════════════ */}
      <section className="relative bg-navy py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Empezá a invertir hoy
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Creá tu cuenta en 2 minutos y accedé a las mejores oportunidades
            inmobiliarias de Uruguay.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/registro"
              className={cn(buttonVariants({ size: 'lg' }), 'bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-8 h-12')}
            >
              Crear cuenta gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="mailto:info@bricktoken.uy"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white text-sm px-8 h-12')}
            >
              Contactar equipo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
