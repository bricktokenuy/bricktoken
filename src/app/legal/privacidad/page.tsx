import type { Metadata } from 'next'
import { DraftBanner } from '@/components/legal/DraftBanner'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Política de privacidad y tratamiento de datos personales de BrickToken (borrador).',
}

const sections: { title: string; placeholder: string }[] = [
  {
    title: '1. Responsable del tratamiento',
    placeholder:
      '(Pendiente de redacción) Identificación del responsable del tratamiento de datos personales y datos de contacto.',
  },
  {
    title: '2. Datos personales recabados',
    placeholder:
      '(Pendiente de redacción) Categorías de datos recabados: identificación, contacto, financieros, documentación de KYC, datos de navegación.',
  },
  {
    title: '3. Finalidades del tratamiento',
    placeholder:
      '(Pendiente de redacción) Finalidades específicas: cumplimiento de obligaciones legales, ejecución contractual, prevención de fraude, comunicaciones comerciales.',
  },
  {
    title: '4. Base legal',
    placeholder:
      '(Pendiente de redacción) Base legitimadora del tratamiento conforme a la Ley 18.331 de Protección de Datos Personales de Uruguay.',
  },
  {
    title: '5. Conservación de datos',
    placeholder:
      '(Pendiente de redacción) Plazos de conservación según obligaciones legales (lavado de activos, fiscales, contractuales).',
  },
  {
    title: '6. Derechos del titular',
    placeholder:
      '(Pendiente de redacción) Derechos de acceso, rectificación, cancelación y oposición (ARCO). Mecanismo de ejercicio.',
  },
  {
    title: '7. Cesión a terceros',
    placeholder:
      '(Pendiente de redacción) Cesiones autorizadas: fiduciario, escribano, procesadores de pago, autoridades competentes.',
  },
  {
    title: '8. Cookies y tecnologías similares',
    placeholder:
      '(Pendiente de redacción) Uso de cookies propias y de terceros, finalidad y opciones de configuración.',
  },
  {
    title: '9. Seguridad de la información',
    placeholder:
      '(Pendiente de redacción) Medidas técnicas y organizativas para proteger los datos personales.',
  },
  {
    title: '10. Contacto',
    placeholder:
      '(Pendiente de redacción) Canal de contacto para consultas sobre privacidad: privacidad@bricktoken.uy.',
  },
]

export default function PrivacidadPage() {
  return (
    <>
      <DraftBanner />

      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Política de privacidad
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
