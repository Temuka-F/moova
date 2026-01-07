'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Zap,
  ArrowRight,
  Car,
  MessageCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { 
  DUMMY_USERS, 
  getBookingsByUser, 
  getBookingsByHost 
} from '@/lib/dummy-data'

const CURRENT_USER = DUMMY_USERS[0]

export default function BookingsPage() {
  const isHost = CURRENT_USER.role === 'OWNER'
  
  const renterBookings = getBookingsByUser(CURRENT_USER.id)
  const hostBookings = isHost ? getBookingsByHost(CURRENT_USER.id) : []
  
  const allBookings = [...renterBookings, ...hostBookings]
  
  const upcomingBookings = allBookings.filter(b => ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.status))
  const pastBookings = allBookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status))

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

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div
            className="w-24 h-20 rounded-xl bg-cover bg-center shrink-0"
            style={{
              backgroundImage: `url('${booking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200'}')`,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {booking.car?.make} {booking.car?.model}
                </h3>
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
          <div className="text-right shrink-0">
            <p className="font-bold text-lg">₾{booking.totalAmount}</p>
            <p className="text-xs text-muted-foreground">{booking.totalDays} days</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" asChild className="rounded-full">
                <Link href={`/dashboard/bookings/${booking.id}`}>
                  Details
                </Link>
              </Button>
              {['CONFIRMED', 'ACTIVE'].includes(booking.status) && (
                <Button size="sm" variant="ghost" asChild className="rounded-full">
                  <Link href="/dashboard/messages">
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                </Button>
              )}
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

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white rounded-full p-1">
            <TabsTrigger value="upcoming" className="rounded-full">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-full">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
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
            {pastBookings.length > 0 ? (
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
      </div>
    </div>
  )
}
