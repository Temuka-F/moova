"use client"

import { useEffect, useState } from 'react'
import { Drawer } from 'vaul'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Snowflake, 
  Car, 
  Zap, 
  Star, 
  Clock, 
  ChevronRight,
  Fuel,
  Gauge,
  ArrowRight,
  X,
  Users,
  Sparkles,
  Leaf,
  MapPin
} from 'lucide-react'
import { MapCar, getTopRatedCars } from '@/lib/map-cars'
import Image from 'next/image'
import Link from 'next/link'
import { CarouselSkeleton } from '@/components/ui/CarListSkeleton'

interface CarDrawerProps {
  cars: MapCar[]
  selectedCar: MapCar | null
  onCarSelect: (car: MapCar | null) => void
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
}

// Filter chip data
const FILTER_CHIPS = [
  { id: 'winter', label: 'Winter Ready', icon: Snowflake, color: 'bg-blue-500' },
  { id: 'suv', label: 'SUV', icon: Car, color: 'bg-orange-500' },
  { id: 'luxury', label: 'Luxury', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'hybrid', label: 'Hybrid/EV', icon: Leaf, color: 'bg-green-500' },
  { id: 'instant', label: 'Instant Book', icon: Zap, color: 'bg-emerald-500' },
  { id: 'compact', label: 'Compact', icon: Car, color: 'bg-gray-500' },
  { id: 'sedan', label: 'Sedan', icon: Car, color: 'bg-indigo-500' },
]

