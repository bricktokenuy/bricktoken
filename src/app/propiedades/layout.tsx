import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Propiedades disponibles',
  description:
    'Explorá las propiedades uruguayas tokenizadas disponibles para invertir desde USD 50.',
}

export default function PropiedadesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
