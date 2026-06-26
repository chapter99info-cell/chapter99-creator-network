'use client'

import Link from 'next/link'
import { inViewClass, inViewStyle, useInViewAnimation } from '@/hooks/useInViewAnimation'
import { SITE_TAGLINE } from '@/lib/community-constants'

const HERO_VIDEO_URL =
  'https://jjbwiriphyxsnrnpoqnn.supabase.co/storage/v1/object/public/VDO/VDO/0626%20(1).mp4'

const btnMotion =
  'inline-flex rounded-full px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'

export function HeroSection() {
  const { ref, inView } = useInViewAnimation()

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-gray-100 px-6 py-16 md:py-24">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={HERO_VIDEO_URL}
      />
      <div className="absolute inset-0 z-10 bg-black/50" aria-hidden />

      <div className="relative z-20 mx-auto max-w-4xl text-center">
        <p
          className={`inline-flex rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-sm font-medium text-white ${inViewClass(inView, 0.1)}`}
          style={inViewStyle(0.1)}
        >
          {SITE_TAGLINE}
        </p>

        <h1
          className={`mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl ${inViewClass(inView, 0.2)}`}
          style={inViewStyle(0.2)}
        >
          ชุมชนคนไทยในออสเตรเลีย
          <span className="mt-2 block font-mondwest text-white">ปลอดภัย · Verified · Trusted</span>
        </h1>

        <p
          className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg ${inViewClass(inView, 0.3)}`}
          style={inViewStyle(0.3)}
        >
          Digital Yellow Pages สำหรับธุรกิจไทย — ทุกรายชื่อต้องยืนยัน ABN ก่อนแสดงผล
          ไม่มี TFN ไม่มีสแกมเมอร์ มาตรฐานเดียวกันทั้ง 8 รัฐ
        </p>

        <div
          className={`mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 ${inViewClass(inView, 0.4)}`}
          style={inViewStyle(0.4)}
        >
          <Link href="/register" className={`${btnMotion} bg-verified hover:bg-verified/90`}>
            เข้าร่วมฟรี
          </Link>
          <Link
            href="/register/professional"
            className={`${btnMotion} bg-trust hover:bg-trust/90`}
          >
            ลงทะเบียนช่าง/ครีเอเตอร์
          </Link>
          <Link
            href="/subscribe/business"
            className={`${btnMotion} bg-red-600 hover:bg-red-600/90`}
          >
            สมัครโฆษณา $50/เดือน
          </Link>
        </div>

        <div
          className={`mt-14 grid grid-cols-2 gap-6 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur md:grid-cols-4 ${inViewClass(inView, 0.5)}`}
          style={inViewStyle(0.5)}
        >
          {[
            { value: '10+', label: 'อาชีพ' },
            { value: '8', label: 'รัฐ' },
            { value: 'ABN', label: 'Verified' },
            { value: 'Stripe', label: 'Secured' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
