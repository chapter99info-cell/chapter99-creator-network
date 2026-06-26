'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'ร้านของเราได้ภาพที่ดีมากครับ ช่างภาพมาตรงเวลา มืออาชีพมาก',
    name: 'คุณแมน',
    role: 'เจ้าของ Thai Garden Restaurant',
    initials: 'M',
  },
  {
    quote: 'จองง่าย จ่ายปลอดภัย ได้รูปสวยมาก ใช้โปรโมทร้านได้เลย',
    name: 'คุณหนิง',
    role: 'Lotus Spa Sydney',
    initials: 'N',
  },
  {
    quote: 'ระบบ Escrow ทำให้มั่นใจมาก ไม่ต้องกังวลเรื่องเงิน',
    name: 'คุณต้น',
    role: 'Thai Garlic Restaurant',
    initials: 'T',
  },
  {
    quote: 'ช่างภาพพูดไทยได้ สื่อสารง่าย เข้าใจสิ่งที่ต้องการทันที',
    name: 'คุณปลา',
    role: 'Baan Thai Massage',
    initials: 'P',
  },
  {
    quote: 'งานแต่งงานออกมาสวยมาก เกินความคาดหวัง แนะนำเลย',
    name: 'คุณเอ',
    role: 'งานแต่งงาน Sydney 2025',
    initials: 'A',
  },
]

export function HomeTestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % TESTIMONIALS.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [paused, next])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cardWidth = 320 + 16
    track.style.transform = `translateX(-${index * cardWidth}px)`
  }, [index])

  return (
    <section className="bg-[#111111] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-heading text-3xl text-white">
            สิ่งที่ <span className="text-[#1B6CA8]">ลูกค้าพูดถึงเรา</span>
          </h2>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-[#1B6CA8] text-[#1B6CA8]" />
            ))}
            <span className="ml-2 text-xs text-[#666666]">Verified reviews</span>
          </div>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-4 transition-transform duration-500 ease-out"
            >
              {TESTIMONIALS.map((t) => (
                <article
                  key={t.name}
                  className="w-80 shrink-0 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6"
                >
                  <span className="font-heading text-3xl leading-none text-[#1B6CA8]">&ldquo;</span>
                  <p className="mt-2 text-sm leading-relaxed text-[#888888]">{t.quote}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#333333] text-xs text-[#666666]">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm text-white">{t.name}</p>
                      <p className="text-xs text-[#555555]">{t.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#333333] text-[#666666] transition-colors hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#333333] text-[#666666] transition-colors hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
