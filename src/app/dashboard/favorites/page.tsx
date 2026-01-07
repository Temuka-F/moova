'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CarCard } from '@/components/cars/CarCard'
import { Heart, Car, ArrowRight } from 'lucide-react'
import { DUMMY_CARS } from '@/lib/dummy-data'

// Simulated favorites - first 3 cars
const favoriteCars = DUMMY_CARS.slice(0, 3).map(car => ({
  ...car,
  images: car.images,
  owner: {
    firstName: 'Host',
    lastName: '',
    avatarUrl: null,
    rating: 4.8
  }
}))

export default function FavoritesPage() {
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

        {favoriteCars.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteCars.map((car) => (
              <CarCard key={car.id} car={car} showOwner />
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
