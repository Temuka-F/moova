'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CarCard } from '@/components/cars/CarCard'
import { Heart, Car, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface FavoriteCar {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  city: string
  category: string
  transmission: string
  fuelType: string
  seats: number
  isInstantBook: boolean
  images: { id: string; url: string }[]
  owner: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
    verificationStatus: string
  }
  _count: {
    reviews: number
    bookings: number
  }
}

interface Favorite {
  id: string
  carId: string
  car: FavoriteCar
}

function FavoritesSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="rounded-2xl overflow-hidden border">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch('/api/favorites')
        
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard/favorites')
            return
          }
          throw new Error('Failed to fetch favorites')
        }
        
        const data = await res.json()
        setFavorites(data.favorites || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load favorites')
        console.error('Error fetching favorites:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [router])

  const handleRemoveFavorite = async (carId: string) => {
    try {
      const res = await fetch(`/api/favorites?carId=${carId}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        throw new Error('Failed to remove favorite')
      }
      
      setFavorites(prev => prev.filter(f => f.car.id !== carId))
      toast.success('Removed from favorites')
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove favorite')
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Saved Cars</h1>
            <p className="text-muted-foreground">Cars you've saved for later</p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/cars">
              <Car className="w-4 h-4 mr-2" />
              Browse More
            </Link>
          </Button>
        </div>

        {loading ? (
          <FavoritesSkeleton />
        ) : error ? (
          <Card className="text-center py-16">
            <CardContent>
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Failed to load favorites</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()} className="rounded-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : favorites.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <CarCard 
                key={favorite.id} 
                car={{
                  id: favorite.car.id,
                  make: favorite.car.make,
                  model: favorite.car.model,
                  year: favorite.car.year,
                  pricePerDay: favorite.car.pricePerDay,
                  city: favorite.car.city,
                  rating: 4.5, // TODO: Calculate from reviews
                  reviewCount: favorite.car._count?.reviews || 0,
                  isInstantBook: favorite.car.isInstantBook,
                  transmission: favorite.car.transmission,
                  fuelType: favorite.car.fuelType,
                  seats: favorite.car.seats,
                  category: favorite.car.category,
                  images: favorite.car.images.map(img => ({ url: img.url, isPrimary: false })),
                  owner: favorite.car.owner ? {
                    firstName: favorite.car.owner.firstName,
                    lastName: favorite.car.owner.lastName,
                    avatarUrl: favorite.car.owner.avatarUrl,
                    rating: 4.8
                  } : undefined
                }} 
                showOwner 
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No saved cars yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When you find a car you love, click the heart icon to save it here for easy access later.
              </p>
              <Button asChild className="rounded-full">
                <Link href="/cars">
                  Explore Cars
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
