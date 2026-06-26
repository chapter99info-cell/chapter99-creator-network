import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'verified' | 'trust' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 font-semibold',
  secondary: 'border border-gray-200 bg-white text-primary hover:bg-gray-50',
  ghost: 'text-muted hover:text-primary hover:bg-gray-100',
  verified: 'bg-verified text-white hover:bg-verified/90 font-semibold',
  trust: 'bg-trust text-white hover:bg-trust/90 font-semibold',
  danger: 'bg-red-600 text-white hover:bg-red-600/90 font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? 'กำลังโหลด...' : children}
    </button>
  )
)
Button.displayName = 'Button'
