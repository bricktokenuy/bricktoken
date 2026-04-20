import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  FileCheck,
  Scale,
  Coins,
  ShoppingCart,
  Home,
  TrendingUp,
  ChevronDown,
  ShieldCheck,
  HelpCircle,
  Building2,
  Landmark,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Cómo funciona",
}

const steps = [
  {
    icon: Search,
    title: "Selección de propiedad",
    description:
      "Identificamos inmuebles con alto potencial de renta y plusvalía en Uruguay. Cada propiedad pasa un filtro riguroso de ubicación, estado y mercado.",
  },
  {
    icon: FileCheck,
    title: "Due diligence",
    description:
      "Un escribano realiza el estudio de títulos completo: verificación de dominio, gravámenes, inhibiciones, y situación catastral y tributaria.",
  },
  {
    icon: Scale,
    title: "Constitución del fideicomiso",
    description:
      "Se constituye un fideicomiso bajo Ley 17.703 mediante escritura pública. La propiedad queda como patrimonio fideicomitido, separado y protegido.",
  },
  {
    icon: Coins,
    title: "Tokenización",
    description:
      "Se crean tokens en la blockchain de Solana. Cada token representa una participación proporcional en el fideicomiso y, por ende, en la propiedad.",
  },
  {
    icon: ShoppingCart,
    title: "Venta de tokens",
    description:
      "Los inversores adquieren tokens a través de la plataforma. El proceso es simple: registrarse, verificar identidad, y comprar con transferencia o cripto.",
  },
  {
    icon: Home,
    title: "Alquiler de la propiedad",
    description:
      "Una administradora profesional gestiona el alquiler, mantenimiento y relación con inquilinos. Vos solo ves los rendimientos.",
  },
  {
    icon: TrendingUp,
    title: "Distribución de rendimientos",
    description:
      "Los ingresos por alquiler se distribuyen automáticamente a cada inversor de forma proporcional a sus tokens, de forma trimestral.",
  },
]

const faqs = [
  {
    question: "¿Es legal?",
    answer:
      "Sí. BrickToken opera bajo el marco legal uruguayo utilizando fideicomisos regulados por la Ley 17.703. Cada propiedad cuenta con un fideicomiso constituido por escritura pública ante escribano. Los tokens representan participaciones en ese fideicomiso, lo cual es perfectamente legal.",
  },
  {
    question: "¿Cuánto es lo mínimo que puedo invertir?",
    answer:
      "Depende de la propiedad. Los precios de tokens arrancan desde USD 50 por token, lo que permite acceder a inversiones inmobiliarias que tradicionalmente requerían decenas o cientos de miles de dólares.",
  },
  {
    question: "¿Cómo cobro los rendimientos?",
    answer:
      "Los rendimientos por alquiler se distribuyen trimestralmente de forma automática. Cada token holder recibe su parte proporcional directamente. Si tenés 100 de 1.000 tokens de una propiedad, recibís el 10% de los ingresos netos por alquiler.",
  },
  {
    question: "¿Puedo vender mis tokens?",
    answer:
      "Sí. Los tokens son transferibles. El mercado secundario estará disponible próximamente: vas a poder listar tus tokens para vender a otros inversores directamente desde la plataforma.",
  },
  {
    question: "¿Qué pasa si la propiedad se desvaloriza?",
    answer:
      "Como toda inversión inmobiliaria, existe el riesgo de desvalorización. Sin embargo, el mercado inmobiliario uruguayo ha demostrado históricamente ser estable. Además, la diversificación en múltiples propiedades reduce significativamente este riesgo.",
  },
  {
    question: "¿Quién administra las propiedades?",
    answer:
      "Cada propiedad es gestionada por una administradora profesional seleccionada por BrickToken. Ellos se encargan de la búsqueda de inquilinos, cobro de alquileres, mantenimiento preventivo y correctivo, y toda la gestión operativa.",
  },
]

