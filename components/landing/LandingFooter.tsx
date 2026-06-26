import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LandingButton } from '@/components/landing/Button'

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <LandingButton href="/register" variant="green">
          เข้าร่วมฟรี
        </LandingButton>

        <div className="flex items-start gap-6">
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
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
                  className="text-base text-gray-600 transition-colors hover:text-trust"
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
                className="text-base text-gray-600 transition-colors hover:text-trust"
              >
                x.com
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gray-600 transition-colors hover:text-trust"
              >
                LinkedIn
              </a>
            </nav>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1200px] text-center text-sm text-gray-500">
        © 2025 Thai-Aus Verified Community · Powered by Chapter99 Solutions
      </p>
    </footer>
  )
}
