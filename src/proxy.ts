import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Next 16: file convention renamed from `middleware.ts` to `proxy.ts`
// and the exported function from `middleware` to `proxy`. Public API is
// otherwise identical (NextProxy = NextMiddleware).
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
