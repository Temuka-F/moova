'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const cities = [
  {
    name: 'Tbilisi',
    cars: 245,
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Batumi',
    cars: 128,
    image: 'https://images.unsplash.com/photo-1563284223-333497472e88?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Kutaisi',
    cars: 67,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Gudauri',
    cars: 45,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop',
  },
]

export function PopularCitiesSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 md:mb-4">
              Popular destinations
            </h2>
            <p className="text-base md:text-lg text-white/70">
              Explore cars available in Georgia&apos;s top cities
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex text-white hover:text-white hover:bg-white/10">
            <Link href="/cars">
              View all cities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/cars?city=${city.name}`}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[3/4] md:aspect-[4/5]"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-1">{city.name}</h3>
                <p className="text-sm md:text-base text-white/80">{city.cars} cars</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
            <Link href="/cars">
              View all cities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
