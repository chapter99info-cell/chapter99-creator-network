export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AU_STATES, PROFESSIONAL_JOB_CATEGORIES } from '@/lib/community-constants'
import { normalizeAbn } from '@/lib/abn'
import { createServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  facebook_name: z.string().min(2),
  business_name: z.string().optional(),
  abn_number: z.string().min(11),
  state: z.enum(AU_STATES as unknown as [string, ...string[]]),
  job_category: z.enum(PROFESSIONAL_JOB_CATEGORIES as unknown as [string, ...string[]]),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  external_portfolio_url: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors
      const msg = Object.values(first).flat()[0] ?? 'ข้อมูลไม่ถูกต้อง'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    // Only check length, not checksum (allow test ABNs)
    const abn = normalizeAbn(parsed.data.abn_number)
    if (!abn || abn.replace(/\s/g, '').length !== 11) {
      return NextResponse.json(
        { error: 'ABN ต้องมี 11 หลัก' },
        { status: 400 }
      )
    }

    const insertData = {
      facebook_name: parsed.data.facebook_name,
      business_name: parsed.data.business_name?.trim() || null,
      abn_number: abn,
      state: parsed.data.state,
      job_category: parsed.data.job_category,
      portfolio_url: parsed.data.portfolio_url?.trim() || null,
      facebook_url: parsed.data.facebook_url?.trim() || null,
      instagram_url: parsed.data.instagram_url?.trim() || null,
      external_portfolio_url: parsed.data.external_portfolio_url?.trim() || null,
      is_verified: false,
    }

    try {
      const supabase = createServiceClient()
      if (!supabase) {
        return NextResponse.json({ error: 'DB not configured' }, { status: 503 })
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([insertData])
        .select()

      if (error) {
        console.error('INSERT ERROR:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return NextResponse.json(
          {
            error: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data })
    } catch (err) {
      console.error('CATCH ERROR:', err)
      return NextResponse.json(
        {
          error: String(err),
        },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
