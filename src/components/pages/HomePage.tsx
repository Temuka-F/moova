'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CarCard } from '@/components/cars/CarCard'
import {
  MapPin,
  CalendarDays,
  Search,
  Car,
  Shield,
  Users,
  Star,
  ChevronRight,
  Zap,
  Sparkles,
  Clock,
  MapPinned,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import { GEORGIAN_CITIES } from '@/types'

// Dynamically import map to avoid SSR issues
const CarMap = dynamic(
  () => import('@/components/map/CarMapView').then((mod) => mod.CarMap),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-2xl" />
  }
)

interface FeaturedCar {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  city: string
  category: string
  transmission: string
  fuelType: string
  seats: number
  isInstantBook: boolean
  latitude: number
  longitude: number
  images: { url: string }[]
  owner: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
  _count: {
    reviews: number
    bookings: number
  }
}

interface Stats {
  totalCars: number
  totalUsers: number
  totalHosts: number
  totalBookings: number
  avgRating: number
  cityStats: Record<string, number>
  categoryStats: Record<string, number>
  featuredCars: FeaturedCar[]
}

const defaultCarTypes = [
  { id: 'all', name: 'All Cars', icon: '🚗', count: 0 },
  { id: 'SEDAN', name: 'Sedan', icon: '🚙', count: 0 },
  { id: 'SUV', name: 'SUV', icon: '🚐', count: 0 },
  { id: 'LUXURY', name: 'Luxury', icon: '✨', count: 0 },
  { id: 'SPORTS', name: 'Sports', icon: '🏎️', count: 0 },
  { id: 'COMPACT', name: 'Compact', icon: '🚕', count: 0 },
]

interface ApiCar {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  city: string
  category: string
  transmission: string
  fuelType: string
  seats: number
  isInstantBook: boolean
  latitude: number
  longitude: number
  images: { url: string; isPrimary: boolean }[]
  owner: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
    verificationStatus: string
  }
  _count: {
    reviews: number
    bookings: number
  }
}

