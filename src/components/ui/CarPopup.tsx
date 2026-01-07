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
  MapPin
} from 'lucide-react'
import { MapCar } from '@/lib/map-cars'
import Image from 'next/image'
import Link from 'next/link'

interface CarPopupProps {
  car: MapCar | null
  onClose: () => void
}

export function CarPopup({ car, onClose }: CarPopupProps) {
  if (!car) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-end lg:items-center justify-center"
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
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Share & Favorite buttons */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Car image */}
          <div className="relative h-56 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={car.imageUrl}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
              priority
            />
            
            {/* Badges */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {car.isWinterReady && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full shadow-lg">
                  <Snowflake className="w-4 h-4" />
                  <span>Winter Ready</span>
                </div>
              )}
              {car.isInstantBook && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-full shadow-lg">
                  <Zap className="w-4 h-4" />
                  <span>Instant Book</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 lg:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {car.make} {car.model}
                </h2>
                <p className="text-gray-500">{car.year} · {car.category} · {car.transmission}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{car.price}₾</p>
                <p className="text-sm text-gray-500">per day</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 py-4 border-y border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <div>
                  <span className="font-semibold text-gray-900">{car.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({car.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Fuel className="w-5 h-5" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Gauge className="w-5 h-5" />
                <span>{car.transmission}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
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

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin className="w-5 h-5" />
              <span>{car.city}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href={`/cars/${car.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                View Details
              </Link>
              <Link
                href={`/cars/${car.id}?book=true`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors"
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
