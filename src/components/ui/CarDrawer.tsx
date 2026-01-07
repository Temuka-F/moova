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
  X
} from 'lucide-react'
import { MapCar, getTopRatedCars } from '@/lib/map-cars'
import Image from 'next/image'
import Link from 'next/link'

interface CarDrawerProps {
  cars: MapCar[]
  selectedCar: MapCar | null
  onCarSelect: (car: MapCar | null) => void
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
}

// Filter chip data
const FILTER_CHIPS = [
  { id: 'winter', label: 'Winter Ready', emoji: '❄️' },
  { id: 'suv', label: 'SUV', emoji: '🚙' },
  { id: 'hybrid', label: 'Hybrid/EV', emoji: '⚡' },
  { id: 'luxury', label: 'Luxury', emoji: '✨' },
  { id: 'instant', label: 'Instant Book', emoji: '🚀' },
]

// Selected car card component (for 45% snap)
function SelectedCarCard({ 
  car, 
  onClose 
}: { 
  car: MapCar
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Car image */}
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        
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
      </div>

      {/* Car info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-xl text-gray-900">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-500">{car.year} · {car.category} · {car.transmission}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl text-gray-900">{car.price}₾</p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-medium">{car.rating}</span>
            <span className="text-gray-400">({car.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
        </div>

        {/* Book Now button */}
        <Link 
          href={`/cars/${car.id}`}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors"
        >
          <span>Book Now</span>
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
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
    >
      {/* Car image */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="256px"
        />
        
        {car.isWinterReady && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-xs">❄️</span>
          </div>
        )}
      </div>

      {/* Car info */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{car.rating}</span>
              <span>·</span>
              <span>{car.category}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-gray-900">{car.price}₾</p>
            <p className="text-xs text-gray-500">/day</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Full car list item
function CarListItem({ 
  car, 
  onClick 
}: { 
  car: MapCar
  onClick: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Car image */}
      <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-gray-900 truncate">
            {car.make} {car.model}
          </h3>
          {car.isWinterReady && (
            <span className="text-blue-500 text-xs">❄️</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{car.rating}</span>
          <span>·</span>
          <span>{car.category}</span>
          <span>·</span>
          <span>{car.fuelType}</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-gray-900">{car.price}₾</p>
        <p className="text-xs text-gray-500">/day</p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </motion.div>
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
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => onFilterChange(activeFilter === chip.id ? null : chip.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                    whitespace-nowrap transition-all duration-200
                    ${activeFilter === chip.id
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{chip.emoji}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
            {/* Summary text */}
            <p className="text-sm text-gray-500 mt-2">
              {cars.length} cars available in this area
            </p>
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
                      Top Rated
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
                          transition={{ delay: index * 0.05 }}
                        >
                          <CarListItem 
                            car={car}
                            onClick={() => onCarSelect(car)}
                          />
                        </motion.div>
                      ))}
                    </div>
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
