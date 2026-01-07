'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CarCard } from '@/components/cars/car-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Search, SlidersHorizontal, MapPin, Car, Loader2 } from 'lucide-react'
import { GEORGIAN_CITIES, CAR_CATEGORIES, TRANSMISSIONS, FUEL_TYPES } from '@/types'

// Sample car data for display
const sampleCars = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    pricePerDay: 120,
    city: 'Tbilisi',
    transmission: 'AUTOMATIC',
    fuelType: 'HYBRID',
    seats: 5,
    rating: 4.9,
    reviewCount: 47,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format&fit=crop',
    host: { name: 'Giorgi M.', avatar: null },
  },
  {
    id: '2',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2022,
    pricePerDay: 200,
    city: 'Tbilisi',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    rating: 4.8,
    reviewCount: 32,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop',
    host: { name: 'Nino K.', avatar: null },
  },
  {
    id: '3',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    pricePerDay: 250,
    city: 'Batumi',
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    seats: 7,
    rating: 4.9,
    reviewCount: 28,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop',
    host: { name: 'Levan T.', avatar: null },
  },
  {
    id: '4',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    pricePerDay: 100,
    city: 'Kutaisi',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    rating: 4.7,
    reviewCount: 19,
    image: 'https://images.unsplash.com/photo-1633695610681-8477dcfd5c33?q=80&w=800&auto=format&fit=crop',
    host: { name: 'Ana S.', avatar: null },
  },
  {
    id: '5',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2021,
    pricePerDay: 80,
    city: 'Tbilisi',
    transmission: 'MANUAL',
    fuelType: 'PETROL',
    seats: 5,
    rating: 4.6,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?q=80&w=800&auto=format&fit=crop',
    host: { name: 'Dato G.', avatar: null },
  },
  {
    id: '6',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    pricePerDay: 180,
    city: 'Tbilisi',
    transmission: 'AUTOMATIC',
    fuelType: 'ELECTRIC',
    seats: 5,
    rating: 5.0,
    reviewCount: 12,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop',
    host: { name: 'Irakli B.', avatar: null },
  },
]

function CarsContent() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState(sampleCars)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    priceRange: [0, 500],
    transmission: '',
    fuelType: '',
    category: '',
  })

  const filteredCars = cars.filter(car => {
    if (filters.city && car.city !== filters.city) return false
    if (car.pricePerDay < filters.priceRange[0] || car.pricePerDay > filters.priceRange[1]) return false
    if (filters.transmission && car.transmission !== filters.transmission) return false
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false
    return true
  })

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* City */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Location</Label>
        <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All cities</SelectItem>
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
            ₾{filters.priceRange[0]} - ₾{filters.priceRange[1]}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
          min={0}
          max={500}
          step={10}
        />
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Transmission</Label>
        <Select value={filters.transmission} onValueChange={(value) => setFilters({ ...filters, transmission: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            {TRANSMISSIONS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Fuel type</Label>
        <Select value={filters.fuelType} onValueChange={(value) => setFilters({ ...filters, fuelType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            {FUEL_TYPES.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setFilters({ city: '', priceRange: [0, 500], transmission: '', fuelType: '', category: '' })}
      >
        Clear filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Available cars</h1>
            <p className="text-muted-foreground mt-1">
              {filteredCars.length} cars found {filters.city && `in ${filters.city}`}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-24 border border-border">
              <h2 className="font-semibold mb-6">Filters</h2>
              <FilterPanel />
            </div>
          </div>

          {/* Cars Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find more cars
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ city: '', priceRange: [0, 500], transmission: '', fuelType: '', category: '' })}
                >
                  Clear all filters
                </Button>
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
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CarsContent />
    </Suspense>
  )
}