const defaultCities = [
  { name: 'Tbilisi', count: 0, image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400' },
  { name: 'Batumi', count: 0, image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400' },
  { name: 'Kutaisi', count: 0, image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Gudauri', count: 0, image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400' },
]

export function HomePage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 1))
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 4))
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)
  // Check for view param to control map visibility
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view')
  const [showMap, setShowMap] = useState(viewParam === 'map')

  useEffect(() => {
    const view = searchParams.get('view')
    if (view === 'map') setShowMap(true)
    if (view === 'list') setShowMap(false)
  }, [searchParams])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Build car types with counts
  const carTypes = defaultCarTypes.map(type => ({
    ...type,
    count: type.id === 'all'
      ? stats?.totalCars || 0
      : stats?.categoryStats?.[type.id] || 0,
  }))

  // Build cities with counts
  const cities = defaultCities.map(c => ({
    ...c,
    count: stats?.cityStats?.[c.name] || 0,
  }))

  const [cars, setCars] = useState<ApiCar[]>([])
  const [totalCars, setTotalCars] = useState(0)
  const [loadingCars, setLoadingCars] = useState(true)

  // Fetch cars based on current filters
  const fetchCars = async () => {
    setLoadingCars(true)
    try {
      const params = new URLSearchParams()
      if (city) params.set('city', city)
      if (startDate) params.set('startDate', startDate.toISOString())
      if (endDate) params.set('endDate', endDate.toISOString())
      if (selectedType !== 'all') params.set('category', selectedType)

      const res = await fetch(`/api/cars?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCars(data.cars || [])
        setTotalCars(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoadingCars(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [city, selectedType, startDate, endDate])

  // Prepare cars for map display
  const mapCars = cars.map(car => ({
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    pricePerDay: car.pricePerDay,
    latitude: car.latitude,
    longitude: car.longitude,
    rating: 4.5,
    isInstantBook: car.isInstantBook,
    image: car.images?.[0]?.url || '',
  }))

  const handleSearch = () => {
    fetchCars()
    // Scroll to cars section
    const carsSection = document.getElementById('cars-section')
    if (carsSection) {
      carsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Hero Section */}
      <section className="relative bg-secondary text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-32 md:pb-16 relative">
          <div className="max-w-5xl mx-auto">
            {/* Hero Text */}
            <div className="text-center mb-8 md:mb-12">
              <Badge className="bg-primary/20 text-primary border-0 mb-4 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Georgia&apos;s #1 Car Sharing Platform
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                Drive the car you want,
                <br />
                <span className="text-gradient-animated">when you want it</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
                Skip the rental counter. Book instantly from {loading ? '...' : `${stats?.totalCars || 0}+`} cars
                shared by local hosts in Tbilisi, Batumi, and beyond.
              </p>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 text-foreground max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                {/* City Selection */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-14 text-base border-2 border-border rounded-xl focus:border-primary">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <SelectValue placeholder="Where to?" />
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
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pick-up</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-14 w-full justify-start text-base font-normal border-2 rounded-xl">
                        <CalendarDays className="w-5 h-5 mr-2 text-primary" />
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
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Return</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-14 w-full justify-start text-base font-normal border-2 rounded-xl">
                        <CalendarDays className="w-5 h-5 mr-2 text-primary" />
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

                {/* Search Button */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-transparent">Search</Label>
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="w-full h-14 text-base font-semibold rounded-xl glow-primary"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-6 md:gap-12 mt-8 text-center">
              <div>
                <p className="text-2xl md:text-3xl font-bold">
                  {loading ? '...' : `${stats?.totalCars || 0}+`}
                </p>
                <p className="text-xs md:text-sm text-white/60">Cars</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-2xl md:text-3xl font-bold">
                  {loading ? '...' : stats?.totalHosts || 0}
                </p>
                <p className="text-xs md:text-sm text-white/60">Hosts</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-2xl md:text-3xl font-bold">
                  {loading ? '...' : (stats?.avgRating || 4.9).toFixed(1)}
                </p>
                <p className="text-xs md:text-sm text-white/60">Rating</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-2xl md:text-3xl font-bold">24/7</p>
                <p className="text-xs md:text-sm text-white/60">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Type Quick Filters */}
      <section className="sticky top-16 z-30 bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto no-scrollbar">
            {carTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all btn-press ${selectedType === type.id
                  ? 'bg-secondary text-white shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
              >
                <span>{type.icon}</span>
                <span>{type.name}</span>
                <span className={`text-xs ${selectedType === type.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                  ({type.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Cars Section */}
      <section id="cars-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {city ? `Cars in ${city}` : 'Cars near you'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {totalCars} cars available for your dates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showMap ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="hidden md:flex"
            >
              <MapPinned className="w-4 h-4 mr-2" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Cars Grid */}
          <div className={showMap ? '' : 'lg:col-span-2'}>
            {loadingCars ? (
              <div className={`grid gap-4 ${showMap ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {[1, 2, 3, 4].map(i => (
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
            ) : cars.length > 0 ? (
              <div className={`grid gap-4 ${showMap ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {cars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={{
                      id: car.id,
                      make: car.make,
                      model: car.model,
                      year: car.year,
                      pricePerDay: car.pricePerDay,
                      city: car.city,
                      rating: 4.5,
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
                    variant={showMap ? 'horizontal' : 'default'}
                    showOwner
                    startDate={startDate}
                    endDate={endDate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No cars available</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to list your car on Moova!
                </p>
                <Button asChild className="rounded-full">
                  <Link href="/list-your-car">List Your Car</Link>
                </Button>
              </div>
            )}

            {cars.length > 0 && cars.length < totalCars && (
              <div className="mt-6 text-center">
                <Button variant="outline" size="lg" className="rounded-full" onClick={() => fetchCars()}>
                  Load More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Map */}
          {showMap && (
            <div className="hidden lg:block h-[600px] sticky top-32">
              <CarMap
                cars={mapCars}
                selectedCarId={selectedCarId}
                onCarSelect={(id) => {
                  setSelectedCarId(id)
                  const params = new URLSearchParams()
                  if (startDate) params.set('startDate', startDate.toISOString())
                  if (endDate) params.set('endDate', endDate.toISOString())
                  const queryString = params.toString()
                  router.push(`/cars/${id}${queryString ? `?${queryString}` : ''}`)
                }}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Explore by City</h2>
            <p className="text-muted-foreground">Find the perfect car wherever you&apos;re headed</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((c) => (
              <Link
                key={c.name}
                href={`/cars?city=${c.name}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <p className="text-sm text-white/80">{c.count} cars</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">How Moova Works</h2>
            <p className="text-muted-foreground">Get on the road in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Find your car</h3>
              <p className="text-muted-foreground text-sm">
                Search by location and dates. Filter by type, price, and features to find your perfect match.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Book instantly</h3>
              <p className="text-muted-foreground text-sm">
                Book cars marked with ⚡ instantly, or send a request. Secure payment through the app.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Hit the road</h3>
              <p className="text-muted-foreground text-sm">
                Meet your host, pick up the keys, and enjoy your trip. Return the car when you&apos;re done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-secondary text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div>
              <Badge className="bg-primary/20 text-primary border-0 mb-4">
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Your safety matters
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Drive with confidence
              </h2>
              <p className="text-white/70 mb-6">
                Every trip on Moova is protected. We verify all hosts and renters,
                and provide comprehensive insurance coverage for peace of mind.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>All hosts verified with ID and documents</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Insurance included in every booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>24/7 roadside assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Secure payments through the platform</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-6">
                <Users className="w-8 h-8 text-primary mb-3" />
                <p className="text-2xl font-bold">
                  {loading ? '...' : `${stats?.totalUsers || 0}+`}
                </p>
                <p className="text-sm text-white/60">Verified Users</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <Star className="w-8 h-8 text-primary mb-3" />
                <p className="text-2xl font-bold">
                  {loading ? '...' : (stats?.avgRating || 4.9).toFixed(1)}
                </p>
                <p className="text-sm text-white/60">Average Rating</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <Shield className="w-8 h-8 text-primary mb-3" />
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-white/60">Trips Insured</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <p className="text-2xl font-bold">&lt;1hr</p>
                <p className="text-sm text-white/60">Avg Response</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Host CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <Badge className="bg-primary/20 text-primary border-0 mb-4">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Earn with your car
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Turn your car into a money machine
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join {loading ? '...' : stats?.totalHosts || 0} hosts earning up to ₾1,500/month
              by sharing their cars on Moova. Free to list, easy to manage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="rounded-full px-8">
                <Link href="/list-your-car">
                  <Sparkles className="w-4 h-4 mr-2" />
                  List your car
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full px-8">
                <Link href="/dashboard">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
