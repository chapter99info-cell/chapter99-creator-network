'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className={cn(
          'relative w-full max-w-md rounded-xl border border-gray-200 bg-charcoal-light p-6 shadow-xl',
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="font-heading text-lg font-semibold text-gray-900">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-trust"
            aria-label="ปิด"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
