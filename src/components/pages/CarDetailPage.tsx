'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Users, 
  Fuel, 
  Gauge,
  Shield,
  Check,
  MessageCircle,
  Zap,
  Car,
  Info,
  CheckCircle2,
  ArrowLeft,
  Snowflake,
  Phone,
  Navigation,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { format, differenceInDays, addDays } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'

interface CarDetailPageProps {
  carId: string
}

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
  createdAt: string
  responseRate: number | null
  responseTime: string | null
  bio: string | null
  _count?: {
    cars: number
    reviewsReceived: number
  }
}

interface CarReview {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  reviewer: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
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
  mileageLimit: number | null
  images: CarImage[]
  owner: CarOwner
  reviews: CarReview[]
  _count: {
    bookings: number
    reviews: number
  }
}

function CarDetailSkeleton() {
  return (
    <div className="min-h-screen pb-24 lg:pb-8 bg-background">
      <div className="hidden lg:block container mx-auto px-8 pt-6">
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[45vh] md:h-[55vh] lg:h-[50vh] lg:mx-8 lg:mt-4 lg:rounded-3xl" />
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex gap-2 mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-3/4 mb-3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CarDetailPage({ carId }: CarDetailPageProps) {
  const router = useRouter()
  const { isAuthenticated, requireAuth } = useAuth()
  const [car, setCar] = useState<ApiCar | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [isFavoriting, setIsFavoriting] = useState(false)

  const fetchCar = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/cars/${carId}`)
      
      if (!res.ok) {
        let errorMessage = 'Failed to fetch car'
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use status-based message
          if (res.status === 404) {
            errorMessage = 'Car not found'
          } else if (res.status === 403) {
            errorMessage = 'You do not have permission to view this car'
          } else if (res.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          }
        }
        setError(errorMessage)
        setLoading(false)
        return
      }
      
      const data = await res.json()
      
      // Validate car data structure
      if (!data || !data.id) {
        setError('Invalid car data received')
        setLoading(false)
        return
      }
      
      // Ensure required fields have defaults
      const carData: ApiCar = {
        ...data,
        images: data.images || [],
        reviews: data.reviews || [],
        features: data.features || [],
        owner: data.owner || {
          id: '',
          firstName: 'Unknown',
          lastName: 'Owner',
          avatarUrl: null,
          verificationStatus: 'UNVERIFIED',
          createdAt: new Date().toISOString(),
          responseRate: null,
          responseTime: null,
          bio: null,
          _count: { cars: 0, reviewsReceived: 0 },
        },
        _count: data._count || { bookings: 0, reviews: 0 },
      }
      
      setCar(carData)
      
      // Check if favorited
      if (isAuthenticated) {
        try {
          const favRes = await fetch(`/api/favorites?carId=${carId}`)
          if (favRes.ok) {
            const favData = await favRes.json()
            setIsFavorited(favData.isFavorited || false)
          }
        } catch {
          // Ignore favorite check errors
        }
      }
    } catch (err: any) {
      console.error('Error fetching car:', err)
      setError(err.message || 'Failed to load car. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (carId) {
      fetchCar()
    }
  }, [carId, isAuthenticated])

  if (loading) {
    return <CarDetailSkeleton />
  }

  if (error || !car) {
    return (
      <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-center">{error || 'Car not found'}</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          {error === 'Car not found' 
            ? 'This car may no longer be available or the link is invalid.'
            : 'We encountered an error loading this car. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={fetchCar} variant="outline">
            Try Again
          </Button>
          <Button asChild>
            <Link href="/cars">Browse Available Cars</Link>
          </Button>
        </div>
      </div>
    )
  }

  const images = car.images.length > 0 ? car.images.map(img => img.url) : ['/car-placeholder.svg']
  const avgRating = car.reviews.length > 0 
    ? car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length 
    : 0
  
  const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) : 0
  const subtotal = totalDays * car.pricePerDay
  const serviceFee = Math.round(subtotal * 0.15)
  const totalPrice = subtotal + serviceFee

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleBook = async () => {
    if (!requireAuth('book this car')) {
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select your dates')
      return
    }

    if (totalDays < 1) {
      toast.error('Please select at least 1 day')
      return
    }
    
    setIsBooking(true)
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          pickupLocation: car.address,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create booking')
      }

      const booking = await res.json()
      
      if (car.isInstantBook) {
        toast.success('Booking confirmed! Check your email for details.')
      } else {
        toast.success('Booking request sent! The host will respond within 24 hours.')
      }
      
      router.push('/dashboard/bookings')
    } catch (err: any) {
      toast.error(err.message || 'Failed to create booking')
    } finally {
      setIsBooking(false)
    }
  }

  const handleFavorite = async () => {
    if (!requireAuth('save cars')) {
      return
    }
    
    setIsFavoriting(true)
    
    try {
      if (isFavorited) {
        const res = await fetch(`/api/favorites?carId=${car.id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error('Failed to remove favorite')
        setIsFavorited(false)
        toast.success('Removed from favorites')
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carId: car.id }),
        })
        if (!res.ok) throw new Error('Failed to add favorite')
        setIsFavorited(true)
        toast.success('Added to favorites')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update favorites')
    } finally {
      setIsFavoriting(false)
    }
  }

  const handleMessage = () => {
    if (!requireAuth('message the host')) {
      return
    }
    router.push(`/dashboard/messages?userId=${car.owner.id}`)
  }

  const handleContactHost = () => {
    if (!requireAuth('contact the host')) {
      return
    }
    router.push(`/dashboard/messages?userId=${car.owner.id}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${car.make} ${car.model} on Moova`,
        text: `Check out this ${car.make} ${car.model} for ₾${car.pricePerDay}/day`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8 bg-background">
      {/* Back Button - Mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="w-10 h-10 rounded-full shadow-lg bg-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Desktop Back link */}
      <div className="hidden lg:block container mx-auto px-8 pt-6">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[50vh] lg:mx-8 lg:mt-4 lg:rounded-3xl overflow-hidden bg-secondary">
        <Image
          src={images[currentImageIndex]}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={handleNextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex gap-2 lg:top-6 lg:right-6">
          <Button
            variant="ghost"
            size="icon"
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-lg ${
              isFavorited ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/90 hover:bg-white'
            }`}
            onClick={handleFavorite}
            disabled={isFavoriting}
          >
            {isFavoriting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/90 hover:bg-white shadow-lg"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 flex flex-wrap gap-2">
          {car.isInstantBook && (
            <Badge className="bg-emerald-500 text-sm shadow-lg">
              <Zap className="w-3.5 h-3.5 mr-1" />
              Instant Book
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-8 pb-24 lg:pb-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{car.category}</Badge>
                <Badge variant="outline">{car.year}</Badge>
                <Badge variant="outline">{car.color}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {car.make} {car.model}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{avgRating.toFixed(1)}</span>
                  <span>({car._count.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{car.city}, {car.address}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Host Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-primary/20 shrink-0">
                  <AvatarImage src={car.owner.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-base sm:text-lg">
                    {car.owner.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-base sm:text-lg">
                      Hosted by {car.owner.firstName}
                    </span>
                    {car.owner.verificationStatus === 'VERIFIED' && (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span>{car.owner._count?.cars || 0} cars</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Member since {new Date(car.owner.createdAt).getFullYear()}</span>
                    {car.owner.responseTime && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>Responds {car.owner.responseTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto rounded-full min-h-[44px]"
                onClick={handleMessage}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>

            <Separator />

            {/* Specs */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Users className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium">{car.seats} Seats</div>
                    <div className="text-sm text-muted-foreground">Passengers</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Gauge className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium">{car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</div>
                    <div className="text-sm text-muted-foreground">Transmission</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Fuel className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium">{car.fuelType}</div>
                    <div className="text-sm text-muted-foreground">Fuel Type</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Car className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium">{car.doors} Doors</div>
                    <div className="text-sm text-muted-foreground">Vehicle</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            {car.features.length > 0 && (
              <>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pickup Location</h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{car.city}, {car.address}</span>
              </div>
              <div className="h-48 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Navigation className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Map view available after booking</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Exact address provided after booking is confirmed
              </p>
            </div>

            {/* Reviews */}
            {car.reviews.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Reviews ({car._count.reviews})
                  </h2>
                  <div className="space-y-4">
                    {car.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.reviewer.avatarUrl || undefined} />
                            <AvatarFallback>
                              {review.reviewer.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {review.reviewer.firstName} {review.reviewer.lastName[0]}.
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{review.rating}</span>
                              <span>•</span>
                              <span>{format(new Date(review.createdAt), 'MMM yyyy')}</span>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Booking Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-24 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gray-900 text-white p-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {car.pricePerDay}₾
                  </span>
                  <span className="text-white/70">/day</span>
                </div>
                {car.pricePerHour && (
                  <div className="text-white/70 text-sm mt-1">
                    {car.pricePerHour}₾/hour available
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span>•</span>
                  <span>{car._count.reviews} reviews</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-16 justify-start font-normal rounded-xl border-2">
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground uppercase">Pick-up</div>
                          <div className="font-medium">
                            {startDate ? format(startDate, 'MMM d') : 'Select date'}
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-16 justify-start font-normal rounded-xl border-2">
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground uppercase">Return</div>
                          <div className="font-medium">
                            {endDate ? format(endDate, 'MMM d') : 'Select date'}
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date <= (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Price Breakdown */}
                {totalDays > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {car.pricePerDay}₾ × {totalDays} days
                      </span>
                      <span>{subtotal}₾</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>{serviceFee}₾</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{totalPrice}₾</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  size="lg" 
                  className="w-full h-14 min-h-[56px] text-lg rounded-xl bg-black hover:bg-gray-900"
                  disabled={!startDate || !endDate || isBooking}
                  onClick={handleBook}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : car.isInstantBook ? (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Book Instantly
                    </>
                  ) : (
                    'Request to Book'
                  )}
                </Button>

                {/* Security Deposit Notice */}
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl text-sm">
                  <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Security deposit of {car.securityDeposit}₾ required. Refunded after trip.
                    {car.mileageLimit && ` ${car.mileageLimit}km/day limit.`}
                  </span>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Insurance included</span>
                </div>

                {/* Contact host */}
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl min-h-[44px]"
                  onClick={handleContactHost}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Host
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 lg:hidden z-40 safe-pb">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{car.pricePerDay}₾</span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{avgRating.toFixed(1)}</span>
              <span>({car._count.reviews})</span>
            </div>
          </div>
          <Button 
            size="lg"
            className="h-12 min-h-[48px] px-8 rounded-xl bg-black hover:bg-gray-900"
            disabled={isBooking}
            onClick={() => {
              if (!requireAuth('book this car')) return
              if (!startDate) setStartDate(addDays(new Date(), 1))
              if (!endDate) setEndDate(addDays(new Date(), 4))
              // Delay to allow state update
              setTimeout(handleBook, 100)
            }}
          >
            {isBooking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : car.isInstantBook ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Book Now
              </>
            ) : (
              'Request'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
