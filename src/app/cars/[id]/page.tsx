'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  Clock,
  CalendarDays,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react'
import { format, differenceInDays, addDays } from 'date-fns'
import { formatPrice } from '@/lib/flitt'
import { getCarById, DUMMY_REVIEWS, DUMMY_USERS } from '@/lib/dummy-data'

// Dynamic map import
const MiniCarMap = dynamic(
  () => import('@/components/map/car-map').then((mod) => mod.MiniCarMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-xl" /> }
)

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  // Get car data
  const car = getCarById(id)

  // If car not found, show error
  if (!car) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <Car className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Car not found</h1>
        <p className="text-muted-foreground mb-6">This car may no longer be available.</p>
        <Button asChild>
          <Link href="/cars">Browse available cars</Link>
        </Button>
      </div>
    )
  }

  const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) : 0
  const subtotal = totalDays * car.pricePerDay
  const serviceFee = Math.round(subtotal * 0.15)
  const totalPrice = subtotal + serviceFee

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))
  }

  const handleBook = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select your dates')
      return
    }
    
    setIsBooking(true)
    // Simulate booking
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (car.isInstantBook) {
      toast.success('Booking confirmed! Check your email for details.')
      router.push('/dashboard')
    } else {
      toast.success('Booking request sent! The host will respond within 24 hours.')
      router.push('/dashboard')
    }
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

  // Get all reviews for this car
  const carReviews = car.reviews || []

  return (
    <div className="min-h-screen pt-16 pb-24 lg:pb-8 bg-background">
      {/* Back Button - Mobile */}
      <div className="lg:hidden fixed top-20 left-4 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="w-10 h-10 rounded-full shadow-lg bg-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[45vh] md:h-[55vh] bg-secondary">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${car.images[currentImageIndex]?.url}')` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
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

        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-full shadow-lg ${
              isFavorited ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/90 hover:bg-white'
            }`}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {car.isInstantBook && (
            <Badge className="bg-primary text-sm shadow-lg">
              <Zap className="w-3.5 h-3.5 mr-1" />
              Instant Book
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
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {car.make} {car.model}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{car.rating}</span>
                  <span>({car.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{car.city}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Host Info */}
            <div className="flex items-center justify-between">
              <Link href={`/hosts/${car.owner?.id}`} className="flex items-center gap-4 group">
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                  <AvatarImage src={car.owner?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {car.owner?.firstName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                      Hosted by {car.owner?.firstName}
                    </span>
                    {car.owner?.verificationStatus === 'VERIFIED' && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{car.owner?.tripsCount} trips</span>
                    <span>•</span>
                    <span>{car.owner?.responseRate}% response rate</span>
                    <span>•</span>
                    <span>{car.owner?.responseTime}</span>
                  </div>
                </div>
              </Link>
              <Button variant="outline" className="hidden sm:flex rounded-full">
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
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <p className="text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 inline mr-1" />
                {car.address}, {car.city}
              </p>
              <div className="h-48 rounded-xl overflow-hidden">
                <MiniCarMap latitude={car.latitude} longitude={car.longitude} className="w-full h-full" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Exact address provided after booking is confirmed
              </p>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Reviews ({car.reviewCount})
                </h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-semibold">{car.rating}</span>
                </div>
              </div>
              
              {carReviews.length > 0 ? (
                <div className="space-y-6">
                  {carReviews.map((review: any) => (
                    <div key={review.id} className="flex gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.reviewer?.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {review.reviewer?.firstName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {review.reviewer?.firstName} {review.reviewer?.lastName?.charAt(0)}.
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No reviews yet. Be the first to rent this car!</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-24 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-secondary text-white p-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    ₾{car.pricePerDay}
                  </span>
                  <span className="text-white/70">/day</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                  <Star className="w-4 h-4 fill-white" />
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
                            {startDate ? format(startDate, 'MMM d') : 'Select'}
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
                            {endDate ? format(endDate, 'MMM d') : 'Select'}
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
                        ₾{car.pricePerDay} × {totalDays} days
                      </span>
                      <span>₾{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>₾{serviceFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₾{totalPrice}</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg rounded-xl glow-primary"
                  disabled={!startDate || !endDate || isBooking}
                  onClick={handleBook}
                >
                  {isBooking ? (
                    'Processing...'
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
                    Security deposit of ₾{car.securityDeposit} required. Refunded after trip.
                  </span>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Insurance included</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 lg:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">₾{car.pricePerDay}</span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>{car.rating}</span>
              <span>({car.reviewCount})</span>
            </div>
          </div>
          <Button 
            size="lg"
            className="h-12 px-8 rounded-xl"
            onClick={() => {
              if (!startDate) setStartDate(addDays(new Date(), 1))
              if (!endDate) setEndDate(addDays(new Date(), 4))
              handleBook()
            }}
          >
            {car.isInstantBook ? (
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
