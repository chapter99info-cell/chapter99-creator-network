'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'ร้านของเราได้ภาพที่ดีมากครับ ช่างภาพมาตรงเวลา สื่อสารภาษาไทยได้ เข้าใจสิ่งที่ต้องการทันที',
    name: 'คุณแมน',
    role: 'เจ้าของ Thai Garden Restaurant',
    initials: 'M',
  },
  {
    quote:
      'ระบบ Escrow ทำให้มั่นใจมาก จ่ายเงินแล้ว รู้ว่าปลอดภัย ไม่มีเบี้ยว งานออกมาสวยมาก',
    name: 'คุณหนิง',
    role: 'Lotus Spa Sydney',
    initials: 'N',
  },
  {
    quote: 'จองง่ายมาก ได้รูปคุณภาพสูง ใช้โปรโมทร้านบน Google และ Instagram ได้เลย',
    name: 'คุณต้น',
    role: 'Thai Garlic Restaurant',
    initials: 'T',
  },
  {
    quote:
      'ช่างภาพเข้าใจธุรกิจนวดดีมาก รู้ว่าต้องถ่ายอะไร ไม่ต้องอธิบายเยอะ ประหยัดเวลามาก',
    name: 'คุณปลา',
    role: 'Baan Thai Massage',
    initials: 'P',
  },
  {
    quote: 'งานแต่งงานออกมาสวยเกินความคาดหวัง ครอบครัวชอบทุกคน แนะนำ 100%',
    name: 'คุณเอ',
    role: 'งานแต่งงาน Sydney 2025',
    initials: 'A',
  },
]

const LOOP_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]
const CARD_WIDTH = 320
const GAP = 16
const STEP = CARD_WIDTH + GAP

export function TestimonialCarousel() {
  const [index, setIndex] = useState(TESTIMONIALS.length)
  const [paused, setPaused] = useState(false)
  const [animate, setAnimate] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => {
    setAnimate(true)
    setIndex((i) => i + 1)
  }, [])

  const prev = useCallback(() => {
    setAnimate(true)
    setIndex((i) => i - 1)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setAnimate(true)
      setIndex((i) => i + 1)
    }, 3000)
    return () => clearInterval(timer)
  }, [paused])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    track.style.transition = animate
      ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none'
    track.style.transform = `translateX(-${index * STEP}px)`

    if (index >= TESTIMONIALS.length * 2) {
      const resetTimer = setTimeout(() => {
        setAnimate(false)
        setIndex(TESTIMONIALS.length)
      }, 600)
      return () => clearTimeout(resetTimer)
    }

    if (index <= 0) {
      const resetTimer = setTimeout(() => {
        setAnimate(false)
        setIndex(TESTIMONIALS.length)
      }, 600)
      return () => clearTimeout(resetTimer)
    }
  }, [index, animate])

  return (
    <section className="bg-[#111111] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-4xl text-white">
            สิ่งที่<span className="text-[#E8A838]">ลูกค้าพูดถึงเรา</span>
          </h2>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-[#E8A838] text-[#E8A838]" />
            ))}
            <span className="ml-2 text-sm text-[#555555]">Verified Reviews</span>
          </div>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div ref={trackRef} className="flex gap-4">
              {LOOP_ITEMS.map((t, i) => (
                <article
                  key={`${t.name}-${i}`}
                  className="w-80 shrink-0 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6"
                >
                  <span className="font-serif text-5xl leading-none text-[#E8A838]">&ldquo;</span>
                  <p className="text-sm leading-relaxed text-[#888888]">{t.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#333333] text-xs text-[#666666]">
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
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] text-[#555555] transition-colors hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] text-[#555555] transition-colors hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
