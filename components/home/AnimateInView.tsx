'use client'

import { type ReactNode } from 'react'
import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { cn } from '@/lib/utils'

interface AnimateInViewProps {
  children: ReactNode
  className?: string
}

export function AnimateInView({ children, className }: AnimateInViewProps) {
  const { ref, inView } = useInViewAnimation()

  return (
    <div
      ref={ref}
      className={cn(inView && 'animate-fade-in-up', !inView && 'opacity-0', className)}
    >
      {children}
    </div>
  )
}
