import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/StarRating'
import type { Photographer } from '@/types'

interface PhotographerMiniCardProps {
  photographer: Photographer
}

export function PhotographerMiniCard({ photographer }: PhotographerMiniCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface">
        {photographer.avatar_url ? (
          <Image
            src={photographer.avatar_url}
            alt={photographer.full_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-trust">
            {photographer.full_name.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-heading truncate font-semibold text-gray-900">{photographer.full_name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant={photographer.tier === 'pro' ? 'pro' : 'rising_star'} />
          {photographer.is_verified && <Badge variant="verified" />}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating value={Math.round(photographer.average_rating)} readonly size={14} />
          <span className="text-xs text-gray-500">
            {photographer.average_rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
