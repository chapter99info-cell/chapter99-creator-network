export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

const schema = z.object({
  reporter_email: z.string().email(),
  reported_profile_id: z.string().uuid(),
  description: z.string().min(10),
  evidence_url: z.string().url().optional().or(z.literal('')),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    const supabase = createServiceClient()
    if (!supabase) return serviceUnavailableResponse()

    const { error } = await supabase.from('reports').insert({
      reporter_email: parsed.data.reporter_email,
      reported_profile_id: parsed.data.reported_profile_id,
      description: parsed.data.description,
      evidence_url: parsed.data.evidence_url || null,
      status: 'open',
    })

    if (error) {
      console.error('[reports]', error.message)
      return NextResponse.json({ error: 'ส่งรายงานไม่สำเร็จ' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
