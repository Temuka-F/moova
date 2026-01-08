'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Plus,
  Wallet,
  Heart,
  Settings,
  CheckCircle2,
  AlertCircle,
  Zap,
  Loader2,
  Sparkles
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/error-utils'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  role: 'RENTER' | 'OWNER' | 'ADMIN'
  activeProfileMode?: 'RENTER' | 'OWNER' | null
  verificationStatus: string
  _count?: {
    cars: number
    bookingsAsRenter: number
    reviewsReceived: number
  }
}

interface Booking {
  id: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  totalDays: number
  pickupLocation: string
  car: {
    id: string
    make: string
    model: string
    images: { url: string }[]
    owner?: {
      firstName: string
      lastName: string
    }
  }
  renter?: {
    firstName: string
    lastName: string
  }
}

interface CarData {
  id: string
  make: string
  model: string
  pricePerDay: number
  isActive: boolean
  status: string
  images: { url: string }[]
  _count?: {
    bookings: number
    reviews: number
  }
}

export function DashboardOverview() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)

  // For OWNER users, check activeProfileMode to determine view
  const effectiveMode = user?.role === 'OWNER' && user?.activeProfileMode
    ? user.activeProfileMode
    : user?.role || 'RENTER'
  const isHost = effectiveMode === 'OWNER' || user?.role === 'ADMIN'

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current user
        const userRes = await fetch('/api/me')
        if (!userRes.ok) {
          if (userRes.status === 401) {
            router.push('/login?redirect=/dashboard')
            return
          }
          throw new Error('Failed to fetch user')
        }
        const userData = await userRes.json()
        setUser(userData)

        // Fetch bookings based on active profile mode
        const effectiveMode = userData.role === 'OWNER' && userData.activeProfileMode
          ? userData.activeProfileMode
          : userData.role || 'RENTER'

        const type = effectiveMode === 'OWNER' ? 'host' : 'renter'
        const bookingsRes = await fetch(`/api/bookings?type=${type}`)

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setBookings(bookingsData.bookings || [])
        }

        // Fetch cars if owner
        if (userData.role === 'OWNER' || userData.role === 'ADMIN') {
          const carsRes = await fetch('/api/me/cars')
          if (carsRes.ok) {
            const carsData = await carsRes.json()
            setCars(carsData.cars || [])
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleUpgradeToOwner = async () => {
    if (!user) return

    setIsUpgrading(true)
    try {
      const res = await fetch(`/api/users/${user.id}/upgrade`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upgrade')
      }

      const updatedUser = await res.json()
      setUser(updatedUser)
      toast.success('Congratulations! You are now a host. Start listing your first car!')
      router.push('/list-your-car')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to upgrade to owner'))
    } finally {
      setIsUpgrading(false)
    }
  }

  // Calculate stats
  const upcomingBookings = bookings.filter(b =>
    ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.status)
  ).slice(0, 5)

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0)
  const activeCars = cars.filter(c => c.isActive && c.status === 'APPROVED').length
  const totalEarnings = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-muted-foreground">
                {isHost ? 'Manage your fleet and track earnings' : 'Find your next adventure'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {isHost ? (
              <>
                <Button asChild className="rounded-full min-h-[44px]">
                  <Link href="/list-your-car">
                    <Plus className="w-4 h-4 mr-2" />
                    Add new car
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full min-h-[44px]">
                  <Link href="/dashboard/bookings">
                    <Wallet className="w-4 h-4 mr-2" />
                    View bookings
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="rounded-full min-h-[44px]">
                  <Link href="/cars">
                    <Car className="w-4 h-4 mr-2" />
                    Browse cars
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full min-h-[44px]"
                  onClick={handleUpgradeToOwner}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  Become a host
                </Button>
              </>
            )}
            <Button variant="ghost" asChild className="rounded-full min-h-[44px]">
              <Link href="/dashboard/messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
          </div>
        </div>

        {/* Become a Host Banner - for RENTERS */}
        {!isHost && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
            <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-lg mb-1">Start earning with your car</h3>
                <p className="text-sm text-muted-foreground">
                  Hosts on Moova earn up to ₾1,500/month. List your car and start earning today!
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-full"
                onClick={handleUpgradeToOwner}
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    Become a Host
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isHost ? (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">
                        ₾{totalEarnings.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Cars</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{activeCars}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{bookings.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{pendingBookings}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Trips</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{completedBookings.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{upcomingBookings.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">₾{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Saved Cars</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{user._count?.cars || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Bookings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Actions (for hosts) */}
            {isHost && pendingBookings > 0 && (
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Booking Requests Pending</h3>
                    <p className="text-sm text-muted-foreground">
                      {pendingBookings} bookings waiting for your approval
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/bookings">Review</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming {isHost ? 'Bookings' : 'Trips'}</CardTitle>
                  <CardDescription>
                    Your scheduled {isHost ? 'rentals' : 'trips'}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="min-h-[44px]">
                  <Link href="/dashboard/bookings">
                    View all
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
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
                    {upcomingBookings.map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/dashboard/bookings`}
                        className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="w-20 h-16 rounded-xl bg-cover bg-center shrink-0 bg-muted"
                          style={{
                            backgroundImage: booking.car?.images?.[0]?.url
                              ? `url('${booking.car.images[0].url}')`
                              : undefined,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate">
                              {booking.car?.make} {booking.car?.model}
                            </h4>
                            {booking.status === 'CONFIRMED' && (
                              <Badge className="bg-green-500/10 text-green-600 border-0">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Confirmed
                              </Badge>
                            )}
                            {booking.status === 'PENDING' && (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {booking.status === 'ACTIVE' && (
                              <Badge className="bg-blue-500/10 text-blue-600 border-0">
                                <Zap className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {format(new Date(booking.startDate), 'MMM d')} -{' '}
                                {format(new Date(booking.endDate), 'MMM d')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{booking.pickupLocation}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-lg">₾{booking.totalAmount}</p>
                          <p className="text-xs text-muted-foreground">{booking.totalDays} days</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Host's Cars */}
            {isHost && cars.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Fleet</CardTitle>
                    <CardDescription>Manage your listed cars</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/bookings">
                      Manage all
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {cars.slice(0, 4).map((car) => (
                      <Link
                        key={car.id}
                        href={`/cars/${car.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="w-16 h-12 rounded-lg bg-cover bg-center shrink-0 bg-muted"
                          style={{
                            backgroundImage: car.images[0]?.url
                              ? `url('${car.images[0].url}')`
                              : undefined,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate text-sm">
                            {car.make} {car.model}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{car._count?.bookings || 0} bookings</span>
                            <span>•</span>
                            <span>₾{car.pricePerDay}/day</span>
                          </div>
                        </div>
                        <Badge variant={car.isActive && car.status === 'APPROVED' ? 'default' : 'secondary'} className="text-xs">
                          {car.status === 'PENDING' ? 'Pending' : car.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isHost ? (
                  <>
                    <Button className="w-full justify-start rounded-xl" asChild>
                      <Link href="/list-your-car">
                        <Plus className="w-4 h-4 mr-3" />
                        List a New Car
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                      <Link href="/dashboard/bookings">
                        <Car className="w-4 h-4 mr-3" />
                        Manage Bookings
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                      <Link href="/cars">
                        <TrendingUp className="w-4 h-4 mr-3" />
                        Browse Cars
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full justify-start rounded-xl" asChild>
                      <Link href="/cars">
                        <Car className="w-4 h-4 mr-3" />
                        Browse Cars
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                      <Link href="/dashboard/favorites">
                        <Heart className="w-4 h-4 mr-3" />
                        Saved Cars
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-xl"
                      onClick={handleUpgradeToOwner}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? (
                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                      ) : (
                        <TrendingUp className="w-4 h-4 mr-3" />
                      )}
                      Become a Host
                    </Button>
                  </>
                )}
                <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                  <Link href="/dashboard/messages">
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Messages
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start rounded-xl" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tip */}
            <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  💡 Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {isHost
                    ? 'Cars with instant booking enabled get 40% more reservations. Enable it in your car settings to boost your earnings!'
                    : 'Complete your profile verification to unlock instant booking on all cars and skip the waiting!'}
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                  <Link href={isHost ? '/dashboard/bookings' : '/dashboard/settings'}>
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/help" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    📚
                  </div>
                  <span>Help Center</span>
                </Link>
                <Link href="/contact" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    💬
                  </div>
                  <span>Contact Support</span>
                </Link>
                <Link href="/safety" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    🛡️
                  </div>
                  <span>Safety & Insurance</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
