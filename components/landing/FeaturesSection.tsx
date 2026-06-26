import { ShieldCheck, Users, MapPin } from 'lucide-react'
import { cardHoverClass } from '@/lib/form-styles'

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified ABN',
    desc: 'ทุกธุรกิจต้องยืนยัน ABN — ห้ามกรอก TFN',
  },
  {
    icon: Users,
    title: 'ชุมชนคนไทย',
    desc: 'เชื่อมต่อคนไทยในออสเตรเลียอย่างปลอดภัยและโปร่งใส',
  },
  {
    icon: MapPin,
    title: 'ค้นหาตามรัฐ',
    desc: 'ดูรายชื่อผู้ให้บริการที่ verified แล้วในแต่ละรัฐ',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {features.map((item) => (
          <div
            key={item.title}
            className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${cardHoverClass}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <item.icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 font-semibold tracking-tight text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
