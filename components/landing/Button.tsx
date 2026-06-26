import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

interface LandingButtonProps {
  href: string
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
  external?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-white shadow-btn-primary hover:bg-ink/90',
  secondary:
    'bg-white text-ink shadow-btn-secondary hover:bg-slate-50',
  tertiary:
    'bg-white text-ink shadow-btn-secondary hover:bg-slate-50',
}

export function LandingButton({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: LandingButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
