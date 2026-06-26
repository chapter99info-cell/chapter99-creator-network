import type { Metadata } from 'next'
import { HomeLanding } from '@/components/landing/HomeLanding'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/community-constants'

export const metadata: Metadata = {
  title: `${SITE_NAME} | Safe, Verified, Trusted`,
  description: SITE_TAGLINE,
}

export default function HomePage() {
  return <HomeLanding />
}
