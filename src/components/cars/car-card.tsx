'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Heart, 
  Star, 
  MapPin, 
  Users, 
  Fuel, 
  Gauge,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatPrice } from '@/lib/flitt'
import type { CarWithOwner } from '@/types'

interface CarCardProps {
  car: CarWithOwner
  showFavoriteButton?: boolean
  onFavoriteToggle?: (carId: string, isFavorited: boolean) => void
  isFavorited?: boolean
}

export function CarCard({ 
  car, 
  showFavoriteButton = true, 
  onFavoriteToggle,
  isFavorited = false 
}: CarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)

  const images = car.images.length > 0 
    ? car.images.sort((a, b) => a.order - b.order)
    : [{ url: '/placeholder-car.jpg', id: 'placeholder', isPrimary: true, order: 0 }]

  const primaryImage = images.find(img => 'isPrimary' in img && img.isPrimary) || images[0]

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
    const newState = !favorited
    setFavorited(newState)
    onFavoriteToggle?.(car.id, newState)
  }

  const transmissionLabel = car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'
  const fuelLabel = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    HYBRID: 'Hybrid',
    ELECTRIC: 'Electric',
    LPG: 'LPG',
  }[car.fuelType]

  return (
    <Link href={`/cars/${car.id}`}>
      <Card 
        className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Main Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${images[currentImageIndex]?.url || primaryImage.url}')` }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {car.isInstantBook && (
              <Badge className="bg-primary/90 backdrop-blur-sm">
                <Zap className="w-3 h-3 mr-1" />
                Instant
              </Badge>
            )}
            {car.category && (
              <Badge variant="secondary" className="backdrop-blur-sm">
                {car.category}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {showFavoriteButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
              onClick={handleFavorite}
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} 
              />
            </Button>
          )}

          {/* Image Navigation */}
          {images.length > 1 && isHovered && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Image Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 5).map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-medium">4.9</span>
              <span className="text-muted-foreground">(24)</span>
            </div>
          </div>

          {/* Year & Location */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span>{car.year}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{car.city}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{car.seats}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              <span>{transmissionLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4" />
              <span>{fuelLabel}</span>
            </div>
          </div>

          {/* Host & Price */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7 border">
                <AvatarImage src={car.owner.avatarUrl || undefined} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {car.owner.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {car.owner.firstName}
              </span>
              {car.owner.verificationStatus === 'VERIFIED' && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                {formatPrice(car.pricePerDay)}
              </span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
