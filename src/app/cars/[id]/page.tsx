'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  Calendar as CalendarIcon,
  Shield,
  Check,
  MessageCircle,
  Zap,
  Car,
  Info
} from 'lucide-react'
import { format, differenceInDays, addDays } from 'date-fns'
import { formatPrice } from '@/lib/flitt'

// Mock car data - will be replaced with API call
const mockCar = {
  id: '1',
  make: 'BMW',
  model: 'X5',
  year: 2022,
  color: 'Black',
  transmission: 'AUTOMATIC' as const,
  fuelType: 'PETROL' as const,
  seats: 5,
  doors: 4,
  category: 'SUV' as const,
  features: ['GPS Navigation', 'Leather Seats', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Bluetooth', 'USB Port', 'Apple CarPlay'],
  hasAC: true,
  hasGPS: true,
  hasUSB: true,
  hasBluetooth: true,
  hasChildSeat: false,
  city: 'Tbilisi',
  address: 'Rustaveli Avenue 12',
  latitude: 41.7151,
  longitude: 44.8271,
  pricePerDay: 180,
  pricePerHour: 25,
  securityDeposit: 500,
  minRentalDays: 1,
  maxRentalDays: 30,
  mileageLimit: 200,
  extraMileageFee: 0.5,
  currentMileage: 25000,
  isInstantBook: true,
  description: `Experience luxury and performance with this stunning BMW X5. Perfect for both city driving and long road trips across Georgia's beautiful landscapes.

This 2022 model comes fully loaded with premium features including leather interior, panoramic sunroof, and advanced safety systems. The powerful engine delivers smooth acceleration while maintaining excellent fuel efficiency.

The car is meticulously maintained and cleaned before every rental. I'm a responsive host and happy to accommodate special requests.`,
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200', isPrimary: true },
    { id: '2', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200', isPrimary: false },
    { id: '3', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', isPrimary: false },
    { id: '4', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', isPrimary: false },
  ],
  owner: {
    id: '1',
    firstName: 'Giorgi',
    lastName: 'Beridze',
    avatarUrl: null,
    isVerified: true,
    createdAt: new Date('2023-01-15'),
    carsCount: 3,
    tripsCount: 47,
    responseRate: 98,
    responseTime: '< 1 hour',
  },
  reviews: [
    {
      id: '1',
      rating: 5,
      comment: 'Amazing car and great host! Giorgi was very helpful and flexible with pickup time.',
      createdAt: new Date('2024-01-10'),
      reviewer: { firstName: 'Ana', lastName: 'K.', avatarUrl: null },
    },
    {
      id: '2',
      rating: 5,
      comment: 'Perfect condition, clean and comfortable. Would definitely rent again!',
      createdAt: new Date('2024-01-05'),
      reviewer: { firstName: 'David', lastName: 'M.', avatarUrl: null },
    },
  ],
  averageRating: 4.9,
  totalReviews: 24,
}

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isFavorited, setIsFavorited] = useState(false)

  const car = mockCar // Will be replaced with API call using id

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

  const handleBook = () => {
    if (!startDate || !endDate) return
    router.push(`/cars/${id}/book?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Image Gallery */}
      <div className="relative h-[50vh] md:h-[60vh] bg-muted">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${car.images[currentImageIndex].url}')` }}
        />
        
        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          onClick={handlePrevImage}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          onClick={handleNextImage}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Image Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {car.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Image Thumbnails */}
        <div className="absolute bottom-6 right-6 hidden md:flex gap-2">
          {car.images.slice(0, 4).map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImageIndex ? 'border-white' : 'border-transparent'
              }`}
            >
              <img src={image.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Basic Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {car.isInstantBook && (
                  <Badge className="bg-primary">
                    <Zap className="w-3 h-3 mr-1" />
                    Instant Book
                  </Badge>
                )}
                <Badge variant="secondary">{car.category}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {car.make} {car.model} {car.year}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span className="font-medium text-foreground">{car.averageRating}</span>
                  <span>({car.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{car.address}, {car.city}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Host Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarImage src={car.owner.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {car.owner.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      Hosted by {car.owner.firstName}
                    </span>
                    {car.owner.isVerified && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {car.owner.tripsCount} trips • {car.owner.carsCount} cars • Joined {format(car.owner.createdAt, 'MMM yyyy')}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="hidden sm:flex">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Host
              </Button>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this car</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {car.description}
              </p>
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
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Reviews ({car.totalReviews})
                </h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span className="font-medium">{car.averageRating}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {car.reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.reviewer.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.reviewer.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {review.reviewer.firstName} {review.reviewer.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {format(review.createdAt, 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-secondary text-secondary'
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

              {car.totalReviews > 2 && (
                <Button variant="outline" className="mt-6">
                  Show all {car.totalReviews} reviews
                </Button>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(car.pricePerDay)}
                  </span>
                  <span className="text-muted-foreground">/day</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-14 justify-start font-normal">
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground">Pick-up</div>
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
                      <Button variant="outline" className="h-14 justify-start font-normal">
                        <div className="text-left">
                          <div className="text-xs text-muted-foreground">Drop-off</div>
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
                        disabled={(date) => date < (startDate || new Date())}
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
                        {formatPrice(car.pricePerDay)} × {totalDays} days
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  size="lg" 
                  className="w-full h-12 text-base shadow-lg shadow-primary/30"
                  disabled={!startDate || !endDate}
                  onClick={handleBook}
                >
                  {car.isInstantBook ? 'Book Now' : 'Request to Book'}
                </Button>

                {/* Security Deposit Notice */}
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                  <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Security deposit of {formatPrice(car.securityDeposit)} required. Refunded after trip.
                  </span>
                </div>

                {/* Insurance Badge */}
                <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Insurance included in every trip</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
