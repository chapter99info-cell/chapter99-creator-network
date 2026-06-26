import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LandingButton } from '@/components/landing/Button'

export function LandingFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-6 py-12">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <LandingButton href="/register">เข้าร่วมฟรี</LandingButton>

        <div className="flex items-start gap-6">
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ink" />
          <div className="flex gap-16">
            <nav className="flex flex-col gap-3">
              {[
                { href: '/register/professional', label: 'ลงทะเบียน' },
                { href: '/nsw', label: 'รายชื่อรัฐ' },
                { href: '/terms', label: 'Terms' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base text-ink transition-opacity hover:opacity-70"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav className="flex flex-col gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-ink transition-opacity hover:opacity-70"
              >
                x.com
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-ink transition-opacity hover:opacity-70"
              >
                LinkedIn
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