export default function ComoFunciona() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">
            Proceso de inversión
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Cómo funciona BrickToken
          </h1>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Invertir en inmuebles uruguayos nunca fue tan simple. Te explicamos
            paso a paso cómo funciona la tokenización inmobiliaria.
          </p>
        </div>
      </section>

      {/* Que es BrickToken */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-start gap-5">
            <div className="rounded-xl bg-gold/10 p-3.5 shrink-0">
              <Building2 className="h-7 w-7 text-gold" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">
                Plataforma
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                ¿Qué es BrickToken?
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                BrickToken es una plataforma de inversión inmobiliaria
                fraccionada. Permitimos que cualquier persona invierta en
                propiedades uruguayas de alta calidad desde montos accesibles,
                sin necesidad de comprar un inmueble completo. Cada propiedad se
                divide en tokens digitales que representan una fracción del
                valor, y los inversores reciben rendimientos proporcionales por
                los alquileres generados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* El fideicomiso */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-start gap-5">
            <div className="rounded-xl bg-gold/10 p-3.5 shrink-0">
              <Landmark className="h-7 w-7 text-gold" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">
                Marco legal
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                El fideicomiso
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Toda la estructura de BrickToken se basa en la{" "}
                <strong className="text-slate-900">Ley 17.703 de Fideicomiso</strong> de Uruguay. Para cada
                propiedad, un escribano público constituye un fideicomiso
                mediante escritura pública inscrita en el Registro. La propiedad
                se transfiere al patrimonio fideicomitido, que es un patrimonio
                de afectación separado: no pertenece ni al fiduciante, ni al
                fiduciario, ni a los beneficiarios de forma individual. Esto
                brinda una protección jurídica única.
              </p>
              <p className="mt-4 text-slate-500 leading-relaxed">
                El fiduciario administra la propiedad en beneficio de los token
                holders (beneficiarios del fideicomiso). Los rendimientos se
                distribuyen según lo establecido en el contrato de fideicomiso,
                de forma proporcional a la cantidad de tokens que posee cada
                inversor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Los tokens */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-start gap-5">
            <div className="rounded-xl bg-gold/10 p-3.5 shrink-0">
              <Coins className="h-7 w-7 text-gold" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">
                Tecnología
              </p>
              <h2 className="text-2xl font-bold text-slate-900">Los tokens</h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Cada token es un activo digital registrado en la blockchain de{" "}
                <strong className="text-slate-900">Solana</strong>, una de las redes más rápidas y
                económicas del mercado. Un token representa una participación en
                el fideicomiso que posee la propiedad real. No es una promesa ni
                un derivado: está respaldado por un inmueble escriturado en
                Uruguay, con todas las garantías legales que eso implica.
              </p>
              <p className="mt-4 text-slate-500 leading-relaxed">
                La blockchain brinda transparencia total: cualquiera puede
                verificar la cantidad de tokens emitidos, las transferencias y
                las distribuciones de rendimientos. Además, al ser tokens en
                Solana, son transferibles las 24 horas del día, los 7 días de la
                semana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* El proceso */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3 text-center">
            Paso a paso
          </p>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-14">
            El proceso de inversión
          </h2>
          <div className="space-y-5">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden border-slate-200">
                <CardContent className="flex items-start gap-5 p-7">
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy">
                      {index + 1}
                    </span>
                    <div className="rounded-xl bg-gold/10 p-2.5">
                      <step.icon className="h-5 w-5 text-gold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="rounded-xl bg-gold/10 p-3.5">
              <HelpCircle className="h-7 w-7 text-gold" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">
                FAQ
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Preguntas frecuentes
              </h2>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl border border-slate-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-slate-900 hover:text-gold transition-colors">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-400 mb-5" />
          <h2 className="font-heading text-3xl font-bold text-white">
            Empezá a invertir hoy
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Creá tu cuenta en minutos y accedé a las mejores propiedades de
            Uruguay.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/auth/registro"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gold hover:bg-gold-dark text-navy font-semibold"
              )}
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/propiedades"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
