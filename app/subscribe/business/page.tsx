import Link from 'next/link'
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react'
import { SiteFooter } from '@/components/SiteFooter'
import { SITE_NAME } from '@/lib/community-constants'
import { formCardClass } from '@/lib/form-styles'
import { cn } from '@/lib/utils'
import { BusinessSubscribeForm } from './BusinessSubscribeForm'

export default function BusinessSubscribePage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string }
}) {
  const success = searchParams.success === '1'
  const cancelled = searchParams.cancelled === '1'

  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto max-w-md px-6 py-12">
        <Link href="/" className="text-sm text-gray-500 hover:text-trust">
          <ArrowLeft className="mr-1 inline h-4 w-4" />
          กลับหน้าแรก
        </Link>

        {success ? (
          <div className={cn('mt-10 text-center', formCardClass)}>
            <CheckCircle className="mx-auto text-verified" size={48} />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">ชำระเงินสำเร็จ!</h1>
            <p className="mt-2 text-sm text-gray-500">สิทธิ์โฆษณาธุรกิจของคุณเปิดใช้งานแล้ว</p>
          </div>
        ) : (
          <div className={cn('mt-10', formCardClass)}>
            <Building2 className="mx-auto h-10 w-10 text-trust" strokeWidth={1.5} />
            <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              สมัครโฆษณาธุรกิจ
            </h1>
            <p className="mt-2 text-center text-sm text-gray-500">{SITE_NAME} — $50/เดือน</p>
            {cancelled && (
              <p className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                ยกเลิกการชำระเงิน — ลองใหม่ได้เมื่อพร้อม
              </p>
            )}
            <div className="mt-8">
              <BusinessSubscribeForm />
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
