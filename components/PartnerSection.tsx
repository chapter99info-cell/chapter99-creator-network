'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

const facebookGroupUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_GROUP_URL ??
  'https://www.facebook.com/groups/chapter99creatornetwork'

const JOB_LABELS = [
  'F&B',
  'Wedding',
  'Spa',
  'Corporate',
  'Birthday',
  'Pre-Wedding',
  'Café',
  'Portrait',
]

interface FloatingThumb {
  id: number
  x: number
  y: number
  rotation: number
  label: string
}

export function PartnerSection() {
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
    const rotation = Math.random() * 16 - 8
    const id = idRef.current++
    const label = JOB_LABELS[Math.floor(Math.random() * JOB_LABELS.length)] ?? 'F&B'

    setThumbs((prev) => [...prev.slice(-14), { id, x, y, rotation, label }])

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
    <section className="bg-[#0a0a0a] px-6 py-12">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-7xl cursor-crosshair overflow-hidden rounded-[40px] bg-[#111111] px-8 py-32 text-center"
      >
        {thumbs.map((thumb) => (
          <div
            key={thumb.id}
            className="animate-thumb-fade pointer-events-none absolute flex h-20 w-32 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-xs text-[#333333]"
            style={{
              left: thumb.x - 64,
              top: thumb.y - 40,
              transform: `rotate(${thumb.rotation}deg)`,
            }}
          >
            {thumb.label}
          </div>
        ))}

        <div className="relative z-10">
          <p className="font-mono text-xs tracking-widest text-[#555555]">JOIN AS PHOTOGRAPHER</p>

          <h2 className="font-serif mt-4 text-6xl leading-tight md:text-8xl">
            <span className="block text-white">ร่วมเป็น</span>
            <span className="block text-[#555555]">ส่วนหนึ่งของ</span>
            <span className="block text-[#E8A838]">Creator</span>
          </h2>

          <p className="mx-auto mt-6 max-w-sm text-sm text-[#555555]">
            ช่างภาพไทยมืออาชีพในออสเตรเลีย
            <br />
            Platform fee แค่ 7% · Escrow ทุกงาน
            <br />
            ABN + Insurance required
          </p>

          <Link
            href="/join"
            className="saffron-shadow-primary mt-10 inline-block rounded-full bg-[#E8A838] px-10 py-4 text-base font-medium text-[#111111] transition-colors hover:bg-[#E8A838]/90"
          >
            สมัครช่างภาพเลย
          </Link>

          <p className="mt-5 text-xs text-[#555555]">
            หรือเข้าร่วม community →{' '}
            <a
              href={facebookGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E8A838] underline"
            >
              Chapter99 Creator Network
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
