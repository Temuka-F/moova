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
      <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-border card-hover">
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
            className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 bg-white/90 hover:bg-white rounded-full shadow-lg"
            onClick={(e) => {
              e.preventDefault()
              // Handle favorite
            }}
          >
            <Heart className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 md:px-2.5 md:py-1 shadow-lg">
            <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-primary text-primary" />
            <span className="text-xs md:text-sm font-semibold">{car.rating}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">({car.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-base md:text-lg truncate">
                {car.make} {car.model}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">{car.year}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base md:text-lg font-bold">₾{car.pricePerDay}</p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
            <Badge variant="secondary" className="font-normal text-xs px-2 py-0.5">
              <Users className="w-3 h-3 mr-1" />
              {car.seats}
            </Badge>
            <Badge variant="secondary" className="font-normal text-xs px-2 py-0.5">
              <Settings2 className="w-3 h-3 mr-1" />
              {car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}
            </Badge>
            <Badge variant="secondary" className="font-normal text-xs px-2 py-0.5 hidden sm:flex">
              <Fuel className="w-3 h-3 mr-1" />
              {car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {car.city}
          </div>
        </div>
      </div>
    </Link>
  )
}
