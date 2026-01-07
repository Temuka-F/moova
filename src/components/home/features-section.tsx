'use client'

import { Car, Shield, CreditCard, MapPin, Clock, Headphones } from 'lucide-react'

const features = [
  {
    icon: Car,
    title: 'Wide Selection',
    description: 'From economy to luxury, find the perfect car for any occasion.',
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Every trip includes comprehensive insurance coverage.',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Secure payments with multiple options including cards and cash.',
  },
  {
    icon: MapPin,
    title: 'Flexible Pickup',
    description: 'Choose your pickup location or get the car delivered to you.',
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Book instantly and hit the road within minutes.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our team is always available to help you on your journey.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Why choose <span className="text-primary">Moova</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            The easiest way to rent a car in Georgia. No hidden fees, no hassle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-white rounded-2xl p-8 card-hover border border-border"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