// Selected car card component (for 45% snap)
function SelectedCarCard({ 
  car, 
  onClose 
}: { 
  car: MapCar
  onClose: () => void
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative"
    >
      {/* Close button - 44px minimum touch target */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors active:scale-95"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Car image with fallback */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-16 h-16 text-gray-300" />
          </div>
        ) : (
          <Image
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.isWinterReady && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              <Snowflake className="w-3 h-3" />
              <span>Winter Ready</span>
            </div>
          )}
          {car.isInstantBook && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              <Zap className="w-3 h-3" />
              <span>Instant</span>
            </div>
          )}
        </div>

        {/* Image dots if multiple images */}
        {car.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {car.images.slice(0, 4).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Car info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-xl text-gray-900">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-500">{car.year} · {car.color}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl text-gray-900">{car.price}₾</p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{car.address}</span>
        </div>

        {/* Quick specs */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-medium">{car.rating}</span>
            <span className="text-gray-400">({car.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</span>
          </div>
        </div>

        {/* Host preview */}
        <div className="flex items-center gap-3 py-3 border-t border-b border-gray-100 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
            {car.owner.avatarUrl ? (
              <Image
                src={car.owner.avatarUrl}
                alt={car.owner.firstName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black text-white font-medium">
                {car.owner.firstName[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Hosted by {car.owner.firstName}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{car.owner.rating}</span>
              <span>·</span>
              <span>{car.owner.tripsCount} trips</span>
            </div>
          </div>
          {car.owner.isVerified && (
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Verified
            </div>
          )}
        </div>

        {/* Book Now button - 44px minimum touch target */}
        <Link 
          href={`/cars/${car.id}`}
          className="w-full flex items-center justify-center gap-2 py-3.5 min-h-[48px] bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors active:scale-[0.98]"
        >
          <span>View Details & Book</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  )
}

// Car card for carousel
function CarCard({ 
  car, 
  onClick 
}: { 
  car: MapCar
  onClick: () => void 
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Car image with fallback */}
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-12 h-12 text-gray-300" />
          </div>
        ) : (
          <Image
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="256px"
            onError={() => setImageError(true)}
          />
        )}
        
        <div className="absolute top-2 left-2 flex gap-1">
          {car.isWinterReady && (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Snowflake className="w-3 h-3 text-white" />
            </div>
          )}
          {car.isInstantBook && (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Car info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{car.rating}</span>
              <span>·</span>
              <span>{car.city}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-gray-900">{car.price}₾</p>
            <p className="text-xs text-gray-500">/day</p>
          </div>
        </div>

        {/* Quick features */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>{car.seats} seats</span>
          <span>·</span>
          <span>{car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</span>
          <span>·</span>
          <span>{car.fuelType}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Full car list item - compact version
function CarListItem({ 
  car, 
  onClick 
}: { 
  car: MapCar
  onClick: () => void 
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/cars/${car.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
        className="flex items-center gap-3 p-3 min-h-[72px] bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
      >
        {/* Car image with fallback */}
        <div className="relative w-24 h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Car className="w-8 h-8 text-gray-300" />
            </div>
          ) : (
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
              sizes="96px"
              onError={() => setImageError(true)}
            />
          )}
          {car.isWinterReady && (
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <Snowflake className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 truncate">
              {car.make} {car.model}
            </h3>
            {car.isInstantBook && (
              <Zap className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{car.rating}</span>
            <span>·</span>
            <span>{car.year}</span>
            <span>·</span>
            <span>{car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{car.city}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-gray-900">{car.price}₾</p>
          <p className="text-xs text-gray-500">/day</p>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </motion.div>
    </Link>
  )
}

export function CarDrawer({
  cars,
  selectedCar,
  onCarSelect,
  activeFilter,
  onFilterChange,
}: CarDrawerProps) {
  // Determine snap point based on selection
  const [snap, setSnap] = useState<number | string | null>(0.15)

  // Update snap when selectedCar changes
  useEffect(() => {
    if (selectedCar) {
      setSnap(0.45)
    }
  }, [selectedCar])

  // Get top rated cars for carousel
  const topRatedCars = getTopRatedCars(cars, 5)

  return (
    <Drawer.Root
      snapPoints={[0.15, 0.45, 0.96]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col bg-white rounded-t-[24px] outline-none shadow-2xl"
          style={{ 
            height: '96%',
            maxHeight: '96vh',
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
          </div>

          {/* Filter chips - always visible (Snap 1 content) */}
          <div className="px-4 pb-3 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
                  {FILTER_CHIPS.map((chip) => {
                    const Icon = chip.icon
                    const isActive = activeFilter === chip.id
                    return (
                      <button
                        key={chip.id}
                        onClick={() => onFilterChange(isActive ? null : chip.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium
                          whitespace-nowrap transition-all duration-200 border active:scale-95
                          ${isActive
                            ? `${chip.color} text-white border-transparent shadow-lg`
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                    <Icon className="w-4 h-4" />
                    <span>{chip.label}</span>
                  </button>
                )
              })}
            </div>
            
            {/* Summary text */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{cars.length}</span> cars available
              </p>
              {activeFilter && (
                <button
                  onClick={() => onFilterChange(null)}
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
            <AnimatePresence mode="wait">
              {selectedCar ? (
                // Selected car view (Snap 2 with selection)
                <motion.div
                  key="selected-car"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <SelectedCarCard 
                    car={selectedCar} 
                    onClose={() => {
                      onCarSelect(null)
                      setSnap(0.15)
                    }}
                  />
                </motion.div>
              ) : (
                // Default view (Snap 2 without selection / Snap 3)
                <motion.div
                  key="default-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Top Rated carousel */}
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      Top Rated in Area
                    </h2>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                      {topRatedCars.map((car) => (
                        <CarCard 
                          key={car.id} 
                          car={car} 
                          onClick={() => onCarSelect(car)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Full list (Snap 3 content) */}
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">
                      All Available ({cars.length})
                    </h2>
                    <div className="space-y-2">
                      {cars.map((car, index) => (
                        <motion.div
                          key={car.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.03, 0.3) }}
                        >
                          <CarListItem 
                            car={car}
                            onClick={() => onCarSelect(car)}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Empty state */}
                    {cars.length === 0 && (
                      <div className="text-center py-12">
                        <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No cars match your filters</p>
                        <button
                          onClick={() => onFilterChange(null)}
                          className="mt-2 text-sm text-black underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
