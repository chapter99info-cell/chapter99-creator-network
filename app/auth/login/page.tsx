import { Suspense } from 'react'
import LoginPage from './LoginForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-charcoal">
          <LoadingSpinner size="lg" />
        </main>
      }
    >
      <LoginPage />
    </Suspense>
  )
}
