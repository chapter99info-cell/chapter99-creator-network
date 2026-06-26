export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AU_STATES, JOB_CATEGORIES } from '@/lib/community-constants'
import { isValidAbn, normalizeAbn } from '@/lib/abn'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

const schema = z.object({
  facebook_name: z.string().min(2),
  business_name: z.string().optional(),
  abn_number: z.string().min(11),
  state: z.enum(AU_STATES as unknown as [string, ...string[]]),
  job_category: z.enum(JOB_CATEGORIES as unknown as [string, ...string[]]),
  portfolio_url: z.string().url().optional().or(z.literal('')),
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

    const abn = normalizeAbn(parsed.data.abn_number)
    if (!isValidAbn(abn)) {
      return NextResponse.json({ error: 'ABN ต้องเป็นตัวเลข 11 หลัก' }, { status: 400 })
    }

    const supabase = createServiceClient()
    if (!supabase) return serviceUnavailableResponse()

    const { error } = await supabase.from('profiles').insert({
      facebook_name: parsed.data.facebook_name,
      business_name: parsed.data.business_name || null,
      abn_number: abn,
      state: parsed.data.state,
      job_category: parsed.data.job_category,
      portfolio_url: parsed.data.portfolio_url || null,
      subscription_status: 'free',
      is_verified: false,
    })

    if (error) {
      console.error('[register]', error.message)
      return NextResponse.json({ error: 'ลงทะเบียนไม่สำเร็จ' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
