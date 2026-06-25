import {
  UtensilsCrossed,
  Flower2,
  Coffee,
  Heart,
  Camera,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
    <section className="bg-[#0a0a0a] px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-widest text-[#555555]">PRICING</p>
          <h2 className="font-heading mt-3 text-4xl text-white">อัตราค่าบริการ</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {JOB_PRICING.map((job) => (
            <div
              key={job.name}
              className="rounded-2xl border border-[#222222] bg-[#1a1a1a] p-6"
            >
              <job.icon className="text-xl text-[#E8A838]" size={22} strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium text-white">{job.name}</p>
              <p className="font-heading mt-1 text-2xl font-medium text-[#E8A838]">
                ${job.rate}/hr
              </p>
              <p className="mt-1 text-xs text-[#555555]">per hour · min 2hr</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[#555555]">
          + Travel fee $50 AUD (นอกเขตเมือง) · Stripe surcharge 1.75% + $0.30 ·
          ช่างภาพได้รับ 93% ของราคาทุกงาน
        </p>
      </div>
    </section>
  )
}
