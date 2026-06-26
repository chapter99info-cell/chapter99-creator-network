'use client'

import Link from 'next/link'
import { maskAbn } from '@/lib/community-constants'

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

function isFacebookUrl(url: string): boolean {
  try {
    return new URL(url).hostname.replace(/^www\./, '').includes('facebook.com')
  } catch {
    return url.includes('facebook.com')
  }
}

export function VerifiedProfileCard({ profile, onReport }: VerifiedProfileCardProps) {
  const name = displayName(profile)
  const portfolioUrl = profile.portfolio_url?.trim() || null
  const facebookUrl = portfolioUrl && isFacebookUrl(portfolioUrl) ? portfolioUrl : null
  const externalPortfolioUrl =
    portfolioUrl && !isFacebookUrl(portfolioUrl) ? portfolioUrl : null

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-trust text-xl font-bold text-white">
            {avatarInitial(profile)}
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              {name}
              <svg
                className="h-5 w-5 text-trust"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Verified"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </h2>
            <p className="text-sm text-gray-400">
              {profile.job_category} • {profile.state}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-verified/30 bg-verified/10 p-3">
          <span className="text-sm font-semibold text-verified">ABN Verified</span>
          <span className="font-mono text-sm text-gray-300">{maskAbn(profile.abn_number)}</span>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <h3 className="mb-3 font-semibold text-white">ช่องทางติดต่อและผลงาน</h3>

        {facebookUrl && (
          <Link
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg bg-gray-800 px-4 py-2 text-center text-white transition-colors hover:bg-gray-700"
          >
            ดูผลงานบน Facebook
          </Link>
        )}

        {externalPortfolioUrl && (
          <Link
            href={externalPortfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg bg-trust px-4 py-2 text-center text-white transition-colors hover:bg-trust/90"
          >
            เข้าชมเว็บไซต์ / แกลเลอรี
          </Link>
        )}

        {!facebookUrl && !externalPortfolioUrl && (
          <p className="text-center text-sm text-gray-500">ยังไม่มีลิงก์ผลงาน</p>
        )}
      </div>

      {/*
        Phase 2: Supabase Storage gallery — uncomment when gallery_images is on profiles
      {profile.gallery_images && profile.gallery_images.length > 0 && (
        <div className="mt-4 border-t border-gray-800 p-6 pt-0">
          <h3 className="mb-3 pt-4 font-semibold text-white">ผลงานล่าสุด (Gallery)</h3>
          <div className="grid grid-cols-2 gap-2">
            {profile.gallery_images.map((imagePath, index) => (
              <div key={index} className="relative h-32 overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galleries/${imagePath}`}
                  alt={`ผลงานชิ้นที่ ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      */}

      <div className="bg-gray-950 p-4 text-center">
        <button
          type="button"
          onClick={() => onReport?.(profile)}
          className="text-xs text-gray-500 underline transition-colors hover:text-red-400"
        >
          แจ้งปัญหา / รายงานผู้ให้บริการ
        </button>
      </div>
    </div>
  )
}
