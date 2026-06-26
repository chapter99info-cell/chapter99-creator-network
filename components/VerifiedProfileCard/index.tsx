'use client'

import { ExternalLink } from 'lucide-react'
import { maskAbn } from '@/lib/community-constants'
import { cardHoverClass } from '@/lib/form-styles'

export interface VerifiedProfile {
  id: string
  facebook_name: string
  business_name: string | null
  abn_number: string
  state: string
  job_category: string
  portfolio_url: string | null
}

interface VerifiedProfileCardProps {
  profile: VerifiedProfile
  onReport?: (profile: VerifiedProfile) => void
}

function displayName(profile: VerifiedProfile): string {
  return profile.business_name?.trim() || profile.facebook_name
}

function avatarInitial(profile: VerifiedProfile): string {
  const name = displayName(profile)
  return name.charAt(0).toUpperCase() || '?'
}

export function VerifiedProfileCard({ profile, onReport }: VerifiedProfileCardProps) {
  const name = displayName(profile)
  const portfolioUrl = profile.portfolio_url?.trim() || null
  const portfolioLink = portfolioUrl

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-blue-200 ${cardHoverClass}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
              {avatarInitial(profile)}
            </div>
            <div>
              <h2 className="font-semibold tracking-tight text-gray-900">{name}</h2>
              <p className="text-sm text-gray-500">{profile.state}</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            ✓ Verified
          </span>
        </div>

        <span className="mt-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {profile.job_category}
        </span>

        <p className="mt-3 font-mono text-sm text-gray-400">ABN {maskAbn(profile.abn_number)}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {portfolioLink && (
            <a
              href={portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-600"
            >
              ดูผลงาน
              <ExternalLink size={14} />
            </a>
          )}
          <button
            type="button"
            onClick={() => onReport?.(profile)}
            className="text-xs text-red-400 transition-colors hover:text-red-600"
          >
            Report
          </button>
        </div>
      </div>
    </div>
  )
}
