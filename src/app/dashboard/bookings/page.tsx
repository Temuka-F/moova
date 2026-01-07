'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Zap,
  Car,
  MessageCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'

interface BookingCar {
  id: string
  make: string
  model: string
  year: number
  images: { url: string }[]
  owner: {
    id: string
    firstName: string
    lastName: string
    phone: string | null
  }
}

interface BookingRenter {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  verificationStatus: string
}

interface Booking {
  id: string
  carId: string
  renterId: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  totalDays: number
  pickupLocation: string
  car: BookingCar
  renter?: BookingRenter
  review?: any
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Skeleton className="w-24 h-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings')
        
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard/bookings')
            return
          }
          throw new Error('Failed to fetch bookings')
        }
        
        const data = await res.json()
        setBookings(data.bookings || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings')
        console.error('Error fetching bookings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [router])

  const handleConfirmBooking = async (bookingId: string) => {
    setActionLoading(bookingId)
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to confirm booking')
      }

      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b
      ))
      toast.success('Booking confirmed!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm booking')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    setActionLoading(bookingId)
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to cancel booking')
      }

      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
      ))
      toast.success('Booking cancelled')
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking')
    } finally {
      setActionLoading(null)
    }
  }

  const upcomingBookings = bookings.filter(b => ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.status))
  const pastBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-500/10 text-green-600 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmed</Badge>
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'ACTIVE':
        return <Badge className="bg-blue-500/10 text-blue-600 border-0"><Zap className="w-3 h-3 mr-1" />Active</Badge>
      case 'COMPLETED':
        return <Badge className="bg-muted text-muted-foreground border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href={`/cars/${booking.car.id}`}
            className="w-full sm:w-24 h-32 sm:h-20 rounded-xl bg-cover bg-center shrink-0 bg-muted"
            style={{
              backgroundImage: booking.car?.images?.[0]?.url 
                ? `url('${booking.car.images[0].url}')`
                : undefined,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <Link href={`/dashboard/bookings/${booking.id}`} className="hover:underline">
                  <h3 className="font-semibold text-lg">
                    {booking.car?.make} {booking.car?.model}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">{booking.car?.year}</p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{booking.pickupLocation}</span>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col justify-between sm:text-right shrink-0">
            <div>
              <p className="font-bold text-lg">₾{booking.totalAmount}</p>
              <p className="text-xs text-muted-foreground">{booking.totalDays} days</p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Button size="sm" variant="outline" asChild className="rounded-full">
                <Link href={`/dashboard/bookings/${booking.id}`}>
                  View Details
                </Link>
              </Button>
              <div className="flex gap-2 flex-wrap">
              {booking.status === 'PENDING' && (
                <>
                  <Button 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleConfirmBooking(booking.id)}
                    disabled={actionLoading === booking.id}
                  >
                    {actionLoading === booking.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="rounded-full"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={actionLoading === booking.id}
                  >
                    Decline
                  </Button>
                </>
              )}
              {['CONFIRMED', 'ACTIVE'].includes(booking.status) && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={actionLoading === booking.id}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" variant="ghost" asChild className="rounded-full">
                    <Link href={`/dashboard/messages?bookingId=${booking.id}`}>
                      <MessageCircle className="w-4 h-4" />
                    </Link>
                  </Button>
                </>
              )}
              {booking.status === 'COMPLETED' && !booking.review && (
                <Button size="sm" variant="outline" className="rounded-full">
                  Leave Review
                </Button>
              )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">Manage your trips and reservations</p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/cars">
              <Car className="w-4 h-4 mr-2" />
              Book a Car
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Failed to load bookings</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="rounded-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="bg-white rounded-full p-1">
              <TabsTrigger value="upcoming" className="rounded-full">
                Upcoming ({loading ? '...' : upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="rounded-full">
                Past ({loading ? '...' : pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {loading ? (
                <BookingsSkeleton />
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any upcoming trips scheduled
                    </p>
                    <Button asChild className="rounded-full">
                      <Link href="/cars">Browse Cars</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {loading ? (
                <BookingsSkeleton />
              ) : pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                    <p className="text-muted-foreground">
                      Your completed trips will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
