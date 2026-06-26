'use client'

import { useCallback, useRef, useState } from 'react'
import { LandingButton } from '@/components/landing/Button'
import { MARQUEE_IMAGES, PARTNER_AVATAR } from '@/lib/landing-constants'

interface TrailThumb {
  id: number
  x: number
  y: number
  rotation: number
  src: string
}

export function PartnerSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [thumbs, setThumbs] = useState<TrailThumb[]>([])
  const lastSpawn = useRef(0)
  const idCounter = useRef(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now()
    if (now - lastSpawn.current < 80) return
    lastSpawn.current = now

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotation = Math.random() * 20 - 10
    const src = MARQUEE_IMAGES[Math.floor(Math.random() * MARQUEE_IMAGES.length)]
    const id = idCounter.current++

    setThumbs((prev) => [...prev.slice(-12), { id, x, y, rotation, src }])

    setTimeout(() => {
      setThumbs((prev) => prev.filter((t) => t.id !== id))
    }, 1000)
  }, [])

  return (
    <section className="w-full px-6 py-12">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-white py-48 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      >
        {thumbs.map((t) => (
          <img
            key={t.id}
            src={t.src}
            alt=""
            className="pointer-events-none absolute h-24 w-32 animate-thumb-fade rounded-xl object-cover shadow-md md:h-32 md:w-44"
            style={{
              left: t.x - 64,
              top: t.y - 48,
              transform: `rotate(${t.rotation}deg)`,
            }}
          />
        ))}

        <div className="relative z-10 text-center">
          <h2 className="mb-12 font-mondwest text-[48px] font-semibold leading-none text-gray-900 md:text-[64px] lg:text-[80px]">
            เข้าร่วมชุมชน
          </h2>
          <LandingButton href="/register" variant="green" className="gap-3">
            <img
              src={PARTNER_AVATAR}
              alt=""
              className="mr-2 h-10 w-10 rounded-full object-cover"
            />
            ลงทะเบียนฟรีวันนี้
          </LandingButton>
        </div>
      </div>
    </section>
  )
}
