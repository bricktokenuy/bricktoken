'use client'

import { useState, useEffect } from 'react'
import { Bell, ShoppingCart, TrendingUp, Megaphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NotificationPreferences {
  purchase_confirmed: boolean
  yield_distributed: boolean
  platform_news: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  purchase_confirmed: true,
  yield_distributed: true,
  platform_news: true,
}

const STORAGE_KEY = 'bricktoken_notification_prefs'

function loadPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore parse errors
  }
  return DEFAULT_PREFERENCES
}

function savePreferences(prefs: NotificationPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // ignore storage errors
  }
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
        ${checked ? 'bg-blue-600' : 'bg-slate-200'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg
          ring-0 transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
}

export default function NotificacionesPage() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setPrefs(loadPreferences())
    setMounted(true)
  }, [])

  function updatePref(key: keyof NotificationPreferences, value: boolean) {
    const updated = { ...prefs, [key]: value }
    setPrefs(updated)
    savePreferences(updated)
  }

  const items = [
    {
      key: 'purchase_confirmed' as const,
      icon: ShoppingCart,
      title: 'Compras confirmadas',
      description: 'Recibir un email cada vez que una compra de tokens es confirmada.',
    },
    {
      key: 'yield_distributed' as const,
      icon: TrendingUp,
      title: 'Rendimientos distribuidos',
      description: 'Notificación cuando se distribuyen rendimientos por alquiler.',
    },
    {
      key: 'platform_news' as const,
      icon: Megaphone,
      title: 'Novedades de la plataforma',
      description: 'Nuevas propiedades, actualizaciones y noticias de BrickToken.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-2xl px-4 py-12 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Configuración
          </p>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-600" />
            Notificaciones
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Configurá qué notificaciones por email querés recibir.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Preferencias de email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 mt-0.5">
                    <item.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
                {mounted && (
                  <Toggle
                    checked={prefs[item.key]}
                    onChange={(value) => updatePref(item.key, value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs text-slate-400 text-center">
          Los cambios se guardan automáticamente.
        </p>
      </div>
    </div>
  )
}
