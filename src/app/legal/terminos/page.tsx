import type { Metadata } from 'next'
import { DraftBanner } from '@/components/legal/DraftBanner'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description:
    'Términos y condiciones de uso de la plataforma BrickToken (borrador).',
}

const sections: { title: string; placeholder: string }[] = [
  {
    title: '1. Objeto del servicio',
    placeholder:
      '(Pendiente de redacción) Descripción del servicio que ofrece la plataforma BrickToken: tokenización de inmuebles uruguayos respaldados por fideicomisos bajo Ley 17.703.',
  },
  {
    title: '2. Aceptación de los términos',
    placeholder:
      '(Pendiente de redacción) Mecanismo de aceptación de los términos, modificaciones unilaterales, vigencia y comunicación de cambios al usuario.',
  },
  {
    title: '3. Cuenta de usuario y KYC',
    placeholder:
      '(Pendiente de redacción) Requisitos para abrir cuenta, proceso de verificación de identidad (KYC), documentación requerida, criterios de aprobación o rechazo, y obligaciones del titular de la cuenta.',
  },
  {
    title: '4. Operativa de tokens',
    placeholder:
      '(Pendiente de redacción) Mecánica de compra y venta de tokens, comisiones, custodia, liquidación, transferencias entre usuarios y limitaciones operativas.',
  },
  {
    title: '5. Riesgos de la inversión',
    placeholder:
      '(Pendiente de redacción) Detalle de riesgos asociados a la inversión inmobiliaria fraccionada: riesgo de mercado, liquidez, valuación, regulatorio y operacional.',
  },
  {
    title: '6. Limitación de responsabilidad',
    placeholder:
      '(Pendiente de redacción) Alcance y límites de la responsabilidad de BrickToken frente al usuario.',
  },
  {
    title: '7. Propiedad intelectual',
    placeholder:
      '(Pendiente de redacción) Titularidad sobre marcas, contenidos, software y datos generados en la plataforma.',
  },
  {
    title: '8. Ley aplicable y jurisdicción',
    placeholder:
      '(Pendiente de redacción) Ley uruguaya aplicable y jurisdicción competente para la resolución de conflictos.',
  },
]

export default function TerminosPage() {
  return (
    <>
      <DraftBanner />

      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Términos y condiciones
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Documento en redacción. Última actualización: pendiente.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {s.title}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              {s.placeholder}
            </p>
          </section>
        ))}
      </div>
    </>
  )
}
