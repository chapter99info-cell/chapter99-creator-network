import Link from 'next/link'
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react'
import { SiteFooter } from '@/components/SiteFooter'
import { SITE_NAME } from '@/lib/community-constants'
import { BusinessSubscribeForm } from './BusinessSubscribeForm'

export default function BusinessSubscribePage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string }
}) {
  const success = searchParams.success === '1'
  const cancelled = searchParams.cancelled === '1'

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-md px-6 py-12">
        <Link href="/" className="text-sm text-[#555555] hover:text-trust">
          <ArrowLeft className="mr-1 inline h-4 w-4" />
          กลับหน้าแรก
        </Link>

        {success ? (
          <div className="mt-10 rounded-xl border border-verified/30 bg-verified/5 p-8 text-center">
            <CheckCircle className="mx-auto text-verified" size={48} />
            <h1 className="mt-4 font-serif text-2xl">ชำระเงินสำเร็จ!</h1>
            <p className="mt-2 text-sm text-[#555555]">
              สิทธิ์โฆษณาธุรกิจของคุณเปิดใช้งานแล้ว
            </p>
          </div>
        ) : (
          <>
            <Building2 className="mx-auto mt-10 h-10 w-10 text-trust" strokeWidth={1.5} />
            <h1 className="mt-4 text-center font-serif text-3xl">สมัครโฆษณาธุรกิจ</h1>
            <p className="mt-2 text-center text-sm text-[#555555]">
              {SITE_NAME} — $50/เดือน
            </p>
            {cancelled && (
              <p className="mt-4 rounded-lg border border-white/10 px-4 py-3 text-sm text-[#555555]">
                ยกเลิกการชำระเงิน — ลองใหม่ได้เมื่อพร้อม
              </p>
            )}
            <div className="mt-8">
              <BusinessSubscribeForm />
            </div>
          </>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
