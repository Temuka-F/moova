'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Car,
  Plus,
  Edit,
  Trash2,
  Pause,
  Play,
  Eye,
  TrendingUp,
  Calendar,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { RoleGuard } from '@/components/auth/role-guard'

interface CarData {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  city: string
  status: string
  isActive: boolean
  images: { url: string; isPrimary: boolean }[]
  _count?: {
    bookings: number
    reviews: number
  }
}

export default function CarsPage() {
  const router = useRouter()
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await fetch('/api/me/cars')
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/login?redirect=/dashboard/cars')
            return
          }
          throw new Error('Failed to fetch cars')
        }
        const data = await res.json()
        setCars(data.cars || [])
      } catch (err) {
        console.error('Error fetching cars:', err)
        toast.error('Failed to load cars')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [router])

  const handleToggleActive = async (carId: string, currentStatus: boolean) => {
    setActionLoading(carId)
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update car')
      }

      setCars(prev => prev.map(c =>
        c.id === carId ? { ...c, isActive: !currentStatus } : c
      ))
      toast.success(`Car ${!currentStatus ? 'activated' : 'paused'}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update car')
    } finally {
      setActionLoading(null)
    }
  }

  const activeCars = cars.filter(c => c.isActive && c.status === 'APPROVED')
  const inactiveCars = cars.filter(c => !c.isActive || c.status !== 'APPROVED')
  const pendingCars = cars.filter(c => c.status === 'PENDING')

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="secondary">Paused</Badge>
    }
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500/10 text-green-600 border-0">Active</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending Review</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>
      case 'SUSPENDED':
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const CarCard = ({ car }: { car: CarData }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/cars/${car.id}`}
            className="w-full sm:w-32 h-40 sm:h-32 rounded-xl bg-cover bg-center shrink-0 bg-muted"
            style={{
              backgroundImage: car.images?.[0]?.url
                ? `url('${car.images[0].url}')`
                : undefined,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <Link href={`/cars/${car.id}`} className="hover:underline">
                  <h3 className="font-semibold text-base sm:text-lg mb-1">
                    {car.make} {car.model} {car.year}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">{car.city}</p>
              </div>
              <div className="shrink-0">{getStatusBadge(car.status, car.isActive)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="font-semibold">₾{car.pricePerDay}</span>
                  <span className="text-muted-foreground text-xs">/day</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{car._count?.bookings || 0} bookings</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Star className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{car._count?.reviews || 0} reviews</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild className="min-h-[44px] flex-1 sm:flex-initial">
                <Link href={`/cars/${car.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="min-h-[44px] flex-1 sm:flex-initial">
                <Link href={`/dashboard/cars/${car.id}/edit`}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleActive(car.id, car.isActive)}
                disabled={actionLoading === car.id}
                className="min-h-[44px] flex-1 sm:flex-initial"
              >
                {actionLoading === car.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : car.isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-32 h-32 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <RoleGuard allowedModes={['OWNER']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Cars</h1>
            <p className="text-muted-foreground">Manage your fleet</p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/list-your-car">
              <Plus className="w-4 h-4 mr-2" />
              List New Car
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeCars.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingCars.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({inactiveCars.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeCars.length > 0 ? (
              activeCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Car className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No active cars</h3>
                  <p className="text-muted-foreground mb-4">
                    List your first car to start earning
                  </p>
                  <Button asChild className="rounded-full">
                    <Link href="/list-your-car">List Your Car</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingCars.length > 0 ? (
              pendingCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No pending cars</h3>
                  <p className="text-muted-foreground">
                    All your cars have been reviewed
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {inactiveCars.length > 0 ? (
              inactiveCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Pause className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No inactive cars</h3>
                  <p className="text-muted-foreground">
                    All your cars are active
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
