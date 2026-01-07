'use client'

import { Car, Shield, Clock, Wallet, MapPin, Star } from 'lucide-react'

const features = [
  {
    icon: Car,
    title: 'Wide Selection',
    description: 'From economy cars to luxury SUVs — find the perfect vehicle for any occasion.',
    color: 'from-primary to-primary/70',
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Every trip is protected with comprehensive insurance coverage.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Clock,
    title: 'Flexible Rentals',
    description: 'Book by the hour, day, or week. Cancel free up to 24 hours before.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Wallet,
    title: 'Best Prices',
    description: 'Save up to 35% compared to traditional car rentals in Georgia.',
    color: 'from-secondary to-secondary/70',
  },
  {
    icon: MapPin,
    title: 'Convenient Pickup',
    description: 'Meet hosts at convenient locations or have the car delivered to you.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Star,
    title: 'Trusted Community',
    description: 'Read reviews from real travelers and choose hosts with confidence.',
    color: 'from-orange-500 to-orange-600',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Why Moova?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            The Smarter Way to
            <span className="text-gradient"> Rent a Car</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Skip the rental counter. Book unique cars directly from local hosts with just a few taps.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
