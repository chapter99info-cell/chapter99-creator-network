import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/StarRating'
import { Card, CardTitle } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import type { Photographer, Review } from '@/types'
import { MapPin, Car, ExternalLink, Shield, Briefcase, Star, Link2 } from 'lucide-react'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  if (!isSupabaseConfigured()) {
    return { title: 'Photographer Profile' }
  }
  const supabase = await createClient()
  if (!supabase) {
    return { title: 'Photographer Profile' }
  }
  const { data } = await supabase
    .from('photographers')
    .select('full_name')
    .eq('id', params.id)
    .single()
  return {
    title: data
      ? `${data.full_name} | Chapter99 Creator Network`
      : 'Photographer Profile',
  }
}

function isInsuranceVerified(photographer: Photographer): boolean {
  if (!photographer.insurance_coc_url) return false
  if (!photographer.insurance_expiry) return true
  return new Date(photographer.insurance_expiry) > new Date()
}

export default async function PhotographerProfilePage({ params }: Props) {
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
    .eq('is_blacklisted', false)
    .single()

  if (!data) notFound()
  const photographer = data as Photographer

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('photographer_id', params.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const reviews = (reviewsData ?? []) as Review[]
  const insuranceOk = isInsuranceVerified(photographer)

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/photographers"
          className="text-sm text-gray-500 transition-colors hover:text-[#E8A838]"
        >
          ← กลับรายชื่อช่างภาพ
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">
          <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-full border-2 border-[#E8A838]/30 bg-[#1a1a1a] md:mx-0">
            {photographer.avatar_url ? (
              <Image
                src={photographer.avatar_url}
                alt={photographer.full_name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-[#E8A838]">
                {photographer.full_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <h1 className="font-heading text-3xl font-bold text-white">
                {photographer.full_name}
              </h1>
              {photographer.is_verified && <Badge variant="verified" />}
              <Badge variant={photographer.tier === 'pro' ? 'pro' : 'rising_star'} />
              <Badge variant={insuranceOk ? 'insurance_verified' : 'insurance_pending'} />
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">
              <StarRating value={Math.round(photographer.average_rating)} readonly size={20} />
              <span className="text-sm text-gray-400">
                {photographer.average_rating.toFixed(1)} คะแนน
              </span>
            </div>

            {photographer.bio && (
              <p className="mt-4 leading-relaxed text-gray-400">{photographer.bio}</p>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              {photographer.portfolio_url && (
                <a
                  href={photographer.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-[#E8A838]/40 hover:text-[#E8A838]"
                >
                  <ExternalLink size={14} />
                  Portfolio
                </a>
              )}
              {photographer.instagram_url && (
                <a
                  href={photographer.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-[#E8A838]/40 hover:text-[#E8A838]"
                >
                  <Link2 size={14} />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card className="text-center">
            <Briefcase className="mx-auto text-[#E8A838]" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">
              {photographer.total_jobs_completed}
            </p>
            <p className="text-xs text-gray-500">งานสำเร็จ</p>
          </Card>
          <Card className="text-center">
            <Star className="mx-auto text-[#E8A838]" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">
              {photographer.average_rating.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">คะแนนเฉลี่ย</p>
          </Card>
          <Card className="col-span-2 text-center sm:col-span-1">
            <Shield className="mx-auto text-[#E8A838]" size={22} />
            <p className="mt-2 text-sm font-semibold text-white">
              {insuranceOk ? 'Insurance ยืนยันแล้ว' : 'รอตรวจ Insurance'}
            </p>
            <p className="text-xs text-gray-500">Public Liability $5M–$10M</p>
          </Card>
        </div>

        {/* Coverage */}
        <Card className="mt-6">
          <CardTitle>พื้นที่ให้บริการ</CardTitle>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <MapPin size={14} className="text-[#E8A838]" />
              {photographer.suburb_coverage.length > 0
                ? photographer.suburb_coverage.join(', ')
                : 'Melbourne Metro'}
            </span>
            {photographer.has_car && (
              <span className="flex items-center gap-1.5 rounded-full border border-[#E8A838]/30 bg-[#E8A838]/10 px-3 py-1 text-xs text-[#E8A838]">
                <Car size={12} />
                มีรถ — รับงานนอก metro ได้
              </span>
            )}
          </div>
          {photographer.suburb_coverage.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {photographer.suburb_coverage.map((suburb) => (
                <span
                  key={suburb}
                  className="rounded-full border border-white/10 bg-[#111111] px-3 py-1 text-xs text-gray-400"
                >
                  {suburb}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* CTA */}
        <div className="mt-10 text-center md:text-left">
          <Link
            href={`/book/${params.id}`}
            className="inline-block rounded-lg bg-[#E8A838] px-10 py-3.5 text-base font-semibold text-[#111111] transition-colors hover:bg-[#E8A838]/90"
          >
            จองช่างภาพนี้
          </Link>
          <p className="mt-3 text-xs text-gray-600">
            ชำระผ่าน Escrow · แจ้งเตือนอีเมล · รับประกันคุณภาพ
          </p>
        </div>

        {/* Reviews */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="font-heading text-xl font-semibold text-white">
            รีวิวจากลูกค้า
            {reviews.length > 0 && (
              <span className="ml-2 text-base font-normal text-gray-500">
                ({reviews.length})
              </span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">ยังไม่มีรีวิว — เป็นคนแรกที่จองเลย!</p>
          ) : (
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <StarRating value={review.rating} readonly size={16} />
                    <time className="text-xs text-gray-600">
                      {formatDate(review.created_at)}
                    </time>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
