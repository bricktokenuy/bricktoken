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
  { name: 'Ventajas', href: '/#ventajas' },
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandWordmark variant="light" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
                <User className="h-4 w-4" />
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white hover:bg-white/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-slate-300 hover:text-white hover:bg-white/10')}>
                Iniciar sesión
              </Link>
              <Link href="/auth/registro" className={cn(buttonVariants({ size: 'sm' }), 'bg-gold hover:bg-gold-dark text-navy font-semibold')}>
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden text-white hover:bg-white/10')}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-80 flex flex-col bg-navy border-white/10">
            <SheetTitle>
              <BrandWordmark size="sm" variant="light" />
            </SheetTitle>

            <nav className="mt-10 flex flex-1 flex-col items-center text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Navegación
              </p>
              <div className="mt-4 flex flex-col items-center gap-1 w-full">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="w-full rounded-lg px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="my-6 h-px w-16 bg-white/10" />

              <div className="flex w-full flex-col gap-3 px-4">
                {user ? (
                  <>
                    <div className="text-sm font-medium text-slate-300 py-2">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => { handleLogout(); setOpen(false) }}
                      className="w-full border-white/20 text-slate-300 hover:bg-white/10 h-11"
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full border-white/20 text-slate-300 hover:bg-white/10 h-11')}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/auth/registro"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ size: 'lg' }), 'w-full bg-gold hover:bg-gold-dark text-navy font-semibold h-11')}
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            </nav>

            <div className="border-t border-white/10 px-4 py-4 text-center">
              <p className="text-xs text-slate-500">info@bricktoken.uy</p>
              <p className="mt-0.5 text-xs text-slate-600">Montevideo, Uruguay</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
