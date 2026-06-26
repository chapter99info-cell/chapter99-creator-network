export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse } from '@/lib/supabase/guards'
import { stripe } from '@/lib/stripe'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL))

  const { data: photographer } = await supabase
    .from('photographers')
    .select('stripe_account_id')
    .eq('id', user.id)
    .single()

  if (photographer?.stripe_account_id) {
    const account = await stripe.accounts.retrieve(photographer.stripe_account_id)
    if (account.details_submitted) {
      await supabase
        .from('photographers')
        .update({ stripe_onboarding_complete: true })
        .eq('id', user.id)
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return NextResponse.redirect(`${appUrl}/photographer?stripe=connected`)
}
