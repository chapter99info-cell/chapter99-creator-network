const MARQUEE_LABELS = [
  'F&B Photography',
  'Wedding',
  'Pre-Wedding',
  'Massage & Spa',
  'Corporate',
  'Birthday',
  'Cafe & Retail',
  'Portrait',
]

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...MARQUEE_LABELS, ...MARQUEE_LABELS]

  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 gap-4 ${reverse ? 'animate-marquee-right' : 'animate-marquee-left'}`}
      >
        {items.map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="flex h-48 w-72 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white"
          >
            <span className="font-heading text-sm text-trust/50">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HomeMarquee() {
  return (
    <section className="mt-20 space-y-4 overflow-hidden">
      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  )
}
