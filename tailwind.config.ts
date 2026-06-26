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
        charcoal: {
          DEFAULT: '#111111',
          light: '#1a1a1a',
          dark: '#0a0a0a',
        },
        ink: {
          DEFAULT: '#051A24',
          deep: '#0D212C',
        },
        muted: '#273C46',
        trust: '#1B6CA8',
        verified: '#16A34A',
        saffron: '#1B6CA8',
      },
      fontFamily: {
        montreal: ['"PP Neue Montreal"', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mondwest: ['"PP Mondwest"', 'var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        heading: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
