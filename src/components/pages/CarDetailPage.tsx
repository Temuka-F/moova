'use client'

import { useState } from 'react'
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
  Clock,
  Phone,
  Navigation,
  Loader2
} from 'lucide-react'
import { format, differenceInDays, addDays } from 'date-fns'
import { getCarById, getSimilarCars, MapCar } from '@/lib/map-cars'
import { useAuth } from '@/hooks/useAuth'
import { showLoginRequired, showComingSoon } from '@/lib/toast-helpers'

interface CarDetailPageProps {
  carId: string
}

// Similar car card component
function SimilarCarCard({ car }: { car: MapCar }) {
  return (
    <Link 
      href={`/cars/${car.id}`}
      className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="relative h-36 bg-gray-100">
        <Image
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="256px"
        />
        {car.isWinterReady && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full flex items-center gap-1">
            <Snowflake className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">{car.make} {car.model}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{car.rating}</span>
          <span>·</span>
          <span>{car.city}</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-bold text-gray-900">{car.price}₾</span>
          <span className="text-sm text-gray-500">/day</span>
        </div>
      </div>
    </Link>
  )
}

export function CarDetailPage({ carId }: CarDetailPageProps) {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, requireAuth } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get car data from map-cars
  const car = getCarById(carId)

  // If car not found, show error
  if (!car) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <Car className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Car not found</h1>
        <p className="text-muted-foreground mb-6">This car may no longer be available.</p>
        <Button asChild>
          <Link href="/">Browse available cars</Link>
        </Button>
      </div>
    )
  }

  // Get similar cars
  const similarCars = getSimilarCars(car, 4)

  const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) : 0
  const subtotal = totalDays * car.price
  const serviceFee = Math.round(subtotal * 0.15)
  const totalPrice = subtotal + serviceFee

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))
  }

  const handleBook = async () => {
    // Auth guard - require login to book
    if (!requireAuth('book this car')) {
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select your dates')
      return
    }
    
    setIsBooking(true)
    // Simulate booking
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (car.isInstantBook) {
      toast.success('Booking confirmed! Check your email for details.')
      router.push('/dashboard/bookings')
    } else {
      toast.success('Booking request sent! The host will respond within 24 hours.')
      router.push('/dashboard/bookings')
    }
    setIsBooking(false)
  }

  const handleFavorite = () => {
    if (!requireAuth('save cars')) {
      return
    }
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleMessage = () => {
    if (!requireAuth('message the host')) {
      return
    }
    showComingSoon('Direct messaging')
  }

  const handleContactHost = () => {
    if (!requireAuth('contact the host')) {
      return
    }
    showComingSoon('Host contact')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${car.make} ${car.model} on Moova`,
        text: `Check out this ${car.make} ${car.model} for ₾${car.price}/day`,
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
      <div className="relative h-[45vh] md:h-[55vh] lg:h-[50vh] lg:mx-8 lg:mt-4 lg:rounded-3xl overflow-hidden bg-secondary">
        <Image
          src={car.images[currentImageIndex]}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Navigation Arrows */}
        {car.images.length > 1 && (
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
        {car.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {car.images.map((_, index) => (
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

        {/* Top Actions - minimum 44px touch targets */}
        <div className="absolute top-4 right-4 flex gap-2 lg:top-6 lg:right-6">
          <Button
            variant="ghost"
            size="icon"
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-lg ${
              isFavorited ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/90 hover:bg-white'
            }`}
            onClick={handleFavorite}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
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
          {car.isWinterReady && (
            <Badge className="bg-blue-500 text-sm shadow-lg">
              <Snowflake className="w-3.5 h-3.5 mr-1" />
              Winter Ready
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
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
                  <span className="font-semibold text-foreground">{car.rating}</span>
                  <span>({car.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{car.address}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this car</h2>
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
            </div>

            <Separator />

            {/* Host Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                  <AvatarImage src={car.owner.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {car.owner.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      Hosted by {car.owner.firstName}
                    </span>
                    {car.owner.isVerified && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{car.owner.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{car.owner.tripsCount} trips</span>
                    <span>•</span>
                    <span>Responds {car.owner.responseTime}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="hidden sm:flex rounded-full min-h-[44px]"
                onClick={handleMessage}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>

            <Separator />

            {/* Specs */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div>
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pickup Location</h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{car.address}</span>
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

            <Separator />

            {/* Similar Cars */}
            {similarCars.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Similar Cars</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                  {similarCars.map((similarCar) => (
                    <SimilarCarCard key={similarCar.id} car={similarCar} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-24 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gray-900 text-white p-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {car.price}₾
                  </span>
                  <span className="text-white/70">/day</span>
                </div>
                <div className="text-white/70 text-sm mt-1">
                  {car.pricePerHour}₾/hour available
                </div>
                <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{car.rating}</span>
                  <span>•</span>
                  <span>{car.reviewCount} reviews</span>
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
                        {car.price}₾ × {totalDays} days
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
              <span className="text-2xl font-bold">{car.price}₾</span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{car.rating}</span>
              <span>({car.reviewCount})</span>
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
              handleBook()
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
