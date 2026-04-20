import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { PreLaunchBanner } from "@/components/layout/PreLaunchBanner"
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

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bricktoken-beige.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "BrickToken — Inversión inmobiliaria fraccionada en Uruguay",
    template: "%s | BrickToken",
  },
  description:
    "Tokenizamos inmuebles uruguayos respaldados por fideicomisos bajo Ley 17.703. Invertí desde USD 50.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "inversión inmobiliaria",
    "tokenización",
    "Uruguay",
    "fideicomiso",
    "Ley 17.703",
    "blockchain",
    "Solana",
    "real estate",
    "crowdfunding inmobiliario",
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: "BrickToken",
    url: SITE_URL,
    title: "BrickToken — Inversión inmobiliaria fraccionada en Uruguay",
    description:
      "Tokenizamos inmuebles uruguayos respaldados por fideicomisos bajo Ley 17.703. Invertí desde USD 50.",
    images: [
      {
        url: "/og/default",
        width: 1200,
        height: 630,
        alt: "BrickToken — Inversión inmobiliaria tokenizada en Uruguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrickToken — Inversión inmobiliaria fraccionada en Uruguay",
    description:
      "Tokenizamos inmuebles uruguayos respaldados por fideicomisos bajo Ley 17.703. Invertí desde USD 50.",
    images: ["/og/default"],
  },
}

export const viewport: Viewport = {
  themeColor: "#0F1729", // brand navy
  width: "device-width",
  initialScale: 1,
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
        <PreLaunchBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
