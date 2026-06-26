'use client'

import { useEffect, useRef, useState } from 'react'
import { Quote } from 'lucide-react'
import { inViewClass, inViewStyle, useInViewAnimation } from '@/hooks/useInViewAnimation'
import { PARALLAX_IMAGE } from '@/lib/landing-constants'

export function TestimonialSection() {
  const { ref, inView } = useInViewAnimation()
  const imageRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = imageRef.current
    if (!el) return

    let raf = 0

    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = 1 - (rect.top + rect.height / 2) / (vh + rect.height)
      const clamped = Math.max(0, Math.min(1, progress))
      setOffset(clamped * 200 - 100)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true })
          update()
        } else {
          window.removeEventListener('scroll', onScroll)
        }
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={ref} className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Quote
          className={`mx-auto mb-6 h-6 w-6 text-slate-900 ${inViewClass(inView, 0.1)}`}
          style={inViewStyle(0.1)}
        />

        <blockquote
          className={`text-[32px] font-medium leading-[1.1] tracking-tight text-gray-900 md:text-[40px] lg:text-[44px] ${inViewClass(inView, 0.2)}`}
          style={inViewStyle(0.2)}
        >
          We built the directory Thai-Australians always needed — with{' '}
          <span className="font-mondwest font-semibold">verified ABN</span> at the core
        </blockquote>

        <p
          className={`mt-6 text-sm italic text-muted ${inViewClass(inView, 0.3)}`}
          style={inViewStyle(0.3)}
        >
          Chapter99 Solutions
        </p>

        <div
          className={`mt-10 flex items-center justify-center gap-10 ${inViewClass(inView, 0.4)}`}
          style={inViewStyle(0.4)}
        >
          {[
            { label: 'ABN', width: 'w-20' },
            { label: 'Stripe', width: 'w-[83px]' },
            { label: '8 States', width: 'w-[110px]' },
          ].map((logo) => (
            <span
              key={logo.label}
              className={`${logo.width} text-center text-2xl font-medium text-slate-900`}
            >
              {logo.label}
            </span>
          ))}
        </div>

        <div
          ref={imageRef}
          className={`mx-auto mt-12 max-w-xs ${inViewClass(inView, 0.5)}`}
          style={{
            ...inViewStyle(0.5),
            transform: `translateY(${offset}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          <img
            src={PARALLAX_IMAGE}
            alt="Thai-Australian community"
            className="w-full rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
