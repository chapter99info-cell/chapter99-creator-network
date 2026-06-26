import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Fraunces } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Thai-Aus Verified Community | ชุมชนคนไทยในออสเตรเลีย',
  description:
    'ชุมชนบริการสีขาว คนไทยในออสเตรเลีย | Safe, Verified, Trusted — ABN Verified, Stripe Secured',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Thai-Aus Verified Community',
    description: 'ชุมชนบริการสีขาว คนไทยในออสเตรเลีย | Safe, Verified, Trusted',
    url: 'https://chapter99creators.com.au',
    siteName: 'Thai-Aus Verified Community',
    locale: 'th_AU',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#111111',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${fraunces.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
