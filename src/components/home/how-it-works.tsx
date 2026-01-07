'use client'

import { Search, CalendarCheck, Key, Star } from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: Search,
    title: 'Find Your Car',
    description: 'Browse hundreds of cars in your area. Filter by type, price, features, and availability.',
  },
  {
    step: 2,
    icon: CalendarCheck,
    title: 'Book Instantly',
    description: 'Select your dates, send a booking request, and get confirmed in minutes.',
  },
  {
    step: 3,
    icon: Key,
    title: 'Pick Up & Go',
    description: 'Meet the host, pick up the keys, and start your adventure.',
  },
  {
    step: 4,
    icon: Star,
    title: 'Return & Review',
    description: 'Drop off the car and leave a review to help other travelers.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Rent a Car in
            <span className="text-gradient"> 4 Easy Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're exploring Tbilisi's historic streets or heading to the mountains, getting on the road is simple.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center group">
                {/* Step Number Circle */}
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform z-10 relative mx-auto">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-sm flex items-center justify-center shadow-lg z-20">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
