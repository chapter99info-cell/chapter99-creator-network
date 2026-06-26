'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

const MAX_TOTAL_BYTES = 2 * 1024 * 1024 * 1024 // 2GB
const ACCEPTED_EXT = ['.jpg', '.jpeg', '.png', '.raw', '.cr2', '.arw', '.zip']

interface UploadDeliverablesProps {
  bookingId: string
}

function isAcceptedFile(name: string): boolean {
  const lower = name.toLowerCase()
  return ACCEPTED_EXT.some((ext) => lower.endsWith(ext))
}

export function UploadDeliverables({ bookingId }: UploadDeliverablesProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(files: FileList) {
    const fileArray = Array.from(files)
    const totalSize = fileArray.reduce((sum, f) => sum + f.size, 0)

    if (totalSize > MAX_TOTAL_BYTES) {
      setError('ขนาดไฟล์รวมเกิน 2GB')
      return
    }

    for (const file of fileArray) {
      if (!isAcceptedFile(file.name)) {
        setError(`ไฟล์ไม่รองรับ: ${file.name}`)
        return
      }
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const supabase = createClient()
      const uploadedUrls: string[] = []
      let completed = 0

      for (const file of fileArray) {
        const path = `${bookingId}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('deliverables')
          .upload(path, file, { upsert: false })

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from('deliverables').getPublicUrl(path)
        uploadedUrls.push(publicUrl)

        completed++
        setProgress(Math.round((completed / fileArray.length) * 90))
      }

      const res = await fetch(`/api/bookings/${bookingId}/upload-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_files_url: uploadedUrls.join(',') }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'บันทึกไม่สำเร็จ')

      setProgress(100)
      setDone(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <p className="font-medium text-green-400">อัปโหลดสำเร็จ!</p>
        <p className="mt-2 text-sm text-gray-400">แจ้ง admin แล้ว — รอตรวจสอบไฟล์</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.raw,.cr2,.arw,.zip"
        className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />

      <div
        className="rounded-xl border-2 border-dashed border-white/20 bg-[#1a1a1a] p-8 text-center transition-colors hover:border-[#1B6CA8]/40"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files)
        }}
      >
        <p className="text-sm text-gray-400">
          ลากไฟล์มาวาง หรือเลือกไฟล์
        </p>
        <p className="mt-1 text-xs text-gray-600">
          .jpg .jpeg .png .raw .cr2 .arw .zip — สูงสุด 2GB รวม
        </p>
        <Button
          type="button"
          className="mt-4 bg-[#1B6CA8] text-[#111111]"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          เลือกไฟล์
        </Button>
      </div>

      {uploading && (
        <div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>กำลังอัปโหลด...</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#1B6CA8] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
