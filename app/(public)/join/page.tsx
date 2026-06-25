import { Metadata } from 'next'
import Link from 'next/link'
import { JoinHero, JoinRegistrationForm } from '@/components/JoinRegistrationForm'

export const metadata: Metadata = {
  title: 'สมัครช่างภาพ | Chapter99 Creator Network',
  description:
    'เข้าร่วม Chapter99 Creator Network — รับงานถ่ายภาพระดับมืออาชีพ ABN และ Insurance required',
}

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      <JoinHero />
      <div className="mx-auto max-w-xl px-6 py-12">
        <Link href="/" className="text-sm text-gray-500 hover:text-[#E8A838]">
          ← กลับหน้าแรก
        </Link>
        <div className="mt-8">
          <JoinRegistrationForm />
        </div>
      </div>
    </main>
  )
}
