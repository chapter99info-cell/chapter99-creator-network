import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { AdminPhotographersTable } from '@/components/AdminPhotographersTable'
import type { Photographer } from '@/types'

export default async function AdminPhotographersPage() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const { data } = await supabase
    .from('photographers')
    .select('*')
    .order('created_at', { ascending: false })

  const photographers = (data ?? []) as Photographer[]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900">จัดการช่างภาพ</h1>
      <p className="mt-1 text-sm text-gray-500">{photographers.length} ช่างภาพในระบบ</p>
      <div className="mt-6">
        <AdminPhotographersTable photographers={photographers} />
      </div>
    </div>
  )
}
