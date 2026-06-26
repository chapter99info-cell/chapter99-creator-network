import {
  UtensilsCrossed,
  Flower2,
  Coffee,
  Heart,
  Camera,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PHOTOGRAPHER_PAYOUT_PERCENT } from '@/lib/fees'

const JOB_PRICING: {
  icon: LucideIcon
  name: string
  rate: number
}[] = [
  { icon: UtensilsCrossed, name: 'F&B & ร้านอาหาร', rate: 150 },
  { icon: Flower2, name: 'Massage & Spa', rate: 150 },
  { icon: Coffee, name: 'คาเฟ่ & ร้านค้า', rate: 150 },
  { icon: Heart, name: 'Wedding', rate: 220 },
  { icon: Camera, name: 'Pre-Wedding', rate: 220 },
  { icon: Users, name: 'Birthday & Events', rate: 180 },
]

export function HomePricingSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-widest text-gray-500">PRICING</p>
          <h2 className="font-heading mt-3 text-4xl text-gray-900">อัตราค่าบริการ</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {JOB_PRICING.map((job) => (
            <div
              key={job.name}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <job.icon className="text-xl text-trust" size={22} strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium text-gray-900">{job.name}</p>
              <p className="font-heading mt-1 text-2xl font-medium text-trust">
                ${job.rate}/hr
              </p>
              <p className="mt-1 text-xs text-gray-500">per hour · min 2hr</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          + Travel fee $50 AUD (นอกเขตเมือง) · Stripe surcharge 1.75% + $0.30 ·
          ช่างภาพได้รับ {PHOTOGRAPHER_PAYOUT_PERCENT}% ของราคาทุกงาน
        </p>
      </div>
    </section>
  )
}
