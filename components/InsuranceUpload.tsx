'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface InsuranceUploadProps {
  photographerId: string
  currentUrl?: string | null
  onUploaded?: (url: string) => void
}

export function InsuranceUpload({ photographerId, currentUrl, onUploaded }: InsuranceUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `insurance/${photographerId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)

      const { error: updateError } = await supabase
        .from('photographers')
        .update({ insurance_coc_url: publicUrl })
        .eq('id', photographerId)

      if (updateError) throw updateError

      onUploaded?.(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">
        อัปโหลดใบรับรอง Public Liability Insurance ($5M–$10M)
      </p>
      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-saffron hover:underline"
        >
          ดูเอกสารปัจจุบัน
        </a>
      )}
      <label className="block">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="insurance-upload"
        />
        <Button
          variant="secondary"
          isLoading={uploading}
          onClick={() => document.getElementById('insurance-upload')?.click()}
          type="button"
        >
          อัปโหลด CoC
        </Button>
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
