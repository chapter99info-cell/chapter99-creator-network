import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  Award,
  Clock,
  UtensilsCrossed,
  Flower2,
  Coffee,
  Heart,
  Camera,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PhotographerGrid } from '@/components/PhotographerGrid'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { PartnerSection } from '@/components/PartnerSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chapter99 Creator Network — ช่างภาพไทยมืออาชีพในออสเตรเลีย',
  description: 'ABN Verified · Insurance $5M+ · Escrow Protected · Platform fee 7%',
  openGraph: {
    title: 'Chapter99 Creator Network',
    description: 'ช่างภาพไทยมืออาชีพในออสเตรเลีย',
    url: 'https://chapter99creators.com.au',
    locale: 'th_TH',
  },
}

const facebookGroupUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_GROUP_URL ??
  'https://www.facebook.com/groups/chapter99creatornetwork'

const MARQUEE_ROW_1 = [
  'F&B Photography',
  'Wedding',
  'Spa & Massage',
  'Birthday Party',
  'Corporate',
  'Pre-Wedding',
  'Café & Retail',
  'Funeral',
]

const MARQUEE_ROW_2 = [
  'Funeral',
  'Café & Retail',
  'Pre-Wedding',
  'Corporate',
  'Birthday Party',
  'Spa & Massage',
  'Wedding',
  'F&B Photography',
]

const TRUST_BADGES = [
  { icon: ShieldCheck, title: 'ABN Verified', sub: 'ตรวจสอบกับ ABR' },
  { icon: Lock, title: 'Escrow Protected', sub: 'เงินปลอดภัยทุกงาน' },
  { icon: Award, title: 'Insurance $5M', sub: 'Public Liability CoC' },
  { icon: Clock, title: '48hr Delivery', sub: 'RAW files ครบถ้วน' },
]

const PRICING_CARDS: { icon: LucideIcon; name: string; rate: number }[] = [
  { icon: UtensilsCrossed, name: 'F&B & ร้านอาหาร', rate: 150 },
  { icon: Flower2, name: 'Massage & Spa', rate: 150 },
  { icon: Coffee, name: 'คาเฟ่ & ร้านค้า', rate: 150 },
  { icon: Heart, name: 'Wedding', rate: 220 },
  { icon: Camera, name: 'Pre-Wedding', rate: 220 },
  { icon: Users, name: 'Birthday & Events', rate: 180 },
]

