'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Calendar,
  Car,
  TrendingUp,
  MessageCircle,
  Star,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react'
import { format } from 'date-fns'
import { formatPrice } from '@/lib/flitt'

interface DashboardData {
  user: {
    id: string
    firstName: string
    lastName: string
    role: 'RENTER' | 'OWNER' | 'ADMIN'
    _count: {
      cars: number
      bookingsAsRenter: number
    }
  }
  upcomingBookings: any[]
  recentBookings: any[]
  stats: {
    totalTrips: number
    totalEarnings: number
    activeCars: number
    pendingBookings: number
  }
}

// Demo data for when API is not available
const demoData: DashboardData = {
  user: {
    id: 'demo-user',
    firstName: 'Demo',
    lastName: 'User',
    role: 'OWNER',
    _count: {
      cars: 2,
      bookingsAsRenter: 5,
    },
  },
  upcomingBookings: [
    {
      id: '1',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'CONFIRMED',
      totalAmount: 540,
      pickupLocation: 'Tbilisi, Rustaveli Ave',
      car: {
        make: 'BMW',
        model: 'X5',
        images: [{ url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' }],
      },
    },
    {
      id: '2',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      totalAmount: 360,
      pickupLocation: 'Batumi, Seaside',
      car: {
        make: 'Toyota',
        model: 'Camry',
        images: [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' }],
      },
    },
  ],
  recentBookings: [],
  stats: {
    totalTrips: 12,
    totalEarnings: 4800,
    activeCars: 2,
    pendingBookings: 2,
  },
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/bookings?limit=5'),
        ])

        if (!userRes.ok) {
          // Use demo data if API fails
          setData(demoData)
          return
        }

        const user = await userRes.json()
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] }

        // Calculate stats
        const now = new Date()
        const upcomingBookings = bookingsData.bookings?.filter(
          (b: any) => new Date(b.startDate) > now && ['PENDING', 'CONFIRMED'].includes(b.status)
        ) || []
        const completedBookings = bookingsData.bookings?.filter(
          (b: any) => b.status === 'COMPLETED'
        ) || []

        setData({
          user,
          upcomingBookings: upcomingBookings.slice(0, 3),
          recentBookings: bookingsData.bookings?.slice(0, 5) || [],
          stats: {
            totalTrips: completedBookings.length,
            totalEarnings: completedBookings.reduce((sum: number, b: any) => sum + b.totalAmount, 0),
            activeCars: user._count?.cars || 0,
            pendingBookings: upcomingBookings.length,
          },
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Use demo data on error
        setData(demoData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const isHost = data.user.role === 'OWNER' || data.user.role === 'ADMIN'

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {data.user.firstName}! 👋
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your {isHost ? 'rentals' : 'trips'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {isHost ? 'Total Bookings' : 'Total Trips'}
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{data.stats.totalTrips}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {isHost && (
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">
                    {formatPrice(data.stats.totalEarnings)}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isHost && (
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Active Cars</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{data.stats.activeCars}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Car className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {isHost ? 'Pending' : 'Upcoming'}
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{data.stats.pendingBookings}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {isHost ? 'Upcoming Bookings' : 'Upcoming Trips'}
                </CardTitle>
                <CardDescription>
                  Your next scheduled {isHost ? 'rentals' : 'trips'}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/bookings">
                  View all
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {data.upcomingBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming {isHost ? 'bookings' : 'trips'}</p>
                  {!isHost && (
                    <Button className="mt-4" asChild>
                      <Link href="/cars">Browse Cars</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {data.upcomingBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/dashboard/bookings/${booking.id}`}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="w-20 h-16 rounded-lg bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: `url('${booking.car.images[0]?.url || '/placeholder-car.jpg'}')`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {booking.car.make} {booking.car.model}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {format(new Date(booking.startDate), 'MMM d')} -{' '}
                            {format(new Date(booking.endDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{booking.pickupLocation}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}
                        >
                          {booking.status}
                        </Badge>
                        <p className="font-semibold mt-1">
                          {formatPrice(booking.totalAmount)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isHost ? (
                <>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/list-your-car">
                      <Car className="w-4 h-4 mr-2" />
                      List a New Car
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/cars">
                      <Car className="w-4 h-4 mr-2" />
                      Manage My Cars
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/earnings">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Earnings
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/cars">
                      <Car className="w-4 h-4 mr-2" />
                      Browse Cars
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/favorites">
                      <Star className="w-4 h-4 mr-2" />
                      View Favorites
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/list-your-car">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Become a Host
                    </Link>
                  </Button>
                </>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/messages">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">💡 Pro Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {isHost
                  ? 'Cars with instant booking enabled get 40% more reservations. Enable it in your car settings!'
                  : 'Complete your profile verification to unlock instant booking on all cars.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
