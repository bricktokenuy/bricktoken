import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
          const { error: insertError } = await supabase.from('investors').insert({
            id: user.id,
            email: user.email!,
            full_name: meta?.full_name || user.email!.split('@')[0],
            phone: meta?.phone || null,
            document_type: meta?.document_type || 'CI',
            document_number: meta?.document_number || 'pendiente',
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
