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
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Popular destinations
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore cars available in Georgia's top cities
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/cars">
              View all cities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/cars?city=${city.name}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] uber-card"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                <p className="text-white/80">{city.cars} cars available</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
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
