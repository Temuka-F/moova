"use client"

import { useState } from 'react'
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
  MapPin
} from 'lucide-react'
import { MapCar } from '@/lib/map-cars'
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

// Filter chips
const FILTER_CHIPS = [
  { id: 'winter', label: 'Winter Ready', emoji: '❄️' },
  { id: 'suv', label: 'SUV', emoji: '🚙' },
  { id: 'sedan', label: 'Sedan', emoji: '🚗' },
  { id: 'luxury', label: 'Luxury', emoji: '✨' },
  { id: 'hybrid', label: 'Hybrid/EV', emoji: '⚡' },
  { id: 'instant', label: 'Instant Book', emoji: '🚀' },
  { id: 'automatic', label: 'Automatic', emoji: '🅰️' },
]

// Sort options
const SORT_OPTIONS = [
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
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
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      className={`
        relative bg-white rounded-xl overflow-hidden cursor-pointer
        transition-all duration-200 border-2
        ${isSelected 
          ? 'border-black shadow-xl ring-2 ring-black/10' 
          : 'border-transparent shadow-md hover:shadow-lg hover:border-gray-200'
        }
      `}
    >
      {/* Image */}
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
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
            <p className="text-xs text-gray-500">{car.year} · {car.category}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium">{car.rating}</span>
            <span className="text-gray-400">({car.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            <span>{car.transmission}</span>
          </div>
        </div>
      </div>
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

  // Get min/max prices from cars
  const minPrice = Math.min(...cars.map(c => c.price), 0)
  const maxPrice = Math.max(...cars.map(c => c.price), 500)

  return (
    <div className="hidden lg:flex flex-col w-[380px] h-full bg-gray-50 border-r border-gray-200 z-40">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg text-gray-900">Available Cars</h2>
            <p className="text-sm text-gray-500">{cars.length} vehicles found</p>
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`
              p-2.5 rounded-xl transition-colors
              ${showAdvancedFilters 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Quick filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
          {FILTER_CHIPS.slice(0, 5).map((chip) => (
            <button
              key={chip.id}
              onClick={() => onFilterChange(activeFilter === chip.id ? null : chip.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                whitespace-nowrap transition-all duration-200
                ${activeFilter === chip.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>{chip.emoji}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Advanced filters panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Price range */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">
                    Price Range: {priceRange[0]}₾ - {priceRange[1]}₾
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => onPriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1 accent-black"
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1 accent-black"
                    />
                  </div>
                </div>

                {/* More filter chips */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">More Filters</label>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_CHIPS.slice(5).map((chip) => (
                      <button
                        key={chip.id}
                        onClick={() => onFilterChange(activeFilter === chip.id ? null : chip.id)}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                          transition-all duration-200
                          ${activeFilter === chip.id
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        <span>{chip.emoji}</span>
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort dropdown */}
      <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Sort by</span>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 text-sm font-medium text-gray-900"
          >
            {SORT_OPTIONS.find(o => o.id === sortBy)?.label || 'Relevance'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[180px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onSortChange(option.id)
                      setShowSortDropdown(false)
                    }}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm transition-colors
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {cars.length > 0 ? (
            cars.map((car) => (
              <CarListCard
                key={car.id}
                car={car}
                isSelected={selectedCar?.id === car.id}
                onClick={() => onCarSelect(car)}
                onHover={(hovering) => onCarHover(hovering ? car : null)}
              />
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
                className="mt-3 text-sm font-medium text-black underline"
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
