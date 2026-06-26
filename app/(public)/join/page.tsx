import { Metadata } from 'next'
import Link from 'next/link'
import { JoinHero, JoinRegistrationForm } from '@/components/JoinRegistrationForm'

export const metadata: Metadata = {
  title: 'สมัครช่างภาพ | Thai-Aus Verified Community',
  description:
    'เข้าร่วม Thai-Aus Verified Community — รับงานถ่ายภาพระดับมืออาชีพ ABN และ Insurance required',
}

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-surface">
      <JoinHero />
      <div className="mx-auto max-w-xl px-6 py-12">
        <Link href="/" className="text-sm text-gray-500 hover:text-trust">
          ← กลับหน้าแรก
        </Link>
        <div className="mt-8">
          <JoinRegistrationForm />
        </div>
      </div>
    </main>
  )
}
