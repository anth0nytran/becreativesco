import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import RoutePrefetcher from '@/components/RoutePrefetcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BE CREATIVES CO. | Creative Portfolio',
  description: 'Merging Professional Expertise with a Modern Edge to Shape Stories That Elevate Your Brand',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-bg text-white antialiased`}>
        <Navigation />
        <RoutePrefetcher />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
