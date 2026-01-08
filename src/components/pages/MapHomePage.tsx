"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { MapCanvas, MapCanvasHandle } from '@/components/map/MapCanvas'
import { CarDrawer } from '@/components/ui/CarDrawer'
import { TopNav } from '@/components/ui/TopNav'
import { DesktopSidebar } from '@/components/ui/DesktopSidebar'
import { CarPopup } from '@/components/ui/CarPopup'
import { MapControls } from '@/components/ui/MapControls'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav' // Verify path
import { SearchBar } from '@/components/search/SearchBar'
import { ControlBar } from '@/components/search/ControlBar'
import { CarList } from '@/components/listing/CarList'
import { MobileCarSheet } from '@/components/ui/MobileCarSheet'
import {
  ALL_CARS,
  MapCar,
  CityName,
  CITIES,
  getCarsByCity,
  getWinterReadyCars,
  getCarsByCategory,
  getHybridElectricCars,
  getCarsByPriceRange
} from '@/lib/map-cars'
import { fetchCarsWithFallback } from '@/lib/car-data'

export function MapHomePage() {
  // ===== CENTRALIZED STATE =====
  const [currentCity, setCurrentCity] = useState<CityName>('Tbilisi')
  const [selectedCar, setSelectedCar] = useState<MapCar | null>(null)
  const [hoveredCar, setHoveredCar] = useState<MapCar | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showCarPopup, setShowCarPopup] = useState(false)
  const [cityCars, setCityCars] = useState<MapCar[]>([])
  const [isLoadingCars, setIsLoadingCars] = useState(true)

  // Date state for booking
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Price range filter - initialize with reasonable defaults
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [sortBy, setSortBy] = useState<string>('rating')

  // Mobile View Mode
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [isMobileSheetExpanded, setIsMobileSheetExpanded] = useState(false)


  // Map ref for imperative control
  const mapRef = useRef<MapCanvasHandle>(null)

  // Ensure client-side rendering for mapbox
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch cars from database (with fallback to mock data)
  useEffect(() => {
    async function loadCars() {
      setIsLoadingCars(true)
      try {
        const result = await fetchCarsWithFallback({ city: currentCity })
        setCityCars(result.cars)
      } catch (error) {
        console.error('Error loading cars:', error)
        // Fallback to mock data on error
        setCityCars(getCarsByCity(currentCity))
      } finally {
        setIsLoadingCars(false)
      }
    }
    loadCars()
  }, [currentCity])

  // Calculate dynamic price range based on city cars
  const cityPriceRange = useMemo(() => {
    if (cityCars.length === 0) return { min: 0, max: 300 }
    const prices = cityCars.map(c => c.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }, [cityCars])

  // Reset price range when city changes
  useEffect(() => {
    setPriceRange([cityPriceRange.min, cityPriceRange.max])
  }, [cityPriceRange])

  // Apply filters to city cars
  const filteredCars = useMemo(() => {
    let cars = cityCars

    // Apply price filter - only if range has been adjusted from max
    if (priceRange[0] > cityPriceRange.min || priceRange[1] < cityPriceRange.max) {
      cars = getCarsByPriceRange(cars, priceRange[0], priceRange[1])
    }

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
      case 'compact':
        cars = getCarsByCategory(cars, 'COMPACT')
        break
      case 'luxury':
        cars = getCarsByCategory(cars, 'LUXURY')
        break
      case 'sports':
        cars = getCarsByCategory(cars, 'SPORTS')
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
  }, [cityCars, activeFilter, priceRange, sortBy, cityPriceRange])

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

  // Handle date change
  const handleDateChange = useCallback((start: Date | undefined, end: Date | undefined) => {
    setStartDate(start)
    setEndDate(end)
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

  // Show loading state until client-side or cars are loading
  if (!isClient || isLoadingCars) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">
            {!isClient ? 'Loading map...' : 'Loading cars...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ==============================================
          MOBILE LAYOUT - "App-Like" Overhaul
          ============================================== */}
      <div className="lg:hidden flex flex-col h-screen bg-slate-50 relative custom-safe-area-bottom">
        {/* Top Search Area */}
        <div className="flex-none z-30 bg-white">
          <SearchBar
            currentCity={currentCity}
            onCityChange={setCurrentCity}
            startDate={startDate}
            endDate={endDate}
            onDateChange={(s, e) => { setStartDate(s); setEndDate(e) }}
          />
          <ControlBar
            viewMode={viewMode}
            onViewChange={setViewMode}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalCars={filteredCars.length}
          />
        </div>

        {/* Content Area (Map or List) */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === 'map' ? (
            <MapCanvas
              id="mobile-map"
              ref={mapRef}
              cars={filteredCars}
              selectedCar={selectedCar}
              hoveredCar={null}
              onMarkerClick={handleCarSelect}
              onMapClick={() => handleCarSelect(null)}
              currentCity={currentCity}
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 overflow-y-auto pb-24 bg-gray-50">
              <CarList cars={filteredCars} />
            </div>
          )}
        </div>

        {/* Mobile Car Sheet (Details) - Only when a car is selected */}
        {viewMode === 'map' && (
          <MobileCarSheet
            selectedCar={selectedCar}
            onCarSelect={handleCarSelect}
          // Other filters are handled by ControlBar at the top
          />
        )}

        {/* Bottom Navigation */}
        <MobileBottomNav onMenuClick={() => { }} />
      </div>


      {/* ==============================================
          DESKTOP LAYOUT - Original Design
          ============================================== */}
      <div className="hidden lg:block fixed inset-0 bg-gray-100 overflow-hidden">
        {/* Full-screen map as base layer */}
        <div className="absolute inset-0" style={{ touchAction: 'none' }}>
          <MapCanvas
            id="desktop-map"
            ref={mapRef}
            cars={filteredCars}
            selectedCar={selectedCar}
            hoveredCar={hoveredCar}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            currentCity={currentCity}
          />
        </div>

        {/* Top navigation - positioned to avoid sidebar on desktop */}
        <div className="absolute top-0 left-0 right-0 z-50 lg:left-[400px]">
          <TopNav
            currentCity={currentCity}
            onCityChange={handleCityChange}
            carCount={filteredCars.length}
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Map controls */}
        <div className="absolute bottom-8 right-4 z-40">
          <MapControls
            onRecenter={handleRecenter}
            currentCity={currentCity}
            carCount={filteredCars.length}
            winterReadyCount={winterReadyCount}
          />
        </div>

        {/* Desktop Sidebar - Floating panel on the left */}
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

        {/* Car popup modal */}
        {showCarPopup && (
          <CarPopup
            car={selectedCar}
            onClose={handlePopupClose}
          />
        )}
      </div>
    </>
  )
}
