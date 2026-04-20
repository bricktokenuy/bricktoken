import type { Metadata } from 'next'
import { DraftBanner } from '@/components/legal/DraftBanner'

export const metadata: Metadata = {
  title: 'Regulaciones aplicables',
  description:
    'Marco regulatorio aplicable a la operativa de BrickToken (borrador).',
}

const sections: { title: string; placeholder: string }[] = [
  {
    title: '1. Marco legal del fideicomiso',
    placeholder:
      '(Pendiente de redacción) Aplicación de la Ley 17.703 de Fideicomisos: estructura jurídica, patrimonio de afectación, rol del fiduciario y beneficiarios.',
  },
  {
    title: '2. Régimen tributario',
    placeholder:
      '(Pendiente de redacción) Tratamiento fiscal de la inversión, distribución de rendimientos, transferencias y eventos imponibles según la normativa uruguaya.',
  },
  {
    title: '3. Prevención de lavado de activos',
    placeholder:
      '(Pendiente de redacción) Obligaciones derivadas de la Ley 19.574 de Prevención de Lavado de Activos: debida diligencia, monitoreo, reportes a la UIAF.',
  },
  {
    title: '4. Protección al consumidor financiero',
    placeholder:
      '(Pendiente de redacción) Aplicación de normativa de defensa del consumidor y transparencia en la relación con el inversor.',
  },
  {
    title: '5. Naturaleza de los tokens',
    placeholder:
      '(Pendiente de redacción) Calificación jurídica de los tokens emitidos: representación de derechos sobre el patrimonio fideicomitido. No constituyen oferta pública de valores.',
  },
  {
    title: '6. Cambios regulatorios',
    placeholder:
      '(Pendiente de redacción) Política frente a cambios regulatorios sobrevinientes que puedan impactar la operativa.',
  },
]

export default function RegulacionesPage() {
  return (
    <>
      <DraftBanner />

      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Regulaciones aplicables
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
