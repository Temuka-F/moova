'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { 
  MapPin, 
  CalendarDays, 
  Search, 
  Car, 
  Fuel, 
  Users,
  Star,
  ChevronRight,
  Zap,
  Filter,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import { GEORGIAN_CITIES } from '@/types'

// Featured cars data
const featuredCars = [
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
    isInstantBook: true,
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
    isInstantBook: true,
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
    isInstantBook: false,
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
    isInstantBook: true,
  },
  {
    id: '5',
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
    isInstantBook: true,
  },
  {
    id: '6',
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
    isInstantBook: true,
  },
]

const carTypes = [
  { id: 'all', name: 'All', icon: '🚗' },
  { id: 'economy', name: 'Economy', icon: '💰' },
  { id: 'suv', name: 'SUV', icon: '🚙' },
  { id: 'luxury', name: 'Luxury', icon: '✨' },
  { id: 'electric', name: 'Electric', icon: '⚡' },
  { id: 'sports', name: 'Sports', icon: '🏎️' },
]

export default function HomePage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 1))
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 4))
  const [priceRange, setPriceRange] = useState([0, 300])
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (startDate) params.set('startDate', startDate.toISOString())
    if (endDate) params.set('endDate', endDate.toISOString())
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < 300) params.set('maxPrice', priceRange[1].toString())
    if (selectedType !== 'all') params.set('category', selectedType.toUpperCase())
    router.push(`/cars?${params.toString()}`)
  }

  const filteredCars = featuredCars.filter(car => {
    if (city && car.city !== city) return false
    if (car.pricePerDay < priceRange[0] || car.pricePerDay > priceRange[1]) return false
    return true
  })

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Search Header */}
      <div className="bg-secondary text-white">
        <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">
              Find your perfect ride
            </h1>
            <p className="text-white/70 text-sm md:text-base mb-6">
              500+ cars available across Georgia
            </p>

            {/* Main Search Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 text-foreground">
              {/* Location & Dates - Always visible */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {/* City Selection */}
                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm font-medium text-muted-foreground">Pick-up location</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12 md:h-14 text-base">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="Select city" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {GEORGIAN_CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm font-medium text-muted-foreground">Pick-up date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-12 md:h-14 w-full justify-start text-base font-normal">
                        <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                        {format(startDate, 'EEE, MMM d')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(d) => d && setStartDate(d)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm font-medium text-muted-foreground">Return date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-12 md:h-14 w-full justify-start text-base font-normal">
                        <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                        {format(endDate, 'EEE, MMM d')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(d) => d && setEndDate(d)}
                        disabled={(date) => date <= startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Toggle Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Hide filters' : 'More filters'}
              </button>

              {/* Expandable Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Price per day</Label>
                      <span className="text-sm text-muted-foreground">
                        ₾{priceRange[0]} - ₾{priceRange[1]}+
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                size="lg" 
                className="w-full h-12 md:h-14 mt-4 text-base md:text-lg font-semibold rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Search {filteredCars.length} available cars
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Car Type Quick Filters */}
      <div className="sticky top-14 md:top-16 z-30 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
            {carTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Cars Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold">
              {city ? `Cars in ${city}` : 'Available now'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredCars.length} cars ready for your trip
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cars">
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCars.map((car) => (
            <Link 
              key={car.id} 
              href={`/cars/${car.id}`}
              className="group bg-card rounded-xl md:rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Car Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {car.isInstantBook && (
                    <Badge className="bg-primary text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Instant
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white rounded-full px-2 py-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{car.rating}</span>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 right-3 bg-white rounded-lg px-3 py-1.5 shadow-lg">
                  <span className="text-lg font-bold text-primary">₾{car.pricePerDay}</span>
                  <span className="text-xs text-muted-foreground">/day</span>
                </div>
              </div>

              {/* Car Info */}
              <div className="p-3 md:p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">{car.year}</p>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{car.seats}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5" />
                    <span>{car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{car.city}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/cars">
              Browse all cars
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Cars available</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary">20+</p>
              <p className="text-sm text-muted-foreground">Cities</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary">4.8</p>
              <p className="text-sm text-muted-foreground">Avg rating</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Become a Host CTA */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">Have a car? Start earning</h3>
              <p className="text-white/80 text-sm md:text-base">
                List your car and earn up to ₾800/month
              </p>
            </div>
            <Button variant="secondary" size="lg" asChild className="w-full md:w-auto">
              <Link href="/list-your-car">
                <Sparkles className="w-4 h-4 mr-2" />
                List your car
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
