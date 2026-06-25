import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { BookingForm } from '@/components/BookingForm'
import type { Photographer } from '@/types'

interface Props {
  params: { id: string }
}

export default async function BookPage({ params }: Props) {
  if (!isSupabaseConfigured()) {
    notFound()
  }

  const supabase = await createClient()
  if (!supabase) {
    notFound()
  }

  const { data } = await supabase
    .from('photographers')
    .select('*')
    .eq('id', params.id)
    .eq('is_verified', true)
    .eq('is_active', true)
    .single()

  if (!data) notFound()
  const photographer = data as Photographer

  return (
    <main className="min-h-screen bg-[#111111] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/photographers/${params.id}`}
          className="text-sm text-gray-500 transition-colors hover:text-[#E8A838]"
        >
          ← กลับโปรไฟล์
        </Link>
        <h1 className="font-heading mt-4 text-2xl font-bold text-white sm:text-3xl">
          จอง {photographer.full_name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">ชำระผ่าน Escrow · ปลอดภัย 100%</p>
        <div className="mt-8">
          <BookingForm photographer={photographer} />
        </div>
      </div>
    </main>
  )
}
