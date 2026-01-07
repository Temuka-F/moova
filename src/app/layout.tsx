import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Moova - Premium Car Sharing in Georgia',
    template: '%s | Moova',
  },
  description: 'The smartest way to rent a car in Georgia. Discover nearby cars on the map, book instantly, and drive within minutes.',
  keywords: ['car rental', 'Georgia', 'Tbilisi', 'Gudauri', 'car sharing', 'rent a car', 'peer to peer', 'instant booking', 'winter cars'],
  authors: [{ name: 'Moova' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Moova',
  },
  openGraph: {
    title: 'Moova - Premium Car Sharing in Georgia',
    description: 'Discover nearby cars on the map, book instantly, and drive within minutes',
    url: 'https://moova.ge',
    siteName: 'Moova',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moova - Premium Car Sharing',
    description: 'Discover nearby cars on the map, book instantly, and drive within minutes',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
