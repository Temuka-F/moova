'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CarCard } from '@/components/cars/car-card'
import { 
  SlidersHorizontal, 
  MapPin, 
  X,
  Car,
} from 'lucide-react'
import { GEORGIAN_CITIES } from '@/types'
import type { CarWithOwner, CarCategory, Transmission, FuelType } from '@/types'

const categories: { value: CarCategory; label: string }[] = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'COMPACT', label: 'Compact' },
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'VAN', label: 'Van' },
  { value: 'MINIVAN', label: 'Minivan' },
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'CONVERTIBLE', label: 'Convertible' },
]

function CarsPageContent() {
  const searchParams = useSearchParams()
  
  const [cars, setCars] = useState<CarWithOwner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  // Filter states
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [category, setCategory] = useState<CarCategory | ''>('')
  const [transmission, setTransmission] = useState<Transmission | ''>('')
  const [fuelType, setFuelType] = useState<FuelType | ''>('')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [seats, setSeats] = useState<number | null>(null)
  const [instantBookOnly, setInstantBookOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>('newest')

  // Active filters count
  const activeFiltersCount = [
    city,
    category,
    transmission,
    fuelType,
    priceRange[0] > 0 || priceRange[1] < 500,
    seats,
    instantBookOnly,
  ].filter(Boolean).length

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (city) params.set('city', city)
        if (category) params.set('category', category)
        if (transmission) params.set('transmission', transmission)
        if (fuelType) params.set('fuelType', fuelType)
        if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
        if (priceRange[1] < 500) params.set('maxPrice', priceRange[1].toString())
        if (seats) params.set('seats', seats.toString())
        if (instantBookOnly) params.set('isInstantBook', 'true')
        if (sortBy) params.set('sortBy', sortBy)

        const response = await fetch(`/api/cars?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setCars(data.cars || [])
        }
      } catch (error) {
        console.error('Error fetching cars:', error)
        setCars([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCars()
  }, [city, category, transmission, fuelType, priceRange, seats, instantBookOnly, sortBy])

  const clearFilters = () => {
    setCity('')
    setCategory('')
    setTransmission('')
    setFuelType('')
    setPriceRange([0, 500])
    setSeats(null)
    setInstantBookOnly(false)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All locations</SelectItem>
            {GEORGIAN_CITIES.map((cityName) => (
              <SelectItem key={cityName} value={cityName}>
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Car Type</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as CarCategory)}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <Label>Transmission</Label>
        <Select value={transmission} onValueChange={(v) => setTransmission(v as Transmission)}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="AUTOMATIC">Automatic</SelectItem>
            <SelectItem value="MANUAL">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <Label>Fuel Type</Label>
        <Select value={fuelType} onValueChange={(v) => setFuelType(v as FuelType)}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="PETROL">Petrol</SelectItem>
            <SelectItem value="DIESEL">Diesel</SelectItem>
            <SelectItem value="HYBRID">Hybrid</SelectItem>
            <SelectItem value="ELECTRIC">Electric</SelectItem>
            <SelectItem value="LPG">LPG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Price per day</Label>
          <span className="text-sm text-muted-foreground">
            ₾{priceRange[0]} - ₾{priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className="w-full"
        />
      </div>

      {/* Seats */}
      <div className="space-y-2">
        <Label>Minimum Seats</Label>
        <Select 
          value={seats?.toString() || ''} 
          onValueChange={(v) => setSeats(v ? parseInt(v) : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
            <SelectItem value="7">7+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Instant Book */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="instantBook"
          checked={instantBookOnly}
          onCheckedChange={(checked) => setInstantBookOnly(checked as boolean)}
        />
        <label
          htmlFor="instantBook"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Instant Book only
        </label>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {city ? `Cars in ${city}` : 'Browse All Cars'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {cars.length} cars available
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filters */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {city && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="w-3 h-3" />
                {city}
                <button onClick={() => setCity('')} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {category && (
              <Badge variant="secondary" className="gap-1">
                {category}
                <button onClick={() => setCategory('')} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {instantBookOnly && (
              <Badge variant="secondary" className="gap-1">
                Instant Book
                <button onClick={() => setInstantBookOnly(false)} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Cars Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-16">
                <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search in a different area.
                </p>
                <Button onClick={clearFilters}>Clear filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center">Loading...</div>}>
      <CarsPageContent />
    </Suspense>
  )
}
