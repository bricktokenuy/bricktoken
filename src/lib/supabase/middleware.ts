import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAILS = ['bricktoken.uy@gmail.com']

const PUBLIC_PATHS = ['/', '/propiedades', '/como-funciona', '/auth']
const PROTECTED_PATHS = ['/dashboard', '/api/comprar']
const ADMIN_PATHS = ['/admin', '/api/admin']

function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true
  return PUBLIC_PATHS.some(
    (path) => path !== '/' && (pathname === path || pathname.startsWith(path + '/'))
  )
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes: no auth needed
  if (isPublicRoute(pathname)) {
    return supabaseResponse
  }

  // Admin routes: require auth + admin role
  if (isAdminRoute(pathname)) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    const isAdmin = ADMIN_EMAILS.includes(user.email ?? '')
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/no-autorizado'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  // Protected routes: require auth
  if (isProtectedRoute(pathname)) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  return supabaseResponse
}
