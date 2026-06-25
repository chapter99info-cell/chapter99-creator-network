/** Shown when Supabase env vars are not set */
export function SupabaseUnavailable() {
  return (
    <div className="rounded-xl border border-[#E8A838]/20 bg-[#1a1a1a] p-8 text-center">
      <p className="text-sm text-[#555555]">
        ระบบฐานข้อมูลยังไม่พร้อม — ตั้งค่า{' '}
        <code className="text-[#E8A838]">NEXT_PUBLIC_SUPABASE_URL</code> และ{' '}
        <code className="text-[#E8A838]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ใน .env.local
      </p>
    </div>
  )
}
