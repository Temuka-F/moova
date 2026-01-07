import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
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
  description: 'The smartest way to rent a car in Georgia. Discover nearby cars, book instantly, and drive within minutes. Premium car sharing made simple.',
  keywords: ['car rental', 'Georgia', 'Tbilisi', 'car sharing', 'rent a car', 'peer to peer', 'instant booking'],
  authors: [{ name: 'Moova' }],
  openGraph: {
    title: 'Moova - Premium Car Sharing in Georgia',
    description: 'Discover nearby cars, book instantly, and drive within minutes',
    url: 'https://moova.ge',
    siteName: 'Moova',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moova - Premium Car Sharing',
    description: 'Discover nearby cars, book instantly, and drive within minutes',
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
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
