import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse, serviceUnavailableResponse } from '@/lib/supabase/guards'
import { joinRegistrationSchema } from '@/lib/validations'
import { sendJoinConfirmationEmail, sendNewPhotographerAdminEmail } from '@/lib/resend'
import { formatAbn } from '@/lib/abn'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = joinRegistrationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const input = parsed.data
  const serviceClient = createServiceClient()
  if (!serviceClient) return serviceUnavailableResponse()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  let userId: string

  const { data: created, error: createError } = await serviceClient.auth.admin.createUser({
    email: input.email,
    email_confirm: false,
    phone: input.phone.replace(/\s/g, ''),
    user_metadata: { full_name: input.full_name },
  })

  if (createError) {
    if (createError.message.includes('already been registered') || createError.message.includes('already exists')) {
      const { data: listData } = await serviceClient.auth.admin.listUsers({ perPage: 1000 })
      const existing = listData?.users?.find((u) => u.email === input.email)
      if (!existing) {
        return NextResponse.json({ error: 'ไม่สามารถสร้างบัญชีได้' }, { status: 400 })
      }
      userId = existing.id
    } else {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
  } else {
    userId = created.user.id
  }

  const { data: existingProfile } = await serviceClient
    .from('photographers')
    .select('id')
    .eq('id', userId)
    .single()

  if (existingProfile) {
    return NextResponse.json({ error: 'อีเมลนี้สมัครแล้ว — รอการยืนยันหรือ login' }, { status: 409 })
  }

  const { error: insertError } = await serviceClient.from('photographers').insert({
    id: userId,
    full_name: input.full_name,
    phone: input.phone.replace(/\s/g, ''),
    suburb_coverage: input.suburb_coverage,
    has_car: input.has_car,
    abn_number: input.abn_number,
    tier: input.tier,
    instagram_url: input.instagram_url || null,
    portfolio_url: input.portfolio_url || null,
    bio: input.bio || null,
    avatar_url: input.avatar_url || null,
    insurance_coc_url: input.insurance_coc_url,
    insurance_expiry: input.insurance_expiry,
    is_verified: false,
    is_active: true,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  try {
    await sendNewPhotographerAdminEmail({
      fullName: input.full_name,
      abn: formatAbn(input.abn_number),
      tier: input.tier,
      suburbs: input.suburb_coverage,
      insuranceUrl: input.insurance_coc_url,
      adminUrl: `${appUrl}/admin/photographers`,
    })
    await sendJoinConfirmationEmail(input.email, input.full_name)
  } catch (emailError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Join email failed:', emailError)
    }
  }

  return NextResponse.json({ success: true, userId })
}
