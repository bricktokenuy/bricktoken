import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description:
    'Ingresá a tu cuenta de BrickToken para gestionar tus inversiones inmobiliarias tokenizadas.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
