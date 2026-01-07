'use client'

import Link from 'next/link'
import { Heart, Star, MapPin, Users, Fuel, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CarCardProps {
  car: {
    id: string
    make: string
    model: string
    year: number
    pricePerDay: number
    city: string
    transmission: string
    fuelType: string
    seats: number
    rating: number
    reviewCount: number
    image: string
    host: {
      name: string
      avatar: string | null
    }
  }
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-border card-hover">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full shadow-lg"
            onClick={(e) => {
              e.preventDefault()
              // Handle favorite
            }}
          >
            <Heart className="w-5 h-5" />
          </Button>

          {/* Rating Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-lg">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold">{car.rating}</span>
            <span className="text-xs text-muted-foreground">({car.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-semibold text-lg">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-muted-foreground">{car.year}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">₾{car.pricePerDay}</p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="font-normal">
              <Users className="w-3 h-3 mr-1" />
              {car.seats} seats
            </Badge>
            <Badge variant="secondary" className="font-normal">
              <Settings2 className="w-3 h-3 mr-1" />
              {car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}
            </Badge>
            <Badge variant="secondary" className="font-normal">
              <Fuel className="w-3 h-3 mr-1" />
              {car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {car.city}
          </div>
        </div>
      </div>
    </Link>
  )
}
