'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StarRating } from '@/components/StarRating'
import { Button } from '@/components/ui/Button'

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId as string
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/bookings/' + bookingId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: { rating, comment } }),
      })
      if (!res.ok) throw new Error('Review failed')
      router.push('/client')
    } catch {
      alert('ส่งรีวิวไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="font-heading text-2xl font-bold text-white">เขียนรีวิว</h1>
      <p className="mt-1 text-sm text-gray-500">แบ่งปันประสบการณ์ของคุณ</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block text-sm text-gray-400">คะแนน</label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">ความคิดเห็น</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2.5 text-white"
            placeholder="เล่าประสบการณ์ของคุณ..."
          />
        </div>
        <Button type="submit" className="w-full" isLoading={loading}>
          ส่งรีวิว
        </Button>
      </form>
    </div>
  )
}
