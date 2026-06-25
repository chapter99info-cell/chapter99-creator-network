import { Metadata } from 'next'
import { Building2, CheckCircle } from 'lucide-react'
import { RealEstateSubscribeBackLink, RealEstateSubscribeForm } from './SubscribeForm'

export const metadata: Metadata = {
  title: 'สมัครสิทธิ์โพสต์อสังหาฯ | Chapter99 Creator Network',
  description: 'เอเจนซี่อสังหาริมทรัพย์ — $50 AUD / เดือน',
}

export default function SubscribeRealestatePage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string }
}) {
  if (searchParams.success) {
    return (
      <main className="min-h-screen bg-[#111111] px-6 py-24 text-white">
        <div className="mx-auto max-w-md text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-[#E8A838]" />
          <h1 className="mt-6 font-serif text-3xl">ชำระเงินสำเร็จ!</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#555555]">
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
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-6 py-16 text-center">
        <Building2 className="mx-auto h-10 w-10 text-[#E8A838]" strokeWidth={1.5} />
        <h1 className="mt-4 font-serif text-3xl md:text-4xl">สมัครสิทธิ์โพสต์อสังหาฯ</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#555555]">
          เอเจนซี่อสังหาริมทรัพย์ — โพสต์ประกาศในกลุ่ม Chapter99 Creator Network
        </p>
      </div>

      <div className="mx-auto max-w-xl px-6 py-12">
        <RealEstateSubscribeBackLink />

        {searchParams.cancelled && (
          <p className="mt-4 rounded-lg border border-[#E8A838]/30 bg-[#E8A838]/10 px-4 py-3 text-sm text-[#E8A838]">
            ยกเลิกการชำระเงิน — ลองใหม่ได้เมื่อพร้อม
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-6">
          <RealEstateSubscribeForm />
        </div>
      </div>
    </main>
  )
}
