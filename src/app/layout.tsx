import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Moova - Car Rental in Georgia',
    template: '%s | Moova',
  },
  description: 'Rent cars from trusted local hosts in Georgia. Find the perfect car for your trip in Tbilisi, Batumi, Kutaisi, and more.',
  keywords: ['car rental', 'Georgia', 'Tbilisi', 'car sharing', 'rent a car', 'peer to peer'],
  authors: [{ name: 'Moova' }],
  openGraph: {
    title: 'Moova - Car Rental in Georgia',
    description: 'Rent cars from trusted local hosts in Georgia',
    url: 'https://moova.ge',
    siteName: 'Moova',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moova - Car Rental in Georgia',
    description: 'Rent cars from trusted local hosts in Georgia',
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
      <body className={`${plusJakarta.variable} font-sans min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
