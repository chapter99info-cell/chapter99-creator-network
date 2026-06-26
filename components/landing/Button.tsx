import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'green' | 'blue' | 'red'

interface LandingButtonProps {
  href: string
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
  external?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-btn-primary hover:bg-primary/90',
  secondary: 'border border-gray-200 bg-white text-primary shadow-btn-secondary hover:bg-gray-50',
  tertiary: 'border border-gray-200 bg-white text-primary shadow-btn-secondary hover:bg-gray-50',
  green: 'bg-verified text-white hover:bg-verified/90',
  blue: 'bg-trust text-white hover:bg-trust/90',
  red: 'bg-red-600 text-white hover:bg-red-600/90',
}

export function LandingButton({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: LandingButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${variantClasses[variant]} ${className}`

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
