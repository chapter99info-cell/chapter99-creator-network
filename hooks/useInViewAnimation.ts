'use client'

import { useEffect, useRef, useState } from 'react'

export function useInViewAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

export function inViewClass(inView: boolean, delay: number) {
  return inView ? 'animate-fade-in-up' : 'opacity-0'
}

export function inViewStyle(delay: number): React.CSSProperties {
  return { animationDelay: `${delay}s` }
}
