import type { NextConfig } from "next";

/**
 * Defensive HTTP security headers.
 *
 * CSP rationale (BrickToken stack):
 *  - Next.js App Router on Vercel + React 19 + Tailwind 4 + shadcn/ui.
 *  - Supabase: HTTPS REST + WSS realtime → connect-src *.supabase.co + wss.
 *  - MercadoPago: payments are server-to-server (REST from /api/comprar);
 *    user is redirected to mercadopago.com (top-level navigation, no embed).
 *    No MP browser SDK is loaded today, so no script-src entry for MP.
 *    We DO permit form-action to mercadopago in case a future flow POSTs
 *    a form to MP from the browser.
 *  - Tailwind/shadcn rely on inline <style> blocks → style-src 'unsafe-inline'.
 *  - Next 16 hydration uses inline scripts and (in dev) eval → script-src
 *    permits 'unsafe-inline' always and 'unsafe-eval' only in development.
 *  - Dev mode: HMR uses ws://localhost → connect-src includes ws: in dev.
 *  - X-Frame-Options DENY + frame-ancestors 'none' → no embedding allowed
 *    (defends clickjacking; browsers honour the stricter of the two).
 *  - Strict-Transport-Security: belt-and-suspenders, Vercel already sends it.
 */

const isDev = process.env.NODE_ENV !== "production";

const cspDirectives = [
  "default-src 'self'",
  // Next.js inline runtime + (dev only) eval for HMR.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind/shadcn ship inline styles.
  "style-src 'self' 'unsafe-inline'",
  // next/image with remote patterns + Supabase Storage public buckets.
  "img-src 'self' data: blob: https:",
  // next/font self-hosts; data: covers inline font fallbacks.
  "font-src 'self' data:",
  // Supabase REST + Realtime, plus dev WS for HMR.
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co${
    isDev ? " ws://localhost:* http://localhost:*" : ""
  }`,
  // We never embed third-party iframes; reinforces X-Frame-Options.
  "frame-ancestors 'none'",
  // Forms post only to self or MercadoPago checkout.
  "form-action 'self' https://*.mercadopago.com https://*.mercadopago.com.uy",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: cspDirectives },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
