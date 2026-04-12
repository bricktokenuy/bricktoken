import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Propiedades',
}

export default function PropiedadesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
