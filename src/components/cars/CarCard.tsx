'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, Star, MapPin, Users, Fuel, Settings2, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
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
    images: { url: string; isPrimary: boolean }[]
    isInstantBook?: boolean
    owner?: {
      firstName: string
      lastName: string
      avatarUrl?: string | null
      rating?: number
    }
  }
  variant?: 'default' | 'compact' | 'horizontal'
  showOwner?: boolean
}

export function CarCard({ car, variant = 'default', showOwner = false }: CarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const primaryImage = car.images.find(img => img.isPrimary)?.url || car.images[0]?.url || ''
  const images = car.images.map(img => img.url)

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/cars/${car.id}`} className="block group">
        <div className="flex gap-4 bg-card rounded-2xl overflow-hidden border border-border card-hover p-3">
          {/* Image */}
          <div className="relative w-32 h-24 md:w-40 md:h-28 rounded-xl overflow-hidden bg-muted shrink-0">
            <img
              src={images[currentImageIndex] || primaryImage}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
            {car.isInstantBook && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary text-xs px-1.5 py-0.5">
                  <Zap className="w-2.5 h-2.5" />
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 py-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {car.make} {car.model}
                </h3>
                <p className="text-xs text-muted-foreground">{car.year}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold">₾{car.pricePerDay}</p>
                <p className="text-xs text-muted-foreground">/day</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span>{car.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{car.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{car.seats}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/cars/${car.id}`} className="block group">
        <div className="bg-card rounded-xl overflow-hidden border border-border card-hover">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={images[currentImageIndex] || primaryImage}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Price Badge */}
            <div className="absolute bottom-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-lg text-sm font-bold">
              ₾{car.pricePerDay}
            </div>

            {car.isInstantBook && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary text-xs">
                  <Zap className="w-3 h-3" />
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-2.5">
            <h3 className="font-medium text-sm truncate">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span>{car.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">{car.city}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link 
      href={`/cars/${car.id}`} 
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-card rounded-2xl overflow-hidden border border-border card-hover">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={images[currentImageIndex] || primaryImage}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 w-9 h-9 rounded-full shadow-lg transition-all ${
              isFavorited 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/90 hover:bg-white text-foreground'
            }`}
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
          </Button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {car.isInstantBook && (
              <Badge className="bg-primary text-xs shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                Instant
              </Badge>
            )}
          </div>

          {/* Image Navigation - Only show on hover with multiple images */}
          {images.length > 1 && isHovered && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0, 5).map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-lg truncate">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-muted-foreground">{car.year}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium">{car.rating}</span>
              <span className="text-sm text-muted-foreground">({car.reviewCount})</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="secondary" className="font-normal text-xs">
              <Users className="w-3 h-3 mr-1" />
              {car.seats}
            </Badge>
            <Badge variant="secondary" className="font-normal text-xs">
              <Settings2 className="w-3 h-3 mr-1" />
              {car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}
            </Badge>
            <Badge variant="secondary" className="font-normal text-xs">
              <Fuel className="w-3 h-3 mr-1" />
              {car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()}
            </Badge>
          </div>

          {/* Location & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {car.city}
            </div>
            <div className="text-right">
              <span className="text-xl font-bold">₾{car.pricePerDay}</span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
          </div>

          {/* Owner Info */}
          {showOwner && car.owner && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                {car.owner.firstName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {car.owner.firstName} {car.owner.lastName?.charAt(0)}.
                </p>
              </div>
              {car.owner.rating && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span>{car.owner.rating}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
