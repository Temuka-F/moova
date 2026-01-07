'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
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
  Phone,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { getErrorMessage } from '@/lib/error-utils'

interface BookingReview {
  id: string
  rating: number
  comment?: string | null
  createdAt: string
}

interface BookingDetail {
  id: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  subtotal: number
  serviceFee: number
  securityDeposit: number
  totalDays: number
  pickupLocation: string
  car: {
    id: string
    make: string
    model: string
    year: number
    images: { url: string; isPrimary: boolean }[]
    owner: {
      id: string
      firstName: string
      lastName: string
      avatarUrl: string | null
      phone: string | null
      email: string
    }
  }
  renter: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
    phone: string | null
    email: string
    verificationStatus: string
  }
  review?: BookingReview | null
}

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`)
        if (!res.ok) {
          if (res.status === 401) {
            router.push(`/login?redirect=/dashboard/bookings/${bookingId}`)
            return
          }
          if (res.status === 404) {
            toast.error('Booking not found')
            router.push('/dashboard/bookings')
            return
          }
          throw new Error('Failed to fetch booking')
        }
        const data = await res.json()
        setBooking(data)
      } catch (err) {
        console.error('Error fetching booking:', err)
        toast.error(getErrorMessage(err, 'Failed to load booking'))
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId, router])

  const handleStatusUpdate = async (status: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update booking')
      }

      const updated = await res.json()
      setBooking(updated)
      toast.success('Booking updated successfully')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update booking'))
    } finally {
      setActionLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!booking) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Booking not found</h3>
          <p className="text-muted-foreground mb-4">This booking doesn't exist or you don't have access to it</p>
          <Button asChild>
            <Link href="/dashboard/bookings">Back to Bookings</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Determine if current user is renter or owner
  const isRenter = booking.renter.id === booking.renter.id // This will be determined from API
  const otherParty = isRenter ? booking.car.owner : booking.renter

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground">Booking #{booking.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Car Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Car Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link 
                  href={`/cars/${booking.car.id}`}
                  className="w-32 h-32 rounded-xl bg-cover bg-center shrink-0 bg-muted"
                  style={{
                    backgroundImage: booking.car.images?.[0]?.url 
                      ? `url('${booking.car.images[0].url}')`
                      : undefined,
                  }}
                />
                <div className="flex-1">
                  <Link href={`/cars/${booking.car.id}`} className="hover:underline">
                    <h3 className="text-xl font-semibold mb-2">
                      {booking.car.make} {booking.car.model} {booking.car.year}
                    </h3>
                  </Link>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(booking.startDate), 'MMM d, yyyy')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with {isRenter ? 'the host' : 'the renter'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={otherParty.avatarUrl || undefined} />
                  <AvatarFallback>
                    {otherParty.firstName[0]}{otherParty.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {otherParty.firstName} {otherParty.lastName}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    {otherParty.phone && (
                      <a href={`tel:${otherParty.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <Phone className="w-4 h-4" />
                        {otherParty.phone}
                      </a>
                    )}
                    <a href={`mailto:${otherParty.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <Mail className="w-4 h-4" />
                      {otherParty.email}
                    </a>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/messages?bookingId=${booking.id}`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {getStatusBadge(booking.status)}
              </div>
              {booking.status === 'PENDING' && (
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Confirm Booking
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={actionLoading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
              {booking.status === 'CONFIRMED' && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  disabled={actionLoading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₾{booking.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span>₾{booking.serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Security Deposit</span>
                <span>₾{booking.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₾{booking.totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
