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
      // Check if investor record exists, create if not
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: investor } = await supabase
          .from('investors')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!investor) {
          const meta = user.user_metadata
          await supabase.from('investors').insert({
            id: user.id,
            email: user.email!,
            full_name: meta?.full_name || user.email!.split('@')[0],
            phone: meta?.phone || null,
            document_type: meta?.document_type || 'CI',
            document_number: meta?.document_number || '',
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`)
}
