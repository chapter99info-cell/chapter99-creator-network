import Link from 'next/link'
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Users,
  Star,
} from 'lucide-react'

const adminNav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/photographers', label: 'Photographers', icon: Users },
  { href: '/admin/payouts', label: 'Payouts', icon: DollarSign },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
]

const photographerNav = [
  { href: '/photographer', label: 'Dashboard', icon: LayoutDashboard },
]

const clientNav = [
  { href: '/client', label: 'My Bookings', icon: Calendar },
]

function NavSection({ items }: { items: typeof adminNav }) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-gray-100 hover:text-primary"
        >
          <item.icon size={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-6 md:block">
        <Link href="/" className="font-heading text-lg font-bold text-trust">
          Thai-Aus Verified
        </Link>
        <p className="mt-1 text-xs text-muted">Dashboard</p>

        <div className="mt-8 space-y-6">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Admin</p>
            <NavSection items={adminNav} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Photographer</p>
            <NavSection items={photographerNav} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Client</p>
            <NavSection items={clientNav} />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 text-primary md:p-8">{children}</main>
    </div>
  )
}
