'use client'

import Link from 'next/link'
import { inViewClass, inViewStyle, useInViewAnimation } from '@/hooks/useInViewAnimation'
import { LANDING_PROJECTS } from '@/lib/landing-constants'

function ProjectItem({
  name,
  description,
  image,
  href,
}: (typeof LANDING_PROJECTS)[number]) {
  const { ref, inView } = useInViewAnimation()

  return (
    <article ref={ref} className="flex flex-col gap-6">
      <div className={`ml-12 md:ml-28 ${inViewClass(inView, 0.1)}`} style={inViewStyle(0.1)}>
        <Link href={href}>
          <h3 className="font-mondwest text-2xl font-semibold text-primary md:text-3xl">{name}</h3>
        </Link>
        <p className="mt-2 max-w-md text-sm text-muted md:text-base">{description}</p>
      </div>
      <Link
        href={href}
        className={`block overflow-hidden rounded-2xl shadow-lg ${inViewClass(inView, 0.2)}`}
        style={inViewStyle(0.2)}
      >
        <img src={image} alt={name} className="h-auto w-full object-cover" loading="lazy" />
      </Link>
    </article>
  )
}

export function ProjectsSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="flex flex-col gap-16 md:gap-20">
        {LANDING_PROJECTS.map((project) => (
          <ProjectItem key={project.name} {...project} />
        ))}
      </div>
    </section>
  )
}
