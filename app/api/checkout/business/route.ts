import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createBusinessSubscriptionCheckout } from '@/lib/stripe'
import { AU_STATES } from '@/lib/community-constants'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

const schema = z.object({
  facebook_name: z.string().min(2, 'กรุณากรอกชื่อ Facebook'),
  agency_name: z.string().optional(),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  state: z.enum(AU_STATES as unknown as [string, ...string[]]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors
      const first = Object.values(msg).flat()[0] ?? 'ข้อมูลไม่ถูกต้อง'
      return NextResponse.json({ error: first }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
    }

    const supabase = createServiceClient()
    if (!supabase) return serviceUnavailableResponse()

    const input = parsed.data
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    await supabase.from('property_subscriptions').insert({
      facebook_name: input.facebook_name,
      agency_name: input.agency_name || null,
      email: input.email,
      state: input.state,
      status: 'pending',
    })

    const session = await createBusinessSubscriptionCheckout({
      email: input.email,
      facebookName: input.facebook_name,
      agencyName: input.agency_name,
      state: input.state,
      successUrl: `${appUrl}/subscribe/business?success=1`,
      cancelUrl: `${appUrl}/subscribe/business?cancelled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'Checkout failed'
    const isStripeAuth =
      raw.includes('Invalid API Key') || raw.includes('STRIPE_SECRET_KEY')
    const message = isStripeAuth
      ? 'ระบบชำระเงินยังไม่พร้อม — กรุณาติดต่อ Chapter99 Solutions'
      : raw
    if (isStripeAuth) {
      console.error('[checkout/business] Stripe configuration error')
    } else {
      console.error('[checkout/business]', raw)
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
