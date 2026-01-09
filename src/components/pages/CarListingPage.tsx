'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { CarCard } from '@/components/cars/CarCard'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  SlidersHorizontal,
  MapPin,
  Car,
  Loader2,
  Map,
  List,
  X,
  Zap,
  AlertCircle,
} from 'lucide-react'
import { GEORGIAN_CITIES } from '@/types'

// Dynamically import map
const CarMap = dynamic(
  () => import('@/components/map/CarMapView').then((mod) => mod.CarMap),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-2xl" />
  }
)

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
]

interface CarImage {
  id: string
  url: string
  isPrimary: boolean
}

interface CarOwner {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  verificationStatus: string
}

interface ApiCar {
  id: string
  make: string
  model: string
  year: number
  color: string
  transmission: string
  fuelType: string
  seats: number
  doors: number
  category: string
  pricePerDay: number
  pricePerHour: number | null
  securityDeposit: number
  city: string
  address: string
  latitude: number
  longitude: number
  isInstantBook: boolean
  isActive: boolean
  status: string
  features: string[]
  images: CarImage[]
  owner: CarOwner
  _count: {
    bookings: number
    reviews: number
  }
}

function CarListSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="rounded-2xl overflow-hidden border">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CarListingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view') as 'list' | 'map' | 'split' | null
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>(viewParam || 'split')
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('recommended')
  const [cars, setCars] = useState<ApiCar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    priceRange: [0, 500] as [number, number],
    transmission: '',
    fuelType: '',
    category: searchParams.get('category') || '',
    instantBookOnly: false,
  })

  const fetchCars = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (filters.city && filters.city !== 'ALL') params.set('city', filters.city)
      if (filters.category && filters.category !== 'ALL') params.set('category', filters.category)
      if (filters.transmission) params.set('transmission', filters.transmission)
      if (filters.fuelType) params.set('fuelType', filters.fuelType)
      if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString())
      if (filters.priceRange[1] < 500) params.set('maxPrice', filters.priceRange[1].toString())
      if (filters.instantBookOnly) params.set('isInstantBook', 'true')
      if (sortBy !== 'recommended') params.set('sortBy', sortBy)
      params.set('limit', '50')

      const res = await fetch(`/api/cars?${params.toString()}`)

      if (!res.ok) {
        let errorMessage = 'Failed to fetch cars'
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = res.status === 500 ? 'Server error. Please try again later.' : 'Failed to fetch cars'
        }
        throw new Error(errorMessage)
      }

      const data = await res.json()
      setCars(data.cars || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err.message || 'Failed to load cars')
      console.error('Error fetching cars:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  // Update view mode if URL param changes
  useEffect(() => {
    const view = searchParams.get('view') as 'list' | 'map' | 'split' | null
    if (view) setViewMode(view)
  }, [searchParams])

  // Sort cars client-side for immediate feedback
  const sortedCars = [...cars].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.pricePerDay - b.pricePerDay
      case 'price_desc': return b.pricePerDay - a.pricePerDay
      case 'newest': return b.year - a.year
      default: return 0 // Server handles recommended/rating
    }
  })

  const mapCars = sortedCars.map(car => ({
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    pricePerDay: car.pricePerDay,
    latitude: car.latitude,
    longitude: car.longitude,
    rating: 4.5, // TODO: Calculate from reviews
    isInstantBook: car.isInstantBook,
    image: car.images?.[0]?.url || '',
  }))

  const activeFiltersCount = [
    filters.city,
    filters.transmission,
    filters.fuelType,
    filters.category,
    filters.instantBookOnly,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 500,
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters({
      city: '',
      priceRange: [0, 500],
      transmission: '',
      fuelType: '',
      category: '',
      instantBookOnly: false,
    })
  }

  const FilterPanel = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-6">
      {/* City */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Location</Label>
        <Select
          value={filters.city}
          onValueChange={(value) => setFilters({ ...filters, city: value })}
        >
          <SelectTrigger className="h-12 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <SelectValue placeholder="All cities" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All cities</SelectItem>
            {GEORGIAN_CITIES.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label className="text-sm font-semibold">Price per day</Label>
          <span className="text-sm text-muted-foreground">
            ₾{filters.priceRange[0]} - ₾{filters.priceRange[1]}{filters.priceRange[1] >= 500 ? '+' : ''}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
          min={0}
          max={500}
          step={10}
          className="py-4"
        />
      </div>

      {/* Instant Book */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Label className="font-medium">Instant Book only</Label>
            <p className="text-xs text-muted-foreground">Book without waiting for approval</p>
          </div>
        </div>
        <Switch
          checked={filters.instantBookOnly}
          onCheckedChange={(v) => setFilters({ ...filters, instantBookOnly: v })}
        />
      </div>

      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Car type</Label>
        <div className="flex flex-wrap gap-2">
          {['', 'SUV', 'SEDAN', 'LUXURY', 'COMPACT', 'SPORTS'].map((cat) => (
            <Badge
              key={cat}
              variant={filters.category === cat ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5 rounded-full"
              onClick={() => setFilters({ ...filters, category: cat })}
            >
              {cat || 'All'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Transmission</Label>
        <div className="grid grid-cols-3 gap-2">
          {['', 'AUTOMATIC', 'MANUAL'].map((t) => (
            <Button
              key={t}
              variant={filters.transmission === t ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
              onClick={() => setFilters({ ...filters, transmission: t })}
            >
              {t === '' ? 'Any' : t === 'AUTOMATIC' ? 'Auto' : 'Manual'}
            </Button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Fuel type</Label>
        <div className="flex flex-wrap gap-2">
          {['', 'PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC'].map((f) => (
            <Badge
              key={f}
              variant={filters.fuelType === f ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5 rounded-full"
              onClick={() => setFilters({ ...filters, fuelType: f })}
            >
              {f || 'Any'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={clearFilters}>
          Clear all
        </Button>
        <Button className="flex-1 rounded-xl" onClick={onClose}>
          Show {sortedCars.length} cars
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Results & Filters */}
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto pb-20 pr-2">
                    <FilterPanel onClose={() => { }} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden lg:flex items-center gap-2">
                <Select value={filters.city} onValueChange={(v) => setFilters({ ...filters, city: v })}>
                  <SelectTrigger className="w-40 rounded-full h-9">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All cities</SelectItem>
                    {GEORGIAN_CITIES.slice(0, 10).map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                  <SelectTrigger className="w-32 rounded-full h-9">
                    <Car className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All types</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="SEDAN">Sedan</SelectItem>
                    <SelectItem value="LUXURY">Luxury</SelectItem>
                    <SelectItem value="COMPACT">Compact</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={filters.instantBookOnly ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setFilters({ ...filters, instantBookOnly: !filters.instantBookOnly })}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Instant
                </Button>

                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <span className="text-sm text-muted-foreground hidden md:inline">
                {loading ? '...' : `${total} cars`}
              </span>
            </div>

            {/* Right: Sort & View */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 rounded-full h-9 hidden sm:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border rounded-full p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7 rounded-full hidden lg:flex"
                  onClick={() => setViewMode('split')}
                >
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-3 bg-current rounded-sm" />
                    <div className="w-2 h-3 bg-current rounded-sm" />
                  </div>
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          {viewMode !== 'map' && (
            <div className="hidden lg:block w-72 shrink-0">
              <div className="bg-card rounded-2xl p-6 sticky top-36 border">
                <h2 className="font-semibold text-lg mb-6">Filters</h2>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Cars List */}
          {viewMode !== 'map' && (
            <div className={`flex-1 ${viewMode === 'split' ? 'lg:w-1/2' : ''}`}>
              {error ? (
                <div className="text-center py-20">
                  <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Failed to load cars</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button variant="outline" onClick={fetchCars}>
                    Try again
                  </Button>
                </div>
              ) : loading ? (
                <CarListSkeleton />
              ) : sortedCars.length > 0 ? (
                <div className={`grid gap-4 ${viewMode === 'split'
                  ? 'grid-cols-1 xl:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}>
                  {sortedCars.map((car) => (
                    <div
                      key={car.id}
                      onMouseEnter={() => setSelectedCarId(car.id)}
                      onMouseLeave={() => setSelectedCarId(null)}
                    >
                      <CarCard
                        car={{
                          id: car.id,
                          make: car.make,
                          model: car.model,
                          year: car.year,
                          pricePerDay: car.pricePerDay,
                          city: car.city,
                          rating: 4.5, // TODO: Calculate from reviews
                          reviewCount: car._count?.reviews || 0,
                          isInstantBook: car.isInstantBook,
                          transmission: car.transmission,
                          fuelType: car.fuelType,
                          seats: car.seats,
                          images: (car.images || []).map(img => ({ url: img.url, isPrimary: img.isPrimary })),
                          owner: car.owner ? {
                            firstName: car.owner.firstName,
                            lastName: car.owner.lastName,
                            avatarUrl: car.owner.avatarUrl,
                            rating: 4.8
                          } : undefined
                        }}
                        variant={viewMode === 'split' ? 'default' : 'default'}
                        showOwner
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to find more cars
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Map */}
          {(viewMode === 'map' || viewMode === 'split') && (
            <div className={`${viewMode === 'map' ? 'w-full' : 'hidden lg:block lg:w-1/2'} h-[calc(100vh-180px)] sticky top-36`}>
              <CarMap
                cars={mapCars}
                selectedCarId={selectedCarId}
                onCarSelect={(id) => router.push(`/cars/${id}`)}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CarListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CarListingContent />
    </Suspense>
  )
}
