import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D1117',
        surface: '#F8F9FA',
        trust: '#1B4FD8',
        verified: '#16A34A',
        saffron: '#1B4FD8',
        muted: '#6B7280',
        ink: {
          DEFAULT: '#0D1117',
          deep: '#0D1117',
        },
        charcoal: {
          DEFAULT: '#F8F9FA',
          light: '#FFFFFF',
          dark: '#E5E7EB',
        },
      },
      fontFamily: {
        montreal: ['"PP Neue Montreal"', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mondwest: ['"PP Mondwest"', 'var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        heading: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
}
export default config
