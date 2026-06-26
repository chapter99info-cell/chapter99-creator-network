import { MARQUEE_IMAGES } from '@/lib/landing-constants'

export function MarqueeSection() {
  const images = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES]

  return (
    <section className="mb-16 mt-16 w-full overflow-hidden md:mt-20" aria-hidden>
      <div className="flex w-max animate-marquee">
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className="mx-3 h-[280px] rounded-2xl object-cover shadow-lg md:h-[500px]"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  )
}
