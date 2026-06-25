import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse, serviceUnavailableResponse } from '@/lib/supabase/guards'
import { createExpressAccount, createConnectAccountLink } from '@/lib/stripe'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL))

  const { data: photographer } = await supabase
    .from('photographers')
    .select('stripe_account_id, full_name')
    .eq('id', user.id)
    .single()

  if (!photographer) {
    return NextResponse.json({ error: 'Photographer profile not found' }, { status: 404 })
  }

  let accountId = photographer.stripe_account_id

  if (!accountId) {
    const account = await createExpressAccount(user.email!, photographer.full_name)
    accountId = account.id
    await supabase
      .from('photographers')
      .update({ stripe_account_id: accountId })
      .eq('id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const accountLink = await createConnectAccountLink(
    accountId,
    `${appUrl}/api/stripe/connect`,
    `${appUrl}/api/stripe/onboard`
  )

  return NextResponse.redirect(accountLink.url)
}
