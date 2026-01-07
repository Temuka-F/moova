'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Star, 
  MessageSquare,
  Car,
  Filter,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  reviewer: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
  car: {
    id: string
    make: string
    model: string
    year: number
    images: { url: string }[]
  }
  booking: {
    id: string
    startDate: string
    endDate: string
  }
}

export default function ReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Fetch bookings to get reviews
        const bookingsRes = await fetch('/api/bookings?type=host&status=COMPLETED')
        if (!bookingsRes.ok) {
          if (bookingsRes.status === 401 || bookingsRes.status === 403) {
            router.push('/login?redirect=/dashboard/reviews')
            return
          }
          throw new Error('Failed to fetch reviews')
        }
        const bookingsData = await bookingsRes.json()
        const bookings = bookingsData.bookings || []

        // Extract reviews from bookings
        const reviewsList = bookings
          .filter((b: any) => b.review)
          .map((b: any) => ({
            id: b.review.id,
            rating: b.review.rating,
            comment: b.review.comment,
            createdAt: b.review.createdAt,
            reviewer: b.renter,
            car: b.car,
            booking: {
              id: b.id,
              startDate: b.startDate,
              endDate: b.endDate,
            },
          }))

        setReviews(reviewsList)
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [router])

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => {
        if (filter === '5') return r.rating === 5
        if (filter === '4') return r.rating === 4
        if (filter === '3') return r.rating === 3
        if (filter === '2') return r.rating === 2
        if (filter === '1') return r.rating === 1
        return true
      })

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} • {averageRating.toFixed(1)} average rating
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-32 min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href={`/cars/${review.car.id}`}
                    className="w-full sm:w-24 h-40 sm:h-24 rounded-xl bg-cover bg-center shrink-0 bg-muted"
                    style={{
                      backgroundImage: review.car.images?.[0]?.url 
                        ? `url('${review.car.images[0].url}')`
                        : undefined,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/cars/${review.car.id}`} className="hover:underline">
                          <h3 className="font-semibold text-base sm:text-lg mb-1">
                            {review.car.make} {review.car.model} {review.car.year}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by {review.reviewer.firstName} {review.reviewer.lastName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm sm:text-base text-muted-foreground mb-2">{review.comment}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), 'MMM d, yyyy')} • 
                      Trip: {format(new Date(review.booking.startDate), 'MMM d')} - {format(new Date(review.booking.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'Reviews from completed trips will appear here'
                : `No ${filter}-star reviews found`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
