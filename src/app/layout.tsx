import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "BrickToken — Inversión inmobiliaria fraccionada en Uruguay",
    template: "%s | BrickToken",
  },
  description:
    "Invertí en propiedades uruguayas desde USD 50. Tokens respaldados por fideicomisos escriturados. Rendimientos por alquiler distribuidos automáticamente.",
  keywords: [
    "inversión inmobiliaria",
    "tokenización",
    "Uruguay",
    "fideicomiso",
    "blockchain",
    "Solana",
    "real estate",
    "crowdfunding inmobiliario",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
