"use client"

import { useState, useMemo, useEffect } from 'react'
import { MapCanvas } from '@/components/map/MapCanvas'
import { BottomDrawer } from '@/components/ui/BottomDrawer'
import { FloatingOmnibox } from '@/components/ui/FloatingOmnibox'
import { MAP_CARS, GUDAURI_CARS, MapCar, getWinterReadyCars, getCarsByCategory, getHybridElectricCars } from '@/lib/map-cars'

export function MapHomePage() {
  const [isWinterMode, setIsWinterMode] = useState(false)
  const [selectedCar, setSelectedCar] = useState<MapCar | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering for mapbox
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get cars based on mode
  const baseCars = isWinterMode ? GUDAURI_CARS : MAP_CARS

  // Apply filters
  const filteredCars = useMemo(() => {
    let cars = baseCars

    // In winter mode, only show winter-ready cars
    if (isWinterMode) {
      cars = getWinterReadyCars(cars)
    }

    // Apply active filter
    switch (activeFilter) {
      case 'winter':
        cars = getWinterReadyCars(cars)
        break
      case 'suv':
        cars = getCarsByCategory(cars, 'SUV')
        break
      case 'luxury':
        cars = getCarsByCategory(cars, 'LUXURY')
        break
      case 'hybrid':
        cars = getHybridElectricCars(cars)
        break
      case 'instant':
        cars = cars.filter(car => car.isInstantBook)
        break
      default:
        break
    }

    return cars
  }, [baseCars, isWinterMode, activeFilter])

  // Reset selected car when switching modes
  useEffect(() => {
    setSelectedCar(null)
    setActiveFilter(null)
  }, [isWinterMode])

  // Show loading state until client-side
  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-100">
      {/* Map canvas - full screen */}
      <MapCanvas
        cars={filteredCars}
        selectedCar={selectedCar}
        setSelectedCar={setSelectedCar}
        isWinterMode={isWinterMode}
      />

      {/* Floating search omnibox */}
      <FloatingOmnibox
        isWinterMode={isWinterMode}
        setIsWinterMode={setIsWinterMode}
      />

      {/* Bottom drawer */}
      <BottomDrawer
        cars={filteredCars}
        selectedCar={selectedCar}
        setSelectedCar={setSelectedCar}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isWinterMode={isWinterMode}
      />

      {/* Car count indicator */}
      <div className="fixed bottom-[140px] left-4 z-30 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
          {filteredCars.length} cars available
        </div>
      </div>
    </div>
  )
}
