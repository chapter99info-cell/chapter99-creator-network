'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PLATFORM_FEE_RATES } from '@/lib/fees'

const facebookGroupUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_GROUP_URL ??
  'https://www.facebook.com/groups/chapter99creatornetwork'

interface FloatingThumb {
  id: number
  x: number
  y: number
  rotation: number
}

export function HomePartnerSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [thumbs, setThumbs] = useState<FloatingThumb[]>([])
  const lastSpawnRef = useRef(0)
  const idRef = useRef(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current
    if (!container) return

    const now = Date.now()
    if (now - lastSpawnRef.current < 80) return
    lastSpawnRef.current = now

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotation = Math.random() * 20 - 10
    const id = idRef.current++

    setThumbs((prev) => [...prev.slice(-12), { id, x, y, rotation }])

    setTimeout(() => {
      setThumbs((prev) => prev.filter((t) => t.id !== id))
    }, 1000)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <section className="bg-[#0a0a0a] px-6 py-32">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#111111] px-6 py-24 text-center sm:px-12"
      >
        {thumbs.map((thumb) => (
          <div
            key={thumb.id}
            className="pointer-events-none absolute h-16 w-20 animate-thumb-fade rounded-lg bg-[#1a1a1a] border border-[#222222]"
            style={{
              left: thumb.x - 40,
              top: thumb.y - 32,
              transform: `rotate(${thumb.rotation}deg)`,
            }}
          />
        ))}

        <h2 className="font-heading text-5xl font-semibold leading-tight text-white md:text-8xl">
          ร่วมเป็น
          <br />
          ส่วนหนึ่งของ
          <br />
          <span className="text-[#1B6CA8]">Creator Network</span>
        </h2>

        <p className="mx-auto mt-6 max-w-md text-sm text-[#555555]">
          ช่างภาพไทยมืออาชีพในออสเตรเลีย
          <br />
          Platform fee แค่ {PLATFORM_FEE_RATES.photographer_creator}% · Escrow ทุกงาน
        </p>

        <Link
          href="/join"
          className="mt-10 inline-block rounded-full bg-[#1B6CA8] px-10 py-4 text-sm font-medium text-[#111111] transition-colors hover:bg-[#1B6CA8]/90"
          style={{ boxShadow: '0 0 60px rgba(232,168,56,0.4)' }}
        >
          สมัครช่างภาพเลย
        </Link>

        <p className="mt-4 text-xs text-[#555555]">
          หรือเข้าร่วม →{' '}
          <a
            href={facebookGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1B6CA8] hover:underline"
          >
            Thai-Aus Verified Community
          </a>
        </p>
      </div>
    </section>
  )
}
