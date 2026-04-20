import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mercado secundario',
  description:
    'Mercado secundario de tokens inmobiliarios. Comprá y vendé tokens de propiedades entre inversores.',
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
