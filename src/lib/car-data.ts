/**
 * Car Data Fetching with Hybrid Mode
 * 
 * Fetches real cars from Supabase/Prisma first.
 * Falls back to mock data if DB is empty or fails.
 * Ensures the app never looks empty to visitors.
 */

import { ALL_CARS, MapCar, CityName, getCarsByCity as getMockCarsByCity } from './map-cars'

// API response types for type safety
interface ApiCarImage {
  id: string
  url: string
  isPrimary: boolean
}

interface ApiCarOwner {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  verificationStatus?: string
}

interface ApiCarReview {
  id: string
  rating: number
  comment?: string
}

interface ApiCar {
  id: string
  make: string
  model: string
  year: number
  color: string
  latitude: number
  longitude: number
  pricePerDay: number
  pricePerHour?: number | null
  city: string
  address: string
  category?: string
  fuelType?: string
  transmission?: string
  features?: string[]
  isInstantBook?: boolean
  seats?: number
  doors?: number
  securityDeposit?: number
  mileageLimit?: number | null
  description?: string | null
  createdAt?: string
  images?: ApiCarImage[]
  owner?: ApiCarOwner
  reviews?: ApiCarReview[]
  _count?: {
    bookings?: number
    reviews?: number
  }
}

interface FetchCarsOptions {
  city?: CityName
  category?: string
  minPrice?: number
  maxPrice?: number
  isInstantBook?: boolean
  sortBy?: 'rating' | 'price-asc' | 'price-desc' | 'reviews'
}

interface FetchCarsResult {
  cars: MapCar[]
  isRealData: boolean
  error?: string
}

/**
 * Fetches cars from the API with mock data fallback
 */
export async function fetchCarsWithFallback(options: FetchCarsOptions = {}): Promise<FetchCarsResult> {
  try {
    // Build query params
    const params = new URLSearchParams()
    if (options.city) params.append('city', options.city)
    if (options.category) params.append('category', options.category)
    if (options.minPrice) params.append('minPrice', options.minPrice.toString())
    if (options.maxPrice) params.append('maxPrice', options.maxPrice.toString())
    if (options.isInstantBook) params.append('isInstantBook', 'true')

    // Try to fetch from API
    const response = await fetch(`/api/cars?${params.toString()}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()

    // If we have real cars, transform and return them
    if (data.cars && data.cars.length > 0) {
      const transformedCars = transformApiCarsToMapCars(data.cars)
      return {
        cars: transformedCars,
        isRealData: true,
      }
    }

    // DB is empty, fall back to mock data
    console.log('📦 Database empty - using mock data for display')
    return {
      cars: options.city ? getMockCarsByCity(options.city) : ALL_CARS,
      isRealData: false,
    }

  } catch (error) {
    // API failed, fall back to mock data
    console.log('⚠️ API error - using mock data fallback:', error)
    return {
      cars: options.city ? getMockCarsByCity(options.city) : ALL_CARS,
      isRealData: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Transforms API car data to MapCar format
 */
function transformApiCarsToMapCars(apiCars: ApiCar[]): MapCar[] {
  return apiCars.map((car): MapCar => ({
    id: car.id,
    lat: car.latitude,
    lng: car.longitude,
    price: car.pricePerDay,
    pricePerHour: car.pricePerHour || Math.round(car.pricePerDay / 6),
    model: car.model,
    make: car.make,
    year: car.year,
    color: car.color,
    isWinterReady: car.features?.includes('4WD/AWD') || car.features?.includes('Snow Tires') || false,
    images: car.images?.map((img) => img.url) || [],
    category: (car.category as 'SUV' | 'SEDAN' | 'COMPACT' | 'LUXURY' | 'SPORTS') || 'SEDAN',
    fuelType: (car.fuelType as 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID') || 'PETROL',
    rating: calculateAverageRating(car.reviews) || 4.5,
    reviewCount: car._count?.reviews || car.reviews?.length || 0,
    features: car.features || [],
    isInstantBook: car.isInstantBook || false,
    transmission: (car.transmission as 'AUTOMATIC' | 'MANUAL') || 'AUTOMATIC',
    city: car.city as CityName,
    address: car.address,
    seats: car.seats || 5,
    doors: car.doors || 4,
    securityDeposit: car.securityDeposit || 200,
    mileageLimit: car.mileageLimit,
    owner: {
      id: car.owner?.id || 'unknown',
      firstName: car.owner?.firstName || 'Host',
      lastName: car.owner?.lastName || '',
      avatarUrl: car.owner?.avatarUrl || null,
      rating: 4.8, // Default host rating
      responseTime: '< 1 hour',
      tripsCount: car._count?.bookings || 0,
      memberSince: new Date(car.createdAt || Date.now()).getFullYear().toString(),
      isVerified: car.owner?.verificationStatus === 'VERIFIED',
    },
    description: car.description || `${car.make} ${car.model} available for rent in ${car.city}.`,
  }))
}

/**
 * Calculates average rating from reviews
 */
function calculateAverageRating(reviews?: ApiCarReview[]): number {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

/**
 * Checks if the database has any cars
 */
export async function checkDatabaseHasCars(): Promise<boolean> {
  try {
    const response = await fetch('/api/cars?limit=1', { cache: 'no-store' })
    if (!response.ok) return false
    const data = await response.json()
    return data.total > 0
  } catch {
    return false
  }
}

/**
 * Gets the data source status for admin/debug purposes
 */
export function getDataSourceLabel(isRealData: boolean): string {
  return isRealData ? '🔴 Live Data' : '🟡 Demo Data'
}
