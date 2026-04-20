import { getAllProperties } from '@/lib/queries'
import { demoProperties } from '@/lib/demo-data'
import { PropiedadesFilters } from './PropiedadesFilters'

export default async function PropiedadesPage() {
  const dbProperties = await getAllProperties()
  // Fallback to demo data (pre-launch) if DB is empty
  const properties = dbProperties.length > 0 ? dbProperties : demoProperties

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
          Inversiones disponibles
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Propiedades</h1>
        <p className="mt-2 text-slate-500">
          Explorá las oportunidades de inversión inmobiliaria tokenizada en Uruguay.
        </p>
      </div>

      <PropiedadesFilters initialProperties={properties} />
    </div>
  )
}
