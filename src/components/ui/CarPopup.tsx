"use client"

import { motion, AnimatePresence } from 'motion/react'
import { 
  X, 
  Star, 
  Fuel, 
  Gauge, 
  Snowflake, 
  Zap,
  Calendar,
  ArrowRight,
  Heart,
  Share2,
  MapPin,
  Users,
  CheckCircle2,
  Car
} from 'lucide-react'
import { MapCar } from '@/lib/map-cars'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

interface CarPopupProps {
  car: MapCar | null
  onClose: () => void
}

export function CarPopup({ car, onClose }: CarPopupProps) {
  const { requireAuth } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  if (!car) return null

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${car.make} ${car.model} on Moova`,
        text: `Check out this ${car.make} ${car.model} for ₾${car.price}/day`,
        url: `${window.location.origin}/cars/${car.id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/cars/${car.id}`)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleFavorite = () => {
    if (!requireAuth('save cars')) {
      return
    }
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleBookClick = (e: React.MouseEvent) => {
    if (!requireAuth('book this car')) {
      e.preventDefault()
      return
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-end lg:items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button - 44px minimum touch target */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Share & Favorite buttons - 44px minimum touch targets */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button 
              onClick={handleFavorite}
              className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-95"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Car image with fallback */}
          <div className="relative h-56 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="w-16 h-16 text-gray-300" />
              </div>
            ) : (
              <Image
                src={car.images[currentImageIndex] || car.images[0]}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
                priority
                onError={() => setImageError(true)}
              />
            )}
            
            {/* Image dots if multiple images */}
            {car.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {car.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {car.isWinterReady && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full shadow-lg">
                  <Snowflake className="w-4 h-4" />
                  <span>Winter Ready</span>
                </div>
              )}
              {car.isInstantBook && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-full shadow-lg">
                  <Zap className="w-4 h-4" />
                  <span>Instant</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 lg:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {car.make} {car.model}
                </h2>
                <p className="text-gray-500">{car.year} · {car.color}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{car.price}₾</p>
                <p className="text-sm text-gray-500">per day</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{car.address}</span>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 py-3 border-y border-gray-100 mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-900">{car.rating}</span>
                <span className="text-gray-500 text-sm">({car.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-5 h-5" />
                <span>{car.seats} seats</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Fuel className="w-5 h-5" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Gauge className="w-5 h-5" />
                <span>{car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</span>
              </div>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {car.owner.avatarUrl ? (
                  <Image
                    src={car.owner.avatarUrl}
                    alt={car.owner.firstName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black text-white font-medium text-lg">
                    {car.owner.firstName[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">
                    {car.owner.firstName} {car.owner.lastName[0]}.
                  </p>
                  {car.owner.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{car.owner.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{car.owner.tripsCount} trips</span>
                  <span>·</span>
                  <span>{car.owner.responseTime}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.slice(0, 6).map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {car.features.length > 6 && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-sm rounded-full">
                    +{car.features.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Price info */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl mb-5">
              <div>
                <p className="text-sm text-gray-500">Security deposit</p>
                <p className="font-semibold text-gray-900">{car.securityDeposit}₾</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Mileage limit</p>
                <p className="font-semibold text-gray-900">
                  {car.mileageLimit ? `${car.mileageLimit}km/day` : 'Unlimited'}
                </p>
              </div>
            </div>

            {/* Actions - minimum 44px touch targets */}
            <div className="flex gap-3">
              <Link
                href={`/cars/${car.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 min-h-[48px] bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98]"
              >
                View Details
              </Link>
              <Link
                href={`/cars/${car.id}?book=true`}
                onClick={handleBookClick}
                className="flex-1 flex items-center justify-center gap-2 py-4 min-h-[48px] bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors active:scale-[0.98]"
              >
                <Calendar className="w-5 h-5" />
                Book Now
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
