import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'verified'
  | 'pro'
  | 'rising_star'
  | 'blacklisted'
  | 'insurance_verified'
  | 'insurance_pending'

interface BadgeProps {
  variant: BadgeVariant
  className?: string
}

const config: Record<BadgeVariant, { label: string; className: string }> = {
  verified: { label: 'ยืนยันแล้ว', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  pro: { label: 'Pro', className: 'bg-saffron/20 text-saffron border-saffron/30' },
  rising_star: { label: 'Rising Star', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  blacklisted: { label: 'ถูกแบน', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  insurance_verified: {
    label: 'Insurance ✓',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  insurance_pending: {
    label: 'Insurance รอตรวจ',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
}

export function Badge({ variant, className }: BadgeProps) {
  const { label, className: variantClass } = config[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClass,
        className
      )}
    >
      {label}
    </span>
  )
}
