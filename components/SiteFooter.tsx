import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-8 text-center">
      <p className="text-xs text-[#555555]">
        © 2025 Thai-Aus Verified Community | Powered by{' '}
        <Link
          href="https://chapter99solutions.com.au"
          className="text-trust hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chapter99 Solutions
        </Link>
      </p>
    </footer>
  )
}
