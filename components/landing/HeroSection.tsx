'use client'

import { LandingButton } from '@/components/landing/Button'
import { inViewClass, inViewStyle, useInViewAnimation } from '@/hooks/useInViewAnimation'
import { SITE_TAGLINE } from '@/lib/community-constants'

export function HeroSection() {
  const { ref, inView } = useInViewAnimation()

  return (
    <section ref={ref} className="mx-auto max-w-[440px] px-6 pt-12 md:pt-16">
      <h1
        className={`mb-4 font-mondwest text-[32px] font-semibold tracking-tight text-ink md:text-[40px] lg:text-[44px] ${inViewClass(inView, 0.1)}`}
        style={inViewStyle(0.1)}
      >
        Thai-Aus
        <span className="block text-trust">Verified</span>
      </h1>

      <p
        className={`mb-2 font-mono text-xs text-ink md:text-sm ${inViewClass(inView, 0.2)}`}
        style={inViewStyle(0.2)}
      >
        {SITE_TAGLINE}
      </p>

      <h2
        className={`text-[32px] font-medium leading-[1.1] tracking-tight text-ink-deep md:text-[40px] lg:text-[44px] ${inViewClass(inView, 0.3)}`}
        style={inViewStyle(0.3)}
      >
        <span className="whitespace-nowrap">
          Find <span className="font-mondwest font-semibold">trusted pros</span>,
        </span>
        <br />
        <span className="whitespace-nowrap">
          the <span className="font-mondwest font-semibold">verified way.</span>
        </span>
      </h2>

      <div
        className={`mt-5 flex flex-col gap-6 text-sm leading-relaxed text-ink md:mt-6 md:text-base ${inViewClass(inView, 0.4)}`}
        style={inViewStyle(0.4)}
      >
        <p>
          Thai-Aus Verified Community is a digital Yellow Pages for Thai-owned businesses
          across Australia — every listing requires a verified ABN. No TFN. No scammers.
        </p>
        <p>
          The platform is deliberately focused on trust. Admin reviews every profile before
          it goes live, with a strike system to keep standards high.
        </p>
        <p>Business premium listings start at $50 per month.</p>
      </div>

      <div
        className={`mt-5 flex flex-col gap-3 sm:flex-row md:mt-6 md:gap-4 ${inViewClass(inView, 0.5)}`}
        style={inViewStyle(0.5)}
      >
        <LandingButton href="/register">เข้าร่วมฟรี</LandingButton>
        <LandingButton href="/nsw" variant="secondary">
          ดูรายชื่อรัฐ
        </LandingButton>
      </div>
    </section>
  )
}
