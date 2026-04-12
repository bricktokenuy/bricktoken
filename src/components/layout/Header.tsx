'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, User } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { BrandWordmark } from '@/components/BrandLogo'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navigation = [
  { name: 'Propiedades', href: '/propiedades' },
  { name: 'Cómo funciona', href: '/como-funciona' },
  { name: 'Dashboard', href: '/dashboard' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandWordmark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                <User className="h-4 w-4" />
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-slate-900">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-slate-600 hover:text-slate-900')}>
                Iniciar sesión
              </Link>
              <Link href="/auth/registro" className={cn(buttonVariants({ size: 'sm' }), 'bg-blue-600 hover:bg-blue-700 text-white')}>
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden text-slate-600')}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-80 flex flex-col">
            <SheetTitle>
              <BrandWordmark size="sm" />
            </SheetTitle>

            <nav className="mt-10 flex flex-1 flex-col items-center text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Navegación
              </p>
              <div className="mt-4 flex flex-col items-center gap-1 w-full">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="w-full rounded-lg px-4 py-3 text-base font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="my-6 h-px w-16 bg-slate-200" />

              <div className="flex w-full flex-col gap-3 px-4">
                {user ? (
                  <>
                    <div className="text-sm font-medium text-slate-700 py-2">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => { handleLogout(); setOpen(false) }}
                      className="w-full border-slate-200 text-slate-700 h-11"
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full border-slate-200 text-slate-700 h-11')}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/auth/registro"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ size: 'lg' }), 'w-full bg-blue-600 hover:bg-blue-700 text-white h-11')}
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            </nav>

            <div className="border-t border-slate-100 px-4 py-4 text-center">
              <p className="text-xs text-slate-400">info@bricktoken.uy</p>
              <p className="mt-0.5 text-xs text-slate-300">Montevideo, Uruguay</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
