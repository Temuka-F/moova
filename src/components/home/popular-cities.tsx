'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const cities = [
  {
    name: 'Tbilisi',
    description: 'Capital city vibes',
    cars: 245,
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Batumi',
    description: 'Black Sea paradise',
    cars: 128,
    image: 'https://images.unsplash.com/photo-1568890330481-76a8cae3dc28?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Kutaisi',
    description: 'Western gem',
    cars: 76,
    image: 'https://images.unsplash.com/photo-1597220659095-780e73b6e8aa?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Kazbegi',
    description: 'Mountain adventures',
    cars: 34,
    image: 'https://images.unsplash.com/photo-1581680322560-a4ff3f2a8d7e?q=80&w=800&auto=format&fit=crop',
  },
]

export function PopularCitiesSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Popular Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Explore Georgia
            </h2>
          </div>
          <Link 
            href="/cars"
            className="group flex items-center gap-2 text-primary font-medium hover:underline"
          >
            View all locations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city, index) => (
            <Link
              key={city.name}
              href={`/cars?city=${city.name}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${city.image}')` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-white/70 text-sm">{city.description}</span>
                <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                <span className="text-white/80 text-sm">{city.cars}+ cars available</span>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
