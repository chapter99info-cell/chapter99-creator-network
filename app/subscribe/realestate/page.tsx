import { Metadata } from 'next'
import { Building2, CheckCircle } from 'lucide-react'
import { RealEstateSubscribeBackLink, RealEstateSubscribeForm } from './SubscribeForm'

export const metadata: Metadata = {
  title: 'สมัครสิทธิ์โพสต์อสังหาฯ | Thai-Aus Verified Community',
  description: 'เอเจนซี่อสังหาริมทรัพย์ — $50 AUD / เดือน',
}

export default function SubscribeRealestatePage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string }
}) {
  if (searchParams.success) {
    return (
      <main className="min-h-screen bg-surface px-6 py-24 text-gray-900">
        <div className="mx-auto max-w-md text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-trust" />
          <h1 className="mt-6 font-serif text-3xl">ชำระเงินสำเร็จ!</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            สิทธิ์โพสต์อสังหาฯของคุณจะเปิดใช้งานภายใน 1–2 นาที
            ระบบจะบันทึกข้อมูลลง property_subscriptions อัตโนมัติ
          </p>
          <div className="mt-8">
            <RealEstateSubscribeBackLink />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface text-gray-900">
      <div className="border-b border-gray-100 bg-white px-6 py-16 text-center">
        <Building2 className="mx-auto h-10 w-10 text-trust" strokeWidth={1.5} />
        <h1 className="mt-4 font-serif text-3xl md:text-4xl">สมัครสิทธิ์โพสต์อสังหาฯ</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
          เอเจนซี่อสังหาริมทรัพย์ — โพสต์ประกาศในกลุ่ม Thai-Aus Verified Community
        </p>
      </div>

      <div className="mx-auto max-w-xl px-6 py-12">
        <RealEstateSubscribeBackLink />

        {searchParams.cancelled && (
          <p className="mt-4 rounded-lg border border-blue-100 bg-trust/10 px-4 py-3 text-sm text-trust">
            ยกเลิกการชำระเงิน — ลองใหม่ได้เมื่อพร้อม
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <RealEstateSubscribeForm />
        </div>
      </div>
    </main>
  )
}
