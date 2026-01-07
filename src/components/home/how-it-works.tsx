'use client'

import { Search, CalendarCheck, Key, Star } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Find your car',
    description: 'Browse hundreds of cars in your area. Filter by price, type, and features.',
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Book instantly',
    description: 'Choose your dates and book in seconds. No waiting for approval.',
  },
  {
    step: '03',
    icon: Key,
    title: 'Pick up & go',
    description: 'Meet your host, grab the keys, and start your adventure.',
  },
  {
    step: '04',
    icon: Star,
    title: 'Return & review',
    description: 'Drop off the car and share your experience with the community.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            How Moova works
          </h2>
          <p className="text-lg text-muted-foreground">
            Renting a car has never been easier. Four simple steps to get on the road.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary mb-6 relative z-10">
                  <item.icon className="w-10 h-10" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
