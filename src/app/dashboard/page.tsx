'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Zap
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import { formatPrice } from '@/lib/flitt'
import { CarCard } from '@/components/cars/car-card'
import { 
  DUMMY_USERS, 
  DUMMY_CARS, 
  DUMMY_BOOKINGS, 
  getHostStats, 
  getRenterStats,
  getBookingsByUser,
  getBookingsByHost,
  getCarsByOwner
} from '@/lib/dummy-data'

// Simulated logged-in user (would come from auth in real app)
const CURRENT_USER = DUMMY_USERS[0] // Giorgi - an OWNER

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const user = CURRENT_USER
  const isHost = user.role === 'OWNER' || user.role === 'ADMIN'
  
  // Get stats based on role
  const hostStats = isHost ? getHostStats(user.id) : null
  const renterStats = getRenterStats(user.id)
  
  // Get bookings
  const hostBookings = isHost ? getBookingsByHost(user.id) : []
  const renterBookings = getBookingsByUser(user.id)
  
  // Get host's cars
  const hostCars = isHost ? getCarsByOwner(user.id) : []
  
  // Upcoming bookings
  const upcomingBookings = [...hostBookings, ...renterBookings]
    .filter(b => ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.status))
    .slice(0, 5)

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
                <Button asChild className="rounded-full">
                  <Link href="/list-your-car">
                    <Plus className="w-4 h-4 mr-2" />
                    Add new car
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full">
                  <Link href="/dashboard/earnings">
                    <Wallet className="w-4 h-4 mr-2" />
                    View earnings
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="rounded-full">
                  <Link href="/cars">
                    <Car className="w-4 h-4 mr-2" />
                    Browse cars
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full">
                  <Link href="/list-your-car">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Become a host
                  </Link>
                </Button>
              </>
            )}
            <Button variant="ghost" asChild className="rounded-full">
              <Link href="/dashboard/messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isHost ? (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">
                        ₾{hostStats?.totalEarnings.toLocaleString()}
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
                      <p className="text-2xl md:text-3xl font-bold mt-1">{hostStats?.activeCars}</p>
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
                      <p className="text-2xl md:text-3xl font-bold mt-1">{hostStats?.totalBookings}</p>
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
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{hostStats?.avgRating.toFixed(1)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-500" />
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
                      <p className="text-2xl md:text-3xl font-bold mt-1">{renterStats.totalTrips}</p>
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
                      <p className="text-2xl md:text-3xl font-bold mt-1">{renterStats.upcomingTrips}</p>
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
                      <p className="text-2xl md:text-3xl font-bold mt-1">₾{renterStats.totalSpent}</p>
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
                      <p className="text-2xl md:text-3xl font-bold mt-1">{renterStats.savedCars}</p>
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
            {isHost && hostStats && (hostStats.pendingBookings > 0) && (
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Booking Requests Pending</h3>
                    <p className="text-sm text-muted-foreground">
                      {hostStats.pendingBookings} bookings waiting for your approval
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
                <Button variant="outline" size="sm" asChild>
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
                    {upcomingBookings.map((booking: any) => (
                      <Link
                        key={booking.id}
                        href={`/dashboard/bookings/${booking.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="w-20 h-16 rounded-xl bg-cover bg-center shrink-0"
                          style={{
                            backgroundImage: `url('${booking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200'}')`,
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
            {isHost && hostCars.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Fleet</CardTitle>
                    <CardDescription>Manage your listed cars</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/cars">
                      Manage all
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {hostCars.slice(0, 4).map((car) => (
                      <Link
                        key={car.id}
                        href={`/dashboard/cars/${car.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="w-16 h-12 rounded-lg bg-cover bg-center shrink-0"
                          style={{
                            backgroundImage: `url('${car.images[0]?.url}')`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate text-sm">
                            {car.make} {car.model}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-primary text-primary" />
                              {car.rating}
                            </span>
                            <span>•</span>
                            <span>₾{car.pricePerDay}/day</span>
                          </div>
                        </div>
                        <Badge variant={car.isActive ? 'default' : 'secondary'} className="text-xs">
                          {car.isActive ? 'Active' : 'Paused'}
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
                      <Link href="/dashboard/cars">
                        <Car className="w-4 h-4 mr-3" />
                        Manage Fleet
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                      <Link href="/dashboard/earnings">
                        <TrendingUp className="w-4 h-4 mr-3" />
                        View Earnings
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
                    <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
                      <Link href="/list-your-car">
                        <TrendingUp className="w-4 h-4 mr-3" />
                        Become a Host
                      </Link>
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
                  <Link href={isHost ? '/dashboard/cars' : '/dashboard/settings'}>
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
