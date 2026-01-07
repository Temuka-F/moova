"use client"

import { useRef } from 'react'
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
  Users,
  Gauge
} from 'lucide-react'
import { MapCar } from '@/lib/map-cars'
import Image from 'next/image'

interface BottomDrawerProps {
  cars: MapCar[]
  selectedCar: MapCar | null
  setSelectedCar: (car: MapCar | null) => void
  activeFilter: string | null
  setActiveFilter: (filter: string | null) => void
  isWinterMode: boolean
}

// Filter chip data
const FILTER_CHIPS = [
  { id: 'winter', label: 'Winter Ready', icon: Snowflake, emoji: '❄️' },
  { id: 'suv', label: 'SUV', icon: Car, emoji: '🚙' },
  { id: 'hybrid', label: 'Hybrid/EV', icon: Zap, emoji: '⚡' },
  { id: 'luxury', label: 'Luxury', icon: Star, emoji: '✨' },
  { id: 'instant', label: 'Instant Book', icon: Clock, emoji: '⚡' },
]

// Car card component
function CarCard({ 
  car, 
  isSelected = false,
  onClick 
}: { 
  car: MapCar
  isSelected?: boolean
  onClick: () => void 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden
        shadow-lg border transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-black ring-2 ring-black/10' 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-xl'
        }
      `}
    >
      {/* Car image */}
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="288px"
        />
        
        {/* Winter ready badge */}
        {car.isWinterReady && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            <Snowflake className="w-3 h-3" />
            <span>Winter Ready</span>
          </div>
        )}

        {/* Instant book badge */}
        {car.isInstantBook && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            <Zap className="w-3 h-3" />
            <span>Instant</span>
          </div>
        )}
      </div>

      {/* Car info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-500">{car.year} · {car.category}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">{car.price}₾</p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-medium">{car.rating}</span>
            <span className="text-gray-400">({car.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{car.transmission}</span>
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
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Car image */}
      <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">
            {car.make} {car.model}
          </h3>
          {car.isWinterReady && (
            <span className="text-blue-500 text-sm">❄️</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <span>{car.year}</span>
          <span>·</span>
          <span>{car.category}</span>
          <span>·</span>
          <span>{car.fuelType}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-medium text-gray-700">{car.rating}</span>
          <span className="text-gray-400">({car.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-lg text-gray-900">{car.price}₾</p>
        <p className="text-xs text-gray-500">per day</p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </motion.div>
  )
}

export function BottomDrawer({
  cars,
  selectedCar,
  setSelectedCar,
  activeFilter,
  setActiveFilter,
  isWinterMode,
}: BottomDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Get nearest cars (sorted by price for now, could be by distance)
  const nearestCars = [...cars].sort((a, b) => a.price - b.price).slice(0, 5)

  return (
    <Drawer.Root
      snapPoints={[0.15, 0.45, 0.95]}
      activeSnapPoint={selectedCar ? 0.45 : 0.15}
      modal={false}
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col bg-white rounded-t-[20px] outline-none"
          style={{ 
            height: '95%',
            maxHeight: '95vh',
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-auto overscroll-contain">
            {/* Filter chips - always visible */}
            <div className="px-4 pb-3">
              <div 
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4"
              >
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setActiveFilter(activeFilter === chip.id ? null : chip.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                      whitespace-nowrap transition-all duration-200
                      ${activeFilter === chip.id
                        ? 'bg-black text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      ${chip.id === 'winter' && isWinterMode ? 'ring-2 ring-blue-400' : ''}
                    `}
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content based on state */}
            <div className="px-4 pb-8">
              <AnimatePresence mode="wait">
                {selectedCar ? (
                  // Selected car detail
                  <motion.div
                    key="selected-car"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-sm font-medium text-gray-500 mb-3">Selected Car</h2>
                    <CarCard 
                      car={selectedCar} 
                      isSelected 
                      onClick={() => {
                        // Navigate to car detail page
                        window.location.href = `/cars/${selectedCar.id}`
                      }}
                    />
                    
                    {/* Action button */}
                    <button 
                      onClick={() => window.location.href = `/cars/${selectedCar.id}`}
                      className="w-full mt-4 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors"
                    >
                      View Details & Book
                    </button>
                  </motion.div>
                ) : (
                  // Nearest cars carousel
                  <motion.div
                    key="nearest-cars"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-sm font-medium text-gray-500 mb-3">
                      {isWinterMode ? '🏔️ Available in Gudauri' : 'Nearest Cars'}
                    </h2>
                    
                    {/* Horizontal scroll carousel */}
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
                      {nearestCars.map((car) => (
                        <CarCard 
                          key={car.id} 
                          car={car} 
                          onClick={() => setSelectedCar(car)}
                        />
                      ))}
                    </div>

                    {/* Full list */}
                    <div className="mt-6">
                      <h2 className="text-sm font-medium text-gray-500 mb-3">
                        All Available ({cars.length})
                      </h2>
                      <div className="space-y-3">
                        {cars.map((car) => (
                          <CarListItem 
                            key={car.id} 
                            car={car}
                            onClick={() => setSelectedCar(car)}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
