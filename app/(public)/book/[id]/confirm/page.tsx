import { Suspense } from 'react'
import ConfirmContent from './ConfirmContent'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata = {
  title: 'ยืนยันการจอง | Chapter99 Creator Network',
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#111111]">
          <LoadingSpinner size="lg" />
        </main>
      }
    >
      <ConfirmContent />
    </Suspense>
  )
}
