'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Safety', href: '/safety' },
    { name: 'Cancellation', href: '/cancellation' },
    { name: 'Contact', href: '/contact' },
  ],
  hosts: [
    { name: 'List your car', href: '/list-your-car' },
    { name: 'Host resources', href: '/host-resources' },
    { name: 'Insurance', href: '/insurance' },
    { name: 'Calculator', href: '/calculator' },
  ],
  legal: [
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Cookies', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="inline-block text-2xl font-bold mb-3 md:mb-4">
              moova
            </Link>
            <p className="text-white/60 mb-4 md:mb-6 max-w-xs text-sm md:text-base">
              The easiest way to rent a car in Georgia. Trusted by thousands of travelers.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm md:text-base">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Support</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm md:text-base">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hosts */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Hosts</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.hosts.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm md:text-base">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm md:text-base">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-white/60 text-xs md:text-sm">
            © {new Date().getFullYear()} Moova. All rights reserved.
          </p>
          <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-white/60">
            <span>🇬🇪 Georgia</span>
            <span>English</span>
            <span>₾ GEL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
