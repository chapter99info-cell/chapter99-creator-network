import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { StateDirectoryClient } from '@/components/StateDirectoryClient'
import { isValidAuState, normalizeState, SITE_NAME } from '@/lib/community-constants'
import { createServiceClient } from '@/lib/supabase/server'

interface PageProps {
  params: { state: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const state = params.state.toUpperCase()
  if (!isValidAuState(state)) {
    return { title: SITE_NAME }
  }
  return {
    title: `ผู้ให้บริการ ${state} | ${SITE_NAME}`,
    description: `ค้นหาช่างและธุรกิจไทยที่ verified ใน ${state}`,
  }
}

export default async function StateDirectoryPage({ params }: PageProps) {
  const stateParam = params.state.toUpperCase()
  if (!isValidAuState(stateParam)) {
    redirect('/')
  }

  const state = normalizeState(stateParam)
  const supabase = createServiceClient()

  let profiles: {
    id: string
    facebook_name: string
    business_name: string | null
    abn_number: string
    state: string
    job_category: string
    portfolio_url: string | null
  }[] = []

  if (supabase) {
    const { data } = await supabase
      .from('profiles')
      .select('id, facebook_name, business_name, abn_number, state, job_category, portfolio_url')
      .eq('state', state)
      .eq('is_verified', true)
      .eq('is_blacklisted', false)
      .order('created_at', { ascending: false })

    profiles = data ?? []
  }

  return <StateDirectoryClient state={state} profiles={profiles} />
}
