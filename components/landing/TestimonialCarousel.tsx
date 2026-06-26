'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { CAROUSEL_TESTIMONIALS } from '@/lib/landing-constants'

const TRIPLED = [...CAROUSEL_TESTIMONIALS, ...CAROUSEL_TESTIMONIALS, ...CAROUSEL_TESTIMONIALS]
const COUNT = CAROUSEL_TESTIMONIALS.length

function QuoteMark() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden>
      <path
        d="M0 24V14.4C0 6.4 5.6 0 12.8 0L11.2 4.8C6.4 4.8 3.2 8 3.2 12.8H12.8V24H0ZM19.2 24V14.4C19.2 6.4 24.8 0 32 0L30.4 4.8C25.6 4.8 22.4 8 22.4 12.8H32V24H19.2Z"
        fill="#0D212C"
        fillOpacity="0.15"
      />
    </svg>
  )
}

export function TestimonialCarousel() {
  const [index, setIndex] = useState<number>(COUNT)
  const [paused, setPaused] = useState(false)
  const [animating, setAnimating] = useState(true)

  const go = useCallback((dir: -1 | 1) => {
    setAnimating(true)
    setIndex((i) => i + dir)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => go(1), 3000)
    return () => clearInterval(timer)
  }, [paused, go])

  useEffect(() => {
    if (index >= COUNT * 2) {
      const t = setTimeout(() => {
        setAnimating(false)
        setIndex(COUNT)
      }, 800)
      return () => clearTimeout(t)
    }
    if (index < COUNT) {
      const t = setTimeout(() => {
        setAnimating(false)
        setIndex(COUNT * 2 - 1)
      }, 800)
      return () => clearTimeout(t)
    }
    setAnimating(true)
  }, [index])

  return (
    <section className="w-full py-20">
      <div className="mb-10 flex flex-col gap-4 px-6 md:mx-auto md:max-w-4xl md:flex-row md:items-end md:justify-between md:pl-0">
        <h2 className="text-[32px] font-medium leading-[1.1] tracking-tight text-gray-900 md:text-[40px] lg:text-[44px]">
          What <span className="font-mondwest font-semibold">members</span> say
        </h2>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-black text-black" />
          ))}
          <span className="ml-1 text-sm font-medium text-primary">Community 5/5</span>
        </div>
      </div>

      <div
        className="relative overflow-hidden px-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-6"
          style={{
            transform: `translateX(calc(-${index} * (min(100vw - 48px, 427.5px) + 24px)))`,
            transition: animating ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        >
          {TRIPLED.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="w-[calc(100vw-48px)] shrink-0 rounded-[32px] border border-gray-100 bg-gray-50 px-6 py-8 shadow-sm md:w-[427.5px] md:rounded-[40px] md:pl-10 md:pr-24"
            >
              <QuoteMark />
              <p className="mt-4 text-base leading-relaxed text-gray-900">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-muted">
                    → {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl justify-end gap-3 px-0">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-slate-50"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-slate-50"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-900" />
          </button>
        </div>
      </div>
    </section>
  )
}
