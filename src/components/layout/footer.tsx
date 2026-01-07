'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showComingSoon } from '@/lib/toast-helpers'
import { useState } from 'react'
import { toast } from 'sonner'

const footerLinks = {
  explore: [
    { name: 'Browse Cars', href: '/cars' },
    { name: 'Tbilisi', href: '/cars?city=Tbilisi' },
    { name: 'Batumi', href: '/cars?city=Batumi' },
    { name: 'Kutaisi', href: '/cars?city=Kutaisi' },
  ],
  host: [
    { name: 'List Your Car', href: '/list-your-car' },
    { name: 'Host Dashboard', href: '/dashboard' },
    { name: 'Earnings Calculator', href: '/list-your-car' },
    { name: 'Host Resources', href: '/help' },
  ],
  company: [
    { name: 'About Moova', href: '/about' },
    { name: 'How It Works', href: '/cars' },
    { name: 'Safety', href: '/safety' },
    { name: 'Careers', href: '/careers' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
]

export function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  
  // Don't show footer on auth pages or admin pages
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin')) {
    return null
  }

  const handleSubscribe = () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }
    toast.success('Thanks for subscribing!', {
      description: 'You\'ll receive updates about Moova.'
    })
    setEmail('')
  }

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 mb-4 lg:mb-0">
            <Link href="/" className="inline-block text-2xl font-bold mb-4">
              moova
            </Link>
            <p className="text-white/60 mb-6 max-w-xs text-sm">
              The smartest way to rent a car in Georgia. 
              Trusted by thousands of travelers and local hosts.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Stay updated</p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full"
                />
                <Button 
                  size="sm" 
                  className="rounded-full px-4 min-h-[40px]"
                  onClick={handleSubscribe}
                >
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Host */}
          <div>
            <h3 className="font-semibold mb-4">Host</h3>
            <ul className="space-y-3">
              {footerLinks.host.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Moova. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Georgia</span>
              </div>
              <span>English</span>
              <span>₾ GEL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
