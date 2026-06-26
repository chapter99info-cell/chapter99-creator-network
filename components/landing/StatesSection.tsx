import Link from 'next/link'
import { AU_STATES, STATE_FLAGS } from '@/lib/community-constants'
import { cardHoverClass } from '@/lib/form-styles'

export function StatesSection() {
  return (
    <section className="border-y border-gray-100 bg-white px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">ค้นหาตามรัฐ</h2>
        <p className="mt-2 text-gray-500">เลือกรัฐเพื่อดูรายชื่อธุรกิจที่ verified</p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {AU_STATES.map((state) => (
            <Link
              key={state}
              href={`/${state.toLowerCase()}`}
              className={`rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm hover:border-blue-300 ${cardHoverClass}`}
            >
              <span className="text-3xl">{STATE_FLAGS[state]}</span>
              <p className="mt-2 font-medium text-gray-900">{state}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