function MarqueeRow({ labels }: { labels: string[] }) {
  const items = [...labels, ...labels]
  return (
    <div className="overflow-hidden py-2">
      <div className="animate-marquee-left">
        {items.map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="flex h-48 w-72 shrink-0 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] text-xs text-[#333333]"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function MarqueeRowRight({ labels }: { labels: string[] }) {
  const items = [...labels, ...labels]
  return (
    <div className="mt-4 overflow-hidden py-2">
      <div className="animate-marquee-right">
        {items.map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="flex h-48 w-72 shrink-0 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] text-xs text-[#333333]"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* Section 2 — Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#111111]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <Link href="/" className="font-serif text-lg text-[#E8A838]">
            Chapter99 Creator Network
          </Link>
          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="/photographers"
                className="text-sm text-[#555555] transition-colors hover:text-white"
              >
                ช่างภาพ
              </Link>
              <Link href="/join" className="text-sm text-[#555555] transition-colors hover:text-white">
                สมัคร
              </Link>
              <Link href="/sop" className="text-sm text-[#555555] transition-colors hover:text-white">
                SOP
              </Link>
            </nav>
            <Link
              href="/photographers"
              className="rounded-full bg-[#E8A838] px-5 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#E8A838]/90"
            >
              จองเลย
            </Link>
          </div>
        </div>
      </header>

      {/* Section 3 — Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-32 text-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-[#111111]/75" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[520px]">
          <p className="animate-fade-in-up-hero animation-delay-100 mb-8 inline-flex rounded-full border border-[#E8A838]/40 px-4 py-1.5 font-mono text-xs text-[#E8A838]">
            ABN Verified · Insurance $5M+ · Escrow Protected
          </p>

          <p className="animate-fade-in-up-hero animation-delay-150 mb-4 font-mono text-xs text-[#555555]">
            chapter99creators.com.au
          </p>

          <h1 className="animate-fade-in-up-hero animation-delay-200 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span className="block text-white">ช่างภาพไทย</span>
            <span className="block text-[#E8A838]">มืออาชีพ</span>
            <span className="mt-2 block text-3xl text-[#555555] md:text-4xl">ในออสเตรเลีย</span>
          </h1>

          <div className="animate-fade-in-up-hero animation-delay-300 mt-8 flex flex-col gap-4 text-sm leading-relaxed text-[#555555]">
            <p>
              เราคัดสรรช่างภาพไทยที่มี ABN active และประกันภัย Public Liability $5M–$10M
              ทุกงานคุ้มครองด้วยระบบ Escrow — เงินปลอดภัย จนกว่าคุณจะพอใจกับผลงาน
            </p>
            <p>
              Platform fee แค่ 7% ต่ำที่สุดในตลาด ช่างภาพได้รับ 93% ของทุกงาน
              ไม่มีค่าใช้จ่ายแอบแฝง
            </p>
            <p>งาน F&B เริ่มต้น $300 Wedding เริ่มต้น $440</p>
          </div>

          <div className="animate-fade-in-up-hero animation-delay-400 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/photographers"
              className="saffron-shadow-primary rounded-full bg-[#E8A838] px-7 py-3 text-sm font-medium text-[#111111] transition-colors hover:bg-[#E8A838]/90"
            >
              หาช่างภาพเลย
            </Link>
            <Link
              href="/join"
              className="rounded-full border border-[#333333] bg-transparent px-7 py-3 text-sm text-[#555555] transition-colors hover:border-[#555555] hover:text-white"
            >
              สมัครเป็นช่างภาพ
            </Link>
          </div>

          <div className="animate-fade-in-up-hero animation-delay-500 mt-16 flex flex-wrap justify-center gap-12 border-t border-[#1a1a1a] pt-12">
            {[
              { value: '10+', label: 'ช่างภาพ verified' },
              { value: '7%', label: 'Platform fee เท่านั้น' },
              { value: '48hr', label: 'ส่งไฟล์งานภายใน' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <p className="font-serif text-4xl text-[#E8A838]">{stat.value}</p>
                <p className="mt-2 text-center text-xs text-[#555555]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Marquee */}
      <section className="mb-16 mt-24 w-full overflow-hidden">
        <MarqueeRow labels={MARQUEE_ROW_1} />
        <MarqueeRowRight labels={MARQUEE_ROW_2} />
      </section>

      {/* Section 5 — Trust */}
      <section className="border-y border-[#1a1a1a] bg-[#0a0a0a] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="font-serif text-4xl leading-[1.1] tracking-tight text-white md:text-5xl">
            &ldquo;ทุกงานผ่านการตรวจสอบ
            <br />
            <span className="text-[#E8A838]">ABN</span> และ{' '}
            <span className="text-[#E8A838]">Insurance</span>
            <br />
            ก่อนออกงานเสมอ&rdquo;
          </blockquote>
          <p className="mt-4 text-sm italic text-[#555555]">— Chapter99 Creator Network Standard</p>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.title} className="flex flex-col items-center text-center">
                <badge.icon size={24} className="text-[#E8A838]" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-white">{badge.title}</p>
                <p className="mt-1 text-xs text-[#555555]">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Photographer grid */}
      <PhotographerGrid />

      {/* Section 7 — Pricing */}
      <section className="bg-[#0a0a0a] px-6 py-20">
        <div className="mb-14 text-center">
          <p className="font-mono text-xs tracking-widest text-[#555555]">PRICING</p>
          <h2 className="font-serif mt-3 text-4xl text-white">อัตราค่าบริการ</h2>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3">
          {PRICING_CARDS.map((card, i) => (
            <div
              key={card.name}
              className={`rounded-[32px] p-8 ${
                i % 2 === 0
                  ? 'border border-[#2a2a2a] bg-[#111111]'
                  : 'border border-[#333333] bg-[#1a1a1a]'
              }`}
            >
              <card.icon size={24} className="text-[#E8A838]" strokeWidth={1.5} />
              <p className="mt-4 text-sm font-medium text-white">{card.name}</p>
              <p className="font-serif mt-2 text-3xl text-[#E8A838]">${card.rate}</p>
              <p className="mt-1 text-xs text-[#555555]">/hr · min 2hr</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-lg text-center text-xs text-[#444444]">
          + Travel fee $50 AUD สำหรับงานนอกเขตเมือง · Stripe surcharge 1.75% + $0.30 ·
          ช่างภาพได้รับ 93% ของราคาทุกงาน
        </p>
      </section>

      {/* Section 8 — Testimonials */}
      <TestimonialCarousel />

      {/* Section 9 — Partner */}
      <PartnerSection />

      {/* Section 10 — Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-10">
          <div>
            <p className="font-serif text-xl text-[#E8A838]">Chapter99 Creator Network</p>
            <p className="mt-2 text-xs text-[#555555]">ช่างภาพไทยมืออาชีพในออสเตรเลีย</p>
            <p className="mt-1 text-xs text-[#444444]">chapter99solutions@gmail.com</p>
            <p className="text-xs text-[#444444]">0452044382</p>
          </div>
          <div className="flex gap-16">
            <nav className="flex flex-col gap-3 text-sm text-[#555555]">
              <Link href="/photographers" className="transition-colors hover:text-white">
                ช่างภาพ
              </Link>
              <Link href="/join" className="transition-colors hover:text-white">
                สมัคร
              </Link>
              <Link href="/sop" className="transition-colors hover:text-white">
                SOP
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
            </nav>
            <nav className="flex flex-col gap-3 text-sm text-[#555555]">
              <a
                href={facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                Facebook Group
              </a>
              <a
                href="https://chapter99solutions.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                chapter99solutions.com.au
              </a>
              <span className="text-[#444444]">Instagram</span>
            </nav>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col justify-between gap-2 border-t border-[#1a1a1a] pt-8 text-xs text-[#444444] sm:flex-row">
          <span>© 2025 Chapter99 Solutions · All rights reserved</span>
          <span>Sydney, NSW, Australia</span>
        </div>
      </footer>

      {/* Section 1 — Sticky bottom pill (last element) */}
      <div className="sticky bottom-6 z-50 flex justify-center px-6 pb-6">
        <div
          className="flex items-center gap-4 rounded-full bg-white px-8 py-3"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
        >
          <span className="font-serif text-2xl text-[#111111]">C99</span>
          <Link
            href="/photographers"
            className="saffron-shadow-pill rounded-full bg-[#E8A838] px-6 py-2.5 text-sm font-medium text-[#111111] transition-colors hover:bg-[#E8A838]/90"
          >
            จองช่างภาพ
          </Link>
        </div>
      </div>
    </main>
  )
}
