'use client'

import { LandingButton } from '@/components/landing/Button'
import { inViewClass, inViewStyle, useInViewAnimation } from '@/hooks/useInViewAnimation'

export function PricingSection() {
  const { ref, inView } = useInViewAnimation()

  return (
    <section ref={ref} className="w-full px-6 py-12">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:ml-auto md:grid-cols-2 md:justify-end">
        <article
          className={`rounded-[40px] bg-ink pb-10 pl-10 pr-10 pt-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:pr-24 ${inViewClass(inView, 0.1)}`}
          style={inViewStyle(0.1)}
        >
          <h3 className="text-[22px] font-medium text-[#F6FCFF]">Free Listing</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#E0EBF0]">
            Join the community directory.
            <br />
            ABN verified by admin before going live.
          </p>
          <p className="mt-8 text-2xl text-[#F6FCFF]">$0</p>
          <p className="text-sm text-[#E0EBF0]">Forever free</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LandingButton href="/register">เข้าร่วมฟรี</LandingButton>
            <LandingButton href="/register/professional" variant="secondary">
              ลงทะเบียนโปร
            </LandingButton>
          </div>
        </article>

        <article
          className={`rounded-[40px] bg-white pb-10 pl-10 pr-10 pt-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)] md:pr-24 ${inViewClass(inView, 0.2)}`}
          style={inViewStyle(0.2)}
        >
          <h3 className="text-[22px] font-medium text-ink-deep">Premium Business</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Featured placement in your state.
            <br />
            Stripe subscription, cancel anytime.
          </p>
          <p className="mt-8 text-2xl text-ink-deep">$50</p>
          <p className="text-sm text-ink/70">Monthly</p>
          <div className="mt-6">
            <LandingButton href="/subscribe/business" variant="tertiary">
              สมัครโฆษณา
            </LandingButton>
          </div>
        </article>
      </div>
    </section>
  )
}
