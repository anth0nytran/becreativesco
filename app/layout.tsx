import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import RoutePrefetcher from '@/components/RoutePrefetcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BE CREATIVES CO. | Creative Portfolio',
  description: 'Merging Professional Expertise with a Modern Edge to Shape Stories That Elevate Your Brand',
  icons: {
    icon: [
      {
        url: '/assets/photos/belogo.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
    shortcut: '/assets/photos/belogo.jpg',
    apple: '/assets/photos/belogo.jpg',
  },
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
      <script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="194d87aa-f92a-47ff-9380-d93fcbb1a212"
      />
    </html>
  )
}
