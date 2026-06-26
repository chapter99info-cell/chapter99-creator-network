import { LandingButton } from '@/components/landing/Button'

export function BottomNav() {
  return (
    <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-white px-8 py-2 shadow-btn-pill">
      <span className="font-mondwest text-2xl font-semibold text-ink">T</span>
      <LandingButton href="/register" className="!px-5 !py-2 text-sm">
        เข้าร่วมฟรี
      </LandingButton>
    </nav>
  )
}
