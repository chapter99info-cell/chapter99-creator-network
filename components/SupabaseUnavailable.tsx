/** Shown when Supabase env vars are not set */
export function SupabaseUnavailable() {
  return (
    <div className="rounded-xl border border-[#1B6CA8]/20 bg-white p-8 text-center">
      <p className="text-sm text-gray-500">
        ระบบฐานข้อมูลยังไม่พร้อม — ตั้งค่า{' '}
        <code className="text-trust">NEXT_PUBLIC_SUPABASE_URL</code> และ{' '}
        <code className="text-trust">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ใน .env.local
      </p>
    </div>
  )
}
