"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { CarDetailPage } from '@/components/pages/CarDetailPage'
import { MapCanvas, MapCanvasHandle } from '@/components/map/MapCanvas'
import { CarDrawer } from '@/components/ui/CarDrawer'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav' // Verify path
import { SearchBar } from '@/components/search/SearchBar'
import { ControlBar } from '@/components/search/ControlBar'
import { CarList } from '@/components/listing/CarList'
import { MobileCarSheet } from '@/components/ui/MobileCarSheet'
import { MobileListMenu } from '@/components/ui/MobileListMenu'
import { FilterDrawer } from '@/components/search/FilterDrawer'
import { Header } from '@/components/layout/header'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { parseISO } from 'date-fns'
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
  const router = useRouter()
  const searchParams = useSearchParams()

  // ===== CENTRALIZED STATE =====
  // Initialize from URL or defaults
  const [currentCity, setCurrentCity] = useState<CityName>(() => {
    const cityParam = searchParams.get('city')
    return (cityParam && Object.keys(CITIES).includes(cityParam))
      ? (cityParam as CityName)
      : 'Tbilisi'
  })

  // View state for Details Modal
  const [viewingCarId, setViewingCarId] = useState<string | null>(null)

  const [selectedCar, setSelectedCar] = useState<MapCar | null>(null)
  const [hoveredCar, setHoveredCar] = useState<MapCar | null>(null)

  // ... existing state ...

  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    return searchParams.get('category') || null
  })

  const [isClient, setIsClient] = useState(false)
  const [showCarPopup, setShowCarPopup] = useState(false)
  const [cityCars, setCityCars] = useState<MapCar[]>([])
  const [isLoadingCars, setIsLoadingCars] = useState(true)

  // Date state for booking
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const start = searchParams.get('startDate')
    return start ? parseISO(start) : undefined
  })
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const end = searchParams.get('endDate')
    return end ? parseISO(end) : undefined
  })

  // Price range filter - initialize with reasonable defaults
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [sortBy, setSortBy] = useState<string>('rating')

  // Helper to update URL params
  const updateUrlParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.replace(`/?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  // Mobile View Mode
  const [viewMode, setViewMode] = useState<'map' | 'list'>(() => {
    return searchParams.get('view') === 'map' ? 'map' : 'list'
  })
  const [isMobileSheetExpanded, setIsMobileSheetExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Advanced Filter State
  const [transmission, setTransmission] = useState<'AUTOMATIC' | 'MANUAL' | null>(null)
  const [minSeats, setMinSeats] = useState(4)
  const [instantBookOnly, setInstantBookOnly] = useState(false)
  const [activeFeatures, setActiveFeatures] = useState<string[]>([])
  const [selectedMake, setSelectedMake] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null)


  // Map ref for imperative control
  const mapRef = useRef<MapCanvasHandle>(null)

  // Ensure client-side rendering for mapbox
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sync state with URL params on mount/change (in case of back/forward navigation)
  useEffect(() => {
    const cityParam = searchParams.get('city')
    if (cityParam && Object.keys(CITIES).includes(cityParam)) {
      setCurrentCity(cityParam as CityName)
    }

    const categoryParam = searchParams.get('category')
    setActiveFilter(categoryParam || null)

    const startParam = searchParams.get('startDate')
    if (startParam) setStartDate(parseISO(startParam))
    else setStartDate(undefined)

    const endParam = searchParams.get('endDate')
    if (endParam) setEndDate(parseISO(endParam))
    else setEndDate(undefined)

    const viewParam = searchParams.get('view')
    if (viewParam === 'list' || viewParam === 'map') {
      setViewMode(viewParam as 'map' | 'list')
    }

  }, [searchParams])

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
    // Reset filters on city change
    setTransmission(null)
    setSelectedMake(null)
    setSelectedModel(null)
    setSelectedFuelType(null)
  }, [cityPriceRange])

  // Derive available options
  const availableMakes = useMemo(() => {
    return Array.from(new Set(cityCars.map(c => c.make))).sort()
  }, [cityCars])

  const availableModels = useMemo(() => {
    if (!selectedMake) return []
    return Array.from(new Set(cityCars
      .filter(c => c.make === selectedMake)
      .map(c => c.model)
    )).sort()
  }, [cityCars, selectedMake])

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
    updateUrlParams({ city })
  }, [updateUrlParams])

  // Handle date change
  const handleDateChange = useCallback((start: Date | undefined, end: Date | undefined) => {
    setStartDate(start)
    setEndDate(end)
    updateUrlParams({
      startDate: start ? start.toISOString() : null,
      endDate: end ? end.toISOString() : null
    })
  }, [updateUrlParams])

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

  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">
            Loading map...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Loading Indicator for Cars */}
      {isLoadingCars && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-3 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-700">Finding cars...</span>
        </div>
      )}
      {/* ==============================================
          UNIFIED LAYOUT - Mobile First, Desktop Friendly
          ============================================== */}
      <div className="flex flex-col h-screen bg-slate-50 relative custom-safe-area-bottom w-full overflow-hidden">
        <Header />
        {/* Top Search Area */}
        <div className="flex-none z-50 bg-white border-b border-gray-200 lg:flex lg:justify-center lg:py-4 shadow-sm relative pointer-events-auto">
          <div className="w-full lg:max-w-2xl space-y-2 lg:px-4">
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
              onAllFiltersClick={() => setIsFilterOpen(true)}
            />
          </div>
        </div>

        <FilterDrawer
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          currentCount={filteredCars.length}
          transmission={transmission}
          setTransmission={setTransmission}
          minSeats={minSeats}
          setMinSeats={setMinSeats}
          instantBookOnly={instantBookOnly}
          setInstantBookOnly={setInstantBookOnly}
          activeFeatures={activeFeatures}
          setActiveFeatures={setActiveFeatures}
          // New Props
          selectedCategory={activeFilter}
          setSelectedCategory={setActiveFilter}
          selectedMake={selectedMake}
          setSelectedMake={setSelectedMake}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedFuelType={selectedFuelType}
          setSelectedFuelType={setSelectedFuelType}
          availableMakes={availableMakes}
          availableModels={availableModels}
        />

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
            <div id="cars-section" className="absolute inset-0 overflow-y-auto pb-24 bg-gray-50">
              <CarList
                cars={filteredCars}
                onCarSelect={(car) => setViewingCarId(car.id)}
              />
            </div>
          )}
        </div>

        {/* Mobile Car Sheet (Details) - Only when a car is selected */}
        {viewMode === 'map' && (
          <MobileCarSheet
            selectedCar={selectedCar}
            onCarSelect={handleCarSelect}
            startDate={startDate}
            endDate={endDate}
            onViewDetails={setViewingCarId}
          // Other filters are handled by ControlBar at the top
          />
        )}

        {/* Full Screen Details Modal */}
        {/* Full Screen Details Modal */}
        <AnimatePresence>
          {viewingCarId && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-[2px]"
                onClick={() => setViewingCarId(null)}
              />

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 top-4 bottom-0 z-[60] lg:inset-x-auto lg:inset-y-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-4xl lg:h-auto lg:rounded-3xl lg:border lg:shadow-2xl lg:overflow-hidden"
              >
                <div className="h-full w-full bg-background rounded-t-3xl lg:rounded-3xl overflow-hidden shadow-2xl relative">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    <CarDetailPage
                      carId={viewingCarId}
                      isModal
                      onClose={() => setViewingCarId(null)}
                      initialStartDate={startDate}
                      initialEndDate={endDate}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <MobileBottomNav onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Mobile Menu Drawer */}
        <MobileListMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
      </div>


    </>
  )
}
