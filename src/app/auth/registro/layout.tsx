import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description:
    'Creá tu cuenta gratis en BrickToken y empezá a invertir en propiedades uruguayas tokenizadas desde USD 50.',
}

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
