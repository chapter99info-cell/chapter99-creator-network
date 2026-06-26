import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-8 text-center">
      <p className="text-xs text-muted">
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
