import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const MAX_INSURANCE_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')
  const folder = formData.get('folder')

  if (!(file instanceof File) || (folder !== 'avatars' && folder !== 'insurance')) {
    return NextResponse.json({ error: 'Invalid upload' }, { status: 400 })
  }

  const maxSize = folder === 'avatars' ? MAX_AVATAR_BYTES : MAX_INSURANCE_BYTES
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'ไฟล์ใหญ่เกินไป' }, { status: 400 })
  }

  if (folder === 'insurance' && file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Insurance ต้องเป็น PDF' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  const serviceClient = createServiceClient()
  console.log('SERVICE_KEY_EXISTS:', !!process.env.SUPABASE_SERVICE_ROLE_KEY, 'LENGTH:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length)
  if (!serviceClient) return serviceUnavailableResponse()
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await serviceClient.storage
    .from('documents')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  return NextResponse.json({ url: path })
}
