import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Users, MapPin } from 'lucide-react'
import { SiteFooter } from '@/components/SiteFooter'
import { AU_STATES, SITE_NAME, SITE_TAGLINE, STATE_FLAGS } from '@/lib/community-constants'

export const metadata: Metadata = {
  title: `${SITE_NAME} | Safe, Verified, Trusted`,
  description: SITE_TAGLINE,
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="font-serif text-lg text-trust">
            {SITE_NAME}
          </Link>
          <nav className="flex gap-4 text-sm text-[#555555]">
            <Link href="/photographers" className="hover:text-trust">
              ช่างภาพ
            </Link>
            <Link href="/terms" className="hover:text-trust">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="px-6 py-20 text-center">
          <p className="mb-4 inline-flex rounded-full border border-trust/40 px-4 py-1.5 text-xs text-trust">
            {SITE_TAGLINE}
          </p>
          <h1 className="font-serif mx-auto max-w-3xl text-4xl leading-tight md:text-5xl">
            ชุมชนคนไทยในออสเตรเลีย ปลอดภัย โปร่งใส ไม่มีสแกมเมอร์
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm text-[#555555]">
            Digital Yellow Pages สำหรับธุรกิจไทยในออสเตรเลีย — ABN Verified
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="rounded-full bg-verified px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-verified/90"
            >
              เข้าร่วมฟรี
            </Link>
            <Link
              href="/register/professional"
              className="rounded-full bg-trust px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-trust/90"
            >
              ลงทะเบียนช่าง/ครีเอเตอร์
            </Link>
            <Link
              href="/subscribe/business"
              className="rounded-full bg-red-600 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600/90"
            >
              สมัครโฆษณาธุรกิจ $50/เดือน
            </Link>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0a0a0a] px-6 py-10">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { value: '10+', label: 'อาชีพ' },
              { value: '8', label: 'รัฐ' },
              { value: 'ABN', label: 'Verified' },
              { value: 'Stripe', label: 'Secured' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl text-trust">{stat.value}</p>
                <p className="mt-1 text-xs text-[#555555]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Verified ABN',
                desc: 'ทุกธุรกิจต้องยืนยัน ABN — ห้ามกรอก TFN',
              },
              {
                icon: Users,
                title: 'ชุมชนคนไทย',
                desc: 'เชื่อมต่อคนไทยในออสเตรเลียอย่างปลอดภัยและโปร่งใส',
              },
              {
                icon: MapPin,
                title: 'ค้นหาตามรัฐ',
                desc: 'ดูรายชื่อผู้ให้บริการที่ verified แล้วในแต่ละรัฐ',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-6"
              >
                <item.icon className="text-trust" size={28} strokeWidth={1.5} />
                <h3 className="mt-4 font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-[#555555]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-2xl text-white">ค้นหาตามรัฐ</h2>
            <p className="mt-2 text-sm text-[#555555]">เลือกรัฐเพื่อดูรายชื่อธุรกิจที่ verified</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {AU_STATES.map((state) => (
                <Link
                  key={state}
                  href={`/${state.toLowerCase()}`}
                  className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5 text-center transition-colors hover:border-trust hover:bg-trust/5"
                >
                  <span className="text-3xl">{STATE_FLAGS[state]}</span>
                  <p className="mt-2 font-medium text-white">{state}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
