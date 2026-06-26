import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { StarRating } from '@/components/StarRating'
import type { Photographer } from '@/types'

interface PhotographerCardProps {
  photographer: Photographer
}

export function PhotographerCard({ photographer }: PhotographerCardProps) {
  const rating = Math.round(photographer.average_rating)

  return (
    <Card hover className="flex h-full flex-col">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-charcoal">
          {photographer.avatar_url ? (
            <Image
              src={photographer.avatar_url}
              alt={photographer.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-saffron">
              {photographer.full_name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-heading truncate text-lg font-semibold text-gray-900">
            {photographer.full_name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {photographer.tier === 'pro' ? (
              <Badge variant="pro" />
            ) : (
              <Badge variant="rising_star" />
            )}
            {photographer.is_verified && <Badge variant="verified" />}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <StarRating value={rating} readonly size={16} />
        <span className="text-sm text-gray-400">
          {photographer.average_rating.toFixed(1)} · {photographer.total_jobs_completed} งาน
        </span>
      </div>

      {photographer.suburb_coverage.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {photographer.suburb_coverage.slice(0, 4).map((suburb) => (
            <span
              key={suburb}
              className="rounded-full border border-gray-200 bg-charcoal px-2 py-0.5 text-xs text-gray-400"
            >
              {suburb}
            </span>
          ))}
          {photographer.suburb_coverage.length > 4 && (
            <span className="text-xs text-gray-600">
              +{photographer.suburb_coverage.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-5">
        <Link
          href={`/photographers/${photographer.id}`}
          className="block w-full rounded-lg bg-saffron py-2.5 text-center text-sm font-semibold text-charcoal transition-colors hover:bg-saffron/90"
        >
          ดูพอร์ต
        </Link>
      </div>
    </Card>
  )
}
