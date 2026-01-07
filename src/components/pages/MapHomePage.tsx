"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { MapCanvas, MapCanvasHandle } from '@/components/map/MapCanvas'
import { CarDrawer } from '@/components/ui/CarDrawer'
import { TopNav } from '@/components/ui/TopNav'
import { DesktopSidebar } from '@/components/ui/DesktopSidebar'
import { CarPopup } from '@/components/ui/CarPopup'
import { MapControls } from '@/components/ui/MapControls'
import { 
  ALL_CARS, 
  MapCar, 
  CityName,
  CITIES,
  getCarsByCity,
  getWinterReadyCars, 
  getCarsByCategory, 
  getHybridElectricCars 
} from '@/lib/map-cars'

export function MapHomePage() {
  // ===== CENTRALIZED STATE =====
  const [currentCity, setCurrentCity] = useState<CityName>('Tbilisi')
  const [selectedCar, setSelectedCar] = useState<MapCar | null>(null)
  const [hoveredCar, setHoveredCar] = useState<MapCar | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showCarPopup, setShowCarPopup] = useState(false)
  
  // Advanced filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState<string>('rating')
  
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

    // Apply price filter
    cars = cars.filter(car => car.price >= priceRange[0] && car.price <= priceRange[1])

    // Apply active filter
    switch (activeFilter) {
      case 'winter':
        cars = getWinterReadyCars(cars)
        break
      case 'suv':
        cars = getCarsByCategory(cars, 'SUV')
        break
      case 'sedan':
        cars = getCarsByCategory(cars, 'SEDAN')
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
      case 'automatic':
        cars = cars.filter(car => car.transmission === 'AUTOMATIC')
        break
      default:
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        cars = [...cars].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        cars = [...cars].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        cars = [...cars].sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        cars = [...cars].sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default:
        break
    }

    return cars
  }, [cityCars, activeFilter, priceRange, sortBy])

  // Winter ready count
  const winterReadyCount = useMemo(() => {
    return filteredCars.filter(car => car.isWinterReady).length
  }, [filteredCars])

  // ===== EVENT HANDLERS =====
  
  // Handle city change
  const handleCityChange = useCallback((city: CityName) => {
    setCurrentCity(city)
    setSelectedCar(null)
    setActiveFilter(null)
    setShowCarPopup(false)
  }, [])

  // Handle marker click - show popup
  const handleMarkerClick = useCallback((car: MapCar) => {
    setSelectedCar(car)
    setShowCarPopup(true)
  }, [])

  // Handle map click - deselect car
  const handleMapClick = useCallback(() => {
    if (selectedCar && !showCarPopup) {
      setSelectedCar(null)
    }
  }, [selectedCar, showCarPopup])

  // Handle car selection from drawer/sidebar
  const handleCarSelect = useCallback((car: MapCar | null) => {
    setSelectedCar(car)
    if (car) {
      mapRef.current?.flyToCar(car)
      setShowCarPopup(true)
    } else {
      setShowCarPopup(false)
    }
  }, [])

  // Handle car hover (for desktop sidebar)
  const handleCarHover = useCallback((car: MapCar | null) => {
    setHoveredCar(car)
  }, [])

  // Handle filter change
  const handleFilterChange = useCallback((filter: string | null) => {
    setActiveFilter(filter)
    setSelectedCar(null)
    setShowCarPopup(false)
  }, [])

  // Handle popup close
  const handlePopupClose = useCallback(() => {
    setShowCarPopup(false)
  }, [])

  // Handle recenter
  const handleRecenter = useCallback(() => {
    mapRef.current?.flyToCity(currentCity)
  }, [currentCity])

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
    <div className="fixed inset-0 bg-gray-100 overflow-hidden flex">
      {/* Desktop Sidebar - Left side car list */}
      <DesktopSidebar
        cars={filteredCars}
        selectedCar={selectedCar}
        onCarSelect={handleCarSelect}
        onCarHover={handleCarHover}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Main map area */}
      <div className="flex-1 relative" style={{ touchAction: 'none' }}>
        {/* Map canvas */}
        <MapCanvas
          ref={mapRef}
          cars={filteredCars}
          selectedCar={selectedCar}
          hoveredCar={hoveredCar}
          onMarkerClick={handleMarkerClick}
          onMapClick={handleMapClick}
          currentCity={currentCity}
        />

        {/* Top navigation */}
        <TopNav
          currentCity={currentCity}
          onCityChange={handleCityChange}
          carCount={filteredCars.length}
        />

        {/* Map controls */}
        <MapControls
          onRecenter={handleRecenter}
          currentCity={currentCity}
          carCount={filteredCars.length}
          winterReadyCount={winterReadyCount}
        />

        {/* Mobile Bottom drawer */}
        <div className="lg:hidden">
          <CarDrawer
            cars={filteredCars}
            selectedCar={selectedCar}
            onCarSelect={handleCarSelect}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Car popup modal */}
      {showCarPopup && (
        <CarPopup
          car={selectedCar}
          onClose={handlePopupClose}
        />
      )}
    </div>
  )
}
