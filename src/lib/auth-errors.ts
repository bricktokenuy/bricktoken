/**
 * Mapper de errores de Supabase Auth a mensajes en español rioplatense.
 * Centraliza el manejo para que la UI no muestre strings en inglés.
 */

const map: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos',
  'Email not confirmed': 'Confirmá tu email antes de iniciar sesión',
  'Email address is invalid': 'El email no es válido',
  'User already registered': 'Ya existe una cuenta con ese email',
  'For security purposes, you can only request this after':
    'Esperá unos segundos antes de pedir otro código',
  'One of email or phone must be set':
    'Tenés que ingresar un email o teléfono',
  'Signups not allowed':
    'El registro no está disponible en este momento',
  'Email rate limit exceeded':
    'Alcanzaste el límite de envíos por hora. Probá de nuevo más tarde',
  'Token has expired or is invalid':
    'El link expiró o no es válido. Pedí uno nuevo',
}

export function translateAuthError(msg: string | undefined | null): string {
  if (!msg) return 'Ocurrió un error inesperado. Probá de nuevo.'

  for (const [en, es] of Object.entries(map)) {
    if (msg.includes(en)) return es
  }

  // fallback regex para "Email address \"...\" is invalid"
  if (/Email address .* is invalid/i.test(msg)) return 'El email no es válido'

  return msg
}

/**
 * Validador de cédula uruguaya (formato 1.234.567-8 o 12345678).
 * Retorna true si el dígito verificador es correcto.
 */
export function isValidCI(ci: string): boolean {
  const clean = ci.replace(/[\s.\-]/g, '')
  if (!/^\d{7,8}$/.test(clean)) return false
  const padded = clean.padStart(8, '0')
  const digits = padded.split('').map(Number)
  const verifier = digits.pop()!
  const weights = [2, 9, 8, 7, 6, 3, 4]
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0)
  const computed = (10 - (sum % 10)) % 10
  return computed === verifier
}
