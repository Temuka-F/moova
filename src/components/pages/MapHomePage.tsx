"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { MapCanvas, MapCanvasHandle } from '@/components/map/MapCanvas'
import { CarDrawer } from '@/components/ui/CarDrawer'
import { TopNav } from '@/components/ui/TopNav'
import { 
  ALL_CARS, 
  MapCar, 
  CityName,
  getCarsByCity,
  getWinterReadyCars, 
  getCarsByCategory, 
  getHybridElectricCars 
} from '@/lib/map-cars'

export function MapHomePage() {
  // ===== CENTRALIZED STATE =====
  const [currentCity, setCurrentCity] = useState<CityName>('Tbilisi')
  const [selectedCar, setSelectedCar] = useState<MapCar | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  // Map ref for imperative control
  const mapRef = useRef<MapCanvasHandle>(null)

  // Ensure client-side rendering for mapbox
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get cars for current city
  const cityCars = useMemo(() => {
    return getCarsByCity(currentCity)
  }, [currentCity])

  // Apply filters to city cars
  const filteredCars = useMemo(() => {
    let cars = cityCars

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
  }, [cityCars, activeFilter])

  // ===== EVENT HANDLERS =====
  
  // Handle city change
  const handleCityChange = useCallback((city: CityName) => {
    setCurrentCity(city)
    setSelectedCar(null)
    setActiveFilter(null)
    // Map will automatically fly to new city via useEffect in MapCanvas
  }, [])

  // Handle marker click - select car and fly to it
  const handleMarkerClick = useCallback((car: MapCar) => {
    setSelectedCar(car)
    // Drawer will automatically snap to 45%
  }, [])

  // Handle map click - deselect car
  const handleMapClick = useCallback(() => {
    if (selectedCar) {
      setSelectedCar(null)
    }
  }, [selectedCar])

  // Handle car selection from drawer
  const handleCarSelect = useCallback((car: MapCar | null) => {
    setSelectedCar(car)
    if (car) {
      mapRef.current?.flyToCar(car)
    }
  }, [])

  // Handle filter change
  const handleFilterChange = useCallback((filter: string | null) => {
    setActiveFilter(filter)
    setSelectedCar(null) // Deselect when filter changes
  }, [])

  // Show loading state until client-side
  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-hidden" style={{ touchAction: 'none' }}>
      {/* Map canvas - full screen, z-0 */}
      <MapCanvas
        ref={mapRef}
        cars={filteredCars}
        selectedCar={selectedCar}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
        currentCity={currentCity}
      />

      {/* Top navigation - z-50 */}
      <TopNav
        currentCity={currentCity}
        onCityChange={handleCityChange}
        carCount={filteredCars.length}
      />

      {/* Bottom drawer - z-60 */}
      <CarDrawer
        cars={filteredCars}
        selectedCar={selectedCar}
        onCarSelect={handleCarSelect}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}
