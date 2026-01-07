'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Car, 
  CreditCard, 
  Shield, 
  Calendar, 
  MessageCircle,
  ChevronRight,
  HelpCircle,
  Phone,
  Mail
} from 'lucide-react'

const categories = [
  {
    icon: Car,
    title: 'Booking a Car',
    description: 'How to search, book, and pick up your rental',
    articles: [
      { title: 'How to book a car', href: '/help/booking' },
      { title: 'Cancellation policy', href: '/help/cancellation' },
      { title: 'Modifying a booking', href: '/help/modify-booking' },
      { title: 'Pick-up and drop-off', href: '/help/pickup' },
    ]
  },
  {
    icon: CreditCard,
    title: 'Payments & Pricing',
    description: 'Payment methods, deposits, and refunds',
    articles: [
      { title: 'How payments work', href: '/help/payments' },
      { title: 'Security deposits', href: '/help/deposits' },
      { title: 'Getting a refund', href: '/help/refunds' },
      { title: 'Price breakdown', href: '/help/pricing' },
    ]
  },
  {
    icon: Shield,
    title: 'Insurance & Safety',
    description: 'Coverage details and safety guidelines',
    articles: [
      { title: 'Insurance coverage', href: '/help/insurance' },
      { title: 'What to do in an accident', href: '/help/accident' },
      { title: 'Roadside assistance', href: '/help/roadside' },
      { title: 'Safety guidelines', href: '/help/safety-tips' },
    ]
  },
  {
    icon: Calendar,
    title: 'Hosting on Moova',
    description: 'List your car and start earning',
    articles: [
      { title: 'How to list your car', href: '/help/list-car' },
      { title: 'Pricing your car', href: '/help/host-pricing' },
      { title: 'Managing bookings', href: '/help/host-bookings' },
      { title: 'Getting paid', href: '/help/host-payments' },
    ]
  },
]

const popularQuestions = [
  { q: 'How do I cancel a booking?', a: 'You can cancel a booking from your Dashboard. Go to My Bookings, select the booking, and click Cancel. Refund amounts depend on when you cancel.' },
  { q: 'What documents do I need to rent?', a: 'You need a valid driver\'s license (international or Georgian), a government-issued ID, and a credit/debit card for the security deposit.' },
  { q: 'Is insurance included?', a: 'Yes! Every trip on Moova includes comprehensive insurance coverage. This protects both renters and hosts during the rental period.' },
  { q: 'How does Instant Book work?', a: 'Cars with Instant Book can be booked immediately without host approval. Just select your dates, pay, and you\'re confirmed!' },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      {/* Hero */}
      <div className="bg-secondary text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Search our help center or browse categories below
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-full bg-white text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article.title}>
                      <Link 
                        href={article.href}
                        className="flex items-center justify-between py-2 text-sm hover:text-primary transition-colors"
                      >
                        {article.title}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl space-y-4">
            {popularQuestions.map((faq, index) => (
              <div 
                key={index}
                className="border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                >
                  {faq.q}
                  <ChevronRight className={`w-5 h-5 transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-muted-foreground">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Our support team is available 24/7 to assist you with any questions
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="rounded-full">
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full">
              <a href="tel:+995555000000">
                <Phone className="w-4 h-4 mr-2" />
                +995 555 000 000
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
