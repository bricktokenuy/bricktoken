import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidCI } from '@/lib/auth-errors'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if investor record already exists
        const { data: investor } = await supabase
          .from('investors')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!investor) {
          const meta = user.user_metadata
          const documentType = (meta?.document_type as string | undefined) || 'CI'
          const rawDocumentNumber = (meta?.document_number as string | undefined) || ''

          // Server-side CI validation (Uruguay). The client also validates,
          // but never trust the wire — re-check here. If the CI is invalid
          // we still create the investor with `pendiente` so the user can
          // fix it from /dashboard/kyc; otherwise the magic-link flow would
          // brick on a typo.
          let documentNumber = 'pendiente'
          if (rawDocumentNumber) {
            if (documentType === 'CI') {
              documentNumber = isValidCI(rawDocumentNumber)
                ? rawDocumentNumber
                : 'pendiente'
              if (documentNumber === 'pendiente') {
                console.warn(
                  'Invalid Uruguayan CI received in auth callback for user',
                  user.id
                )
              }
            } else {
              documentNumber = rawDocumentNumber
            }
          }

          const { error: insertError } = await supabase.from('investors').insert({
            id: user.id,
            email: user.email!,
            full_name: meta?.full_name || user.email!.split('@')[0],
            phone: meta?.phone || null,
            document_type: documentType,
            document_number: documentNumber,
          })

          if (insertError) {
            console.error('Error creating investor record:', insertError)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`)
}
