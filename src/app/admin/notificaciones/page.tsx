'use client'

import { useState } from 'react'
import { Mail, Send, Eye, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function AdminNotificacionesPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      setResult({ type: 'error', message: 'Completa el asunto y el mensaje.' })
      return
    }

    setSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({
          type: 'error',
          message: data.error ?? 'Error al enviar notificaciones.',
        })
      } else {
        setResult({
          type: 'success',
          message: `Notificacion enviada a ${data.sent} inversor(es). ${data.failed > 0 ? `${data.failed} fallaron.` : ''}`,
        })
        setSubject('')
        setMessage('')
        setShowPreview(false)
      }
    } catch {
      setResult({
        type: 'error',
        message: 'Error de red. Intenta de nuevo.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
          Comunicaciones
        </p>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Mail className="h-6 w-6 text-blue-600" />
          Notificaciones masivas
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Envia un email a todos los inversores registrados en la plataforma.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Compose */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Componer notificacion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-slate-700">
                Asunto
              </Label>
              <Input
                id="subject"
                placeholder="Ej: Nueva propiedad disponible"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                Mensaje
              </Label>
              <Textarea
                id="message"
                placeholder="Escribe el contenido del email..."
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-slate-200 resize-none"
              />
            </div>

            {result && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  result.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {result.message}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-600"
                onClick={() => setShowPreview(!showPreview)}
                disabled={!subject.trim() && !message.trim()}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSend}
                disabled={sending || !subject.trim() || !message.trim()}
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Enviar a todos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {showPreview && (
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-slate-900">
                  Vista previa
                </CardTitle>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500">
                  Preview
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                {/* Simulated email header */}
                <div className="bg-blue-600 px-6 py-4">
                  <p className="text-white font-bold text-lg">BrickToken</p>
                  <p className="text-blue-200 text-xs uppercase tracking-wider">
                    Inversion inmobiliaria tokenizada
                  </p>
                </div>
                {/* Simulated email body */}
                <div className="bg-white p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {subject || 'Asunto del email'}
                  </h2>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {message || 'El contenido del mensaje aparecera aqui...'}
                  </div>
                </div>
                {/* Simulated email footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                  <p className="text-xs text-slate-400">
                    BrickToken — Inversion inmobiliaria tokenizada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
