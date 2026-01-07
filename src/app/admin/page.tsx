'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  Car,
  Calendar,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { formatPrice } from '@/lib/flitt'

interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
  avatarUrl: string | null
}

interface AdminCar {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  status: string
  owner: { firstName: string; lastName: string }
  images: { url: string }[]
}

interface AdminBooking {
  id: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  car: { make: string; model: string; images: { url: string }[] }
  renter: { firstName: string; avatarUrl: string | null }
}

interface AdminStats {
  totalUsers: number
  totalCars: number
  totalBookings: number
  totalRevenue: number
  pendingVerifications: number
  pendingCarApprovals: number
  activeBookings: number
  newUsersThisMonth: number
  newCarsThisMonth: number
  bookingsThisMonth: number
  recentUsers: AdminUser[]
  recentCars: AdminCar[]
  recentBookings: AdminBooking[]
}

// Demo stats for when API is not available
const demoStats: AdminStats = {
  totalUsers: 1247,
  totalCars: 385,
  totalBookings: 2891,
  totalRevenue: 145680,
  pendingVerifications: 8,
  pendingCarApprovals: 12,
  activeBookings: 47,
  newUsersThisMonth: 89,
  newCarsThisMonth: 23,
  bookingsThisMonth: 156,
  recentUsers: [
    { id: '1', firstName: 'Giorgi', lastName: 'Beridze', email: 'giorgi@example.com', role: 'OWNER', createdAt: new Date().toISOString(), avatarUrl: null },
    { id: '2', firstName: 'Nino', lastName: 'Kvlividze', email: 'nino@example.com', role: 'RENTER', createdAt: new Date().toISOString(), avatarUrl: null },
    { id: '3', firstName: 'Levan', lastName: 'Tskhadadze', email: 'levan@example.com', role: 'OWNER', createdAt: new Date().toISOString(), avatarUrl: null },
  ],
  recentCars: [
    { id: '1', make: 'BMW', model: 'X5', year: 2022, pricePerDay: 180, status: 'APPROVED', owner: { firstName: 'Giorgi', lastName: 'B.' }, images: [{ url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' }] },
    { id: '2', make: 'Mercedes', model: 'E-Class', year: 2023, pricePerDay: 200, status: 'PENDING', owner: { firstName: 'Nino', lastName: 'K.' }, images: [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400' }] },
    { id: '3', make: 'Toyota', model: 'Camry', year: 2021, pricePerDay: 120, status: 'APPROVED', owner: { firstName: 'Levan', lastName: 'T.' }, images: [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' }] },
  ],
  recentBookings: [
    { id: '1', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(), status: 'CONFIRMED', totalAmount: 540, car: { make: 'BMW', model: 'X5', images: [{ url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' }] }, renter: { firstName: 'Ana', avatarUrl: null } },
    { id: '2', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(), status: 'ACTIVE', totalAmount: 1000, car: { make: 'Mercedes', model: 'E-Class', images: [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400' }] }, renter: { firstName: 'David', avatarUrl: null } },
    { id: '3', startDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(), endDate: new Date(Date.now() - 4*24*60*60*1000).toISOString(), status: 'COMPLETED', totalAmount: 360, car: { make: 'Toyota', model: 'Camry', images: [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' }] }, renter: { firstName: 'Irakli', avatarUrl: null } },
  ],
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          setStats(await response.json())
        } else {
          // Use demo stats if API fails
          setStats(demoStats)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Use demo stats on error
        setStats(demoStats)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!stats) {
    // Use demo stats as fallback
    setStats(demoStats)
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and management
          </p>
        </div>
        <div className="flex gap-2">
          {stats.pendingVerifications > 0 && (
            <Button asChild variant="outline">
              <Link href="/admin/verifications">
                <Shield className="w-4 h-4 mr-2" />
                {stats.pendingVerifications} Pending Verifications
              </Link>
            </Button>
          )}
          {stats.pendingCarApprovals > 0 && (
            <Button asChild>
              <Link href="/admin/cars?status=PENDING">
                <Car className="w-4 h-4 mr-2" />
                {stats.pendingCarApprovals} Cars to Review
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Alert Cards */}
      {(stats.pendingVerifications > 0 || stats.pendingCarApprovals > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.pendingVerifications > 0 && (
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">User Verifications Pending</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingVerifications} users waiting for document review
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/verifications">Review</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {stats.pendingCarApprovals > 0 && (
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Car Listings Pending</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingCarApprovals} cars waiting for approval
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/cars?status=PENDING">Review</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.newUsersThisMonth} this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cars</p>
                <p className="text-3xl font-bold mt-1">{stats.totalCars}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.newCarsThisMonth} this month
                </p>
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
                <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeBookings} active now
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Platform earnings
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Newly registered users</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/users">
                View all
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={user.role === 'OWNER' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(user.createdAt), 'MMM d')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Cars */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Car Listings</CardTitle>
              <CardDescription>Newly listed cars</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/cars">
                View all
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <div
                    className="w-16 h-12 rounded-lg bg-cover bg-center shrink-0"
                    style={{
                      backgroundImage: `url('${car.images[0]?.url || '/placeholder-car.jpg'}')`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {car.make} {car.model} {car.year}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      by {car.owner.firstName} {car.owner.lastName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={
                        car.status === 'APPROVED'
                          ? 'default'
                          : car.status === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {car.status}
                    </Badge>
                    <p className="font-medium mt-1">
                      {formatPrice(car.pricePerDay)}/day
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/bookings">
              View all
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Car</th>
                  <th className="text-left py-3 px-4 font-medium">Renter</th>
                  <th className="text-left py-3 px-4 font-medium">Dates</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-9 rounded bg-cover bg-center shrink-0"
                          style={{
                            backgroundImage: `url('${booking.car.images[0]?.url || '/placeholder-car.jpg'}')`,
                          }}
                        />
                        <span className="font-medium">
                          {booking.car.make} {booking.car.model}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={booking.renter.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {booking.renter.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{booking.renter.firstName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {format(new Date(booking.startDate), 'MMM d')} -{' '}
                      {format(new Date(booking.endDate), 'MMM d')}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatPrice(booking.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          booking.status === 'COMPLETED'
                            ? 'default'
                            : booking.status === 'ACTIVE'
                            ? 'secondary'
                            : booking.status === 'CANCELLED'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
