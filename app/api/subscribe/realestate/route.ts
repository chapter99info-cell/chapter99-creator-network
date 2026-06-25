import { NextRequest, NextResponse } from 'next/server'
import { createPropertySubscriptionCheckout } from '@/lib/stripe'
import { z } from 'zod'

const schema = z.object({
  facebook_name: z.string().min(2, 'กรุณากรอกชื่อ Facebook'),
  agency_name: z.string().optional(),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const input = parsed.data

    const session = await createPropertySubscriptionCheckout({
      email: input.email,
      facebookName: input.facebook_name,
      agencyName: input.agency_name,
      successUrl: `${appUrl}/subscribe/realestate?success=1`,
      cancelUrl: `${appUrl}/subscribe/realestate?cancelled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
