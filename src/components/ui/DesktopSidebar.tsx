"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Star, 
  Fuel, 
  Gauge, 
  Snowflake, 
  Zap,
  ChevronDown,
  SlidersHorizontal,
  X,
  Car,
  MapPin,
  Users,
  Sparkles,
  Leaf
} from 'lucide-react'
import { MapCar, ALL_CARS } from '@/lib/map-cars'
import Image from 'next/image'
import Link from 'next/link'

interface DesktopSidebarProps {
  cars: MapCar[]
  selectedCar: MapCar | null
  onCarSelect: (car: MapCar | null) => void
  onCarHover: (car: MapCar | null) => void
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

// Filter chips with icons
const FILTER_CHIPS = [
  { id: 'winter', label: 'Winter Ready', icon: Snowflake, color: 'bg-blue-500' },
  { id: 'suv', label: 'SUV', icon: Car, color: 'bg-orange-500' },
  { id: 'sedan', label: 'Sedan', icon: Car, color: 'bg-indigo-500' },
  { id: 'luxury', label: 'Luxury', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'hybrid', label: 'Hybrid/EV', icon: Leaf, color: 'bg-green-500' },
  { id: 'instant', label: 'Instant Book', icon: Zap, color: 'bg-emerald-500' },
  { id: 'compact', label: 'Compact', icon: Car, color: 'bg-gray-500' },
]

// Sort options
const SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'reviews', label: 'Most Reviews' },
]

function CarListCard({ 
  car, 
  isSelected,
  onClick,
  onHover
}: { 
  car: MapCar
  isSelected: boolean
  onClick: () => void
  onHover: (hovering: boolean) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      className={`
        relative bg-white rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300 border-2
        ${isSelected 
          ? 'border-black shadow-xl ring-2 ring-black/10' 
          : 'border-transparent shadow-md hover:shadow-lg hover:border-gray-200'
        }
      `}
    >
      {/* Image */}
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="300px"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {car.isWinterReady && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              <Snowflake className="w-3 h-3" />
            </div>
          )}
          {car.isInstantBook && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              <Zap className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Price badge */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900">{car.price}₾<span className="text-xs font-normal text-gray-500">/day</span></p>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {car.make} {car.model}
            </h3>
            <p className="text-xs text-gray-500">{car.year} · {car.color}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium">{car.rating}</span>
            <span className="text-gray-400">({car.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            <span>{car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{car.city}</span>
        </div>
      </div>

      {/* View button on hover */}
      <Link 
        href={`/cars/${car.id}`}
        className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white text-sm font-medium">View Details →</span>
      </Link>
    </motion.div>
  )
}

export function DesktopSidebar({
  cars,
  selectedCar,
  onCarSelect,
  onCarHover,
  activeFilter,
  onFilterChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}: DesktopSidebarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Calculate price range from all cars for the slider
  const globalPriceRange = useMemo(() => {
    const prices = ALL_CARS.map(c => c.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }, [])

  return (
    <div className="hidden lg:flex flex-col w-[380px] h-full bg-gray-50 border-r border-gray-200 z-40">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-100 rounded-br-3xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg text-gray-900">Available Cars</h2>
            <p className="text-sm text-gray-500">{cars.length} vehicles found</p>
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`
              p-2.5 rounded-xl transition-all duration-300
              ${showAdvancedFilters 
                ? 'bg-black text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Quick filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
          {FILTER_CHIPS.slice(0, 5).map((chip) => {
            const Icon = chip.icon
            const isActive = activeFilter === chip.id
            return (
              <button
                key={chip.id}
                onClick={() => onFilterChange(isActive ? null : chip.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium
                  whitespace-nowrap transition-all duration-300 border
                  ${isActive
                    ? `${chip.color} text-white border-transparent shadow-lg scale-105`
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            )
          })}
        </div>

        {/* Clear filter button */}
        {activeFilter && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onFilterChange(null)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear filter
          </motion.button>
        )}

        {/* Advanced filters panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Price range */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Price Range
                  </label>
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-white rounded-xl px-3 py-2 border border-gray-200">
                      <span className="text-xs text-gray-500">Min</span>
                      <p className="font-semibold text-gray-900">{priceRange[0]}₾</p>
                    </div>
                    <div className="flex-1 mx-3 h-[2px] bg-gray-200" />
                    <div className="bg-white rounded-xl px-3 py-2 border border-gray-200">
                      <span className="text-xs text-gray-500">Max</span>
                      <p className="font-semibold text-gray-900">{priceRange[1]}₾</p>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-full bg-black rounded-full"
                      style={{
                        left: `${((priceRange[0] - globalPriceRange.min) / (globalPriceRange.max - globalPriceRange.min)) * 100}%`,
                        right: `${100 - ((priceRange[1] - globalPriceRange.min) / (globalPriceRange.max - globalPriceRange.min)) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="range"
                      min={globalPriceRange.min}
                      max={globalPriceRange.max}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (val < priceRange[1]) {
                          onPriceRangeChange([val, priceRange[1]])
                        }
                      }}
                      className="flex-1 accent-black"
                    />
                    <input
                      type="range"
                      min={globalPriceRange.min}
                      max={globalPriceRange.max}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (val > priceRange[0]) {
                          onPriceRangeChange([priceRange[0], val])
                        }
                      }}
                      className="flex-1 accent-black"
                    />
                  </div>
                </div>

                {/* More filter chips */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">More Filters</label>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_CHIPS.slice(5).map((chip) => {
                      const Icon = chip.icon
                      const isActive = activeFilter === chip.id
                      return (
                        <button
                          key={chip.id}
                          onClick={() => onFilterChange(isActive ? null : chip.id)}
                          className={`
                            flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium
                            transition-all duration-300 border
                            ${isActive
                              ? `${chip.color} text-white border-transparent shadow-lg`
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }
                          `}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{chip.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort dropdown */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Sort by</span>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            {SORT_OPTIONS.find(o => o.id === sortBy)?.label || 'Relevance'}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[180px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onSortChange(option.id)
                      setShowSortDropdown(false)
                    }}
                    className={`
                      w-full px-4 py-3 text-left text-sm transition-colors
                      ${sortBy === option.id 
                        ? 'bg-gray-100 font-medium text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Car list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {cars.length > 0 ? (
            cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
              >
                <CarListCard
                  car={car}
                  isSelected={selectedCar?.id === car.id}
                  onClick={() => onCarSelect(car)}
                  onHover={(hovering) => onCarHover(hovering ? car : null)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Car className="w-12 h-12 text-gray-300 mb-3" />
              <p className="font-medium text-gray-900">No cars found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
              <button
                onClick={() => onFilterChange(null)}
                className="mt-3 px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-900 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
