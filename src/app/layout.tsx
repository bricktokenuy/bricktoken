import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
