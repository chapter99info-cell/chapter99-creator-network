'use client'

import { LandingButton } from '@/components/landing/Button'
import { inViewClass, inViewStyle, useInViewAnimation } from '@/hooks/useInViewAnimation'
import { cardHoverClass } from '@/lib/form-styles'

export function PricingSection() {
  const { ref, inView } = useInViewAnimation()

  return (
    <section ref={ref} className="w-full bg-surface px-6 py-16">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <article
          className={`rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm ${cardHoverClass} ${inViewClass(inView, 0.1)}`}
          style={inViewStyle(0.1)}
        >
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">Free Listing</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Join the community directory.
            <br />
            ABN verified by admin before going live.
          </p>
          <p className="mt-8 text-3xl font-bold text-gray-900">$0</p>
          <p className="text-sm text-gray-500">Forever free</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LandingButton href="/register" variant="green">
              เข้าร่วมฟรี
            </LandingButton>
            <LandingButton href="/register/professional" variant="blue">
              ลงทะเบียนโปร
            </LandingButton>
          </div>
        </article>

        <article
          className={`rounded-2xl bg-gray-900 p-8 text-white shadow-sm ${cardHoverClass} ${inViewClass(inView, 0.2)}`}
          style={inViewStyle(0.2)}
        >
          <h3 className="text-xl font-semibold tracking-tight">Premium Business</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            Featured placement in your state.
            <br />
            Stripe subscription, cancel anytime.
          </p>
          <p className="mt-8 text-3xl font-bold">$50</p>
          <p className="text-sm text-gray-400">Monthly</p>
          <div className="mt-6">
            <LandingButton href="/subscribe/business" variant="red">
              สมัครโฆษณา
            </LandingButton>
          </div>
        </article>
      </div>
    </section>
  )
}
