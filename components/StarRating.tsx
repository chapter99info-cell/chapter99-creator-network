'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: number
}

export function StarRating({ value, onChange, readonly, size = 24 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(!readonly && 'cursor-pointer hover:scale-110 transition-transform')}
          aria-label={`${star} ดาว`}
        >
          <Star
            size={size}
            className={cn(
              star <= value ? 'fill-saffron text-saffron' : 'text-gray-600',
              readonly && 'cursor-default'
            )}
          />
        </button>
      ))}
    </div>
  )
}
