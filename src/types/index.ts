import type {
  User,
  Car,
  CarImage,
  Booking,
  Review,
  Message,
  Notification,
  Availability,
  Transmission,
  FuelType,
  CarCategory,
  CarStatus,
  BookingStatus,
  PaymentStatus,
  UserRole,
  VerificationStatus,
  AdminLog,
  AdminAction,
} from '@prisma/client'

// Re-export Prisma types
export type {
  User,
  Car,
  CarImage,
  Booking,
  Review,
  Message,
  Notification,
  Availability,
  Transmission,
  FuelType,
  CarCategory,
  CarStatus,
  BookingStatus,
  PaymentStatus,
  UserRole,
  VerificationStatus,
  AdminLog,
  AdminAction,
}

// Extended types with relations
export type CarWithImages = Car & {
  images: CarImage[]
}

export type CarWithOwner = Car & {
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'verificationStatus'>
  images: CarImage[]
  _count?: {
    bookings: number
    reviews: number
  }
}

export type CarWithDetails = Car & {
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'verificationStatus' | 'createdAt' | 'responseRate' | 'responseTime' | 'bio'>
  images: CarImage[]
  reviews: (Review & {
    reviewer: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>
  })[]
  _count: {
    bookings: number
    reviews: number
  }
}

export type BookingWithDetails = Booking & {
  car: CarWithImages & {
    owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'phone'>
  }
  renter: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'phone' | 'verificationStatus'>
  review?: Review | null
}

export type UserWithStats = User & {
  _count: {
    cars: number
    bookingsAsRenter: number
    reviewsReceived: number
  }
  cars?: CarWithImages[]
}

// Search & Filter types
export interface CarSearchParams {
  city?: string
  startDate?: string
  endDate?: string
  category?: CarCategory
  transmission?: Transmission
  fuelType?: FuelType
  minPrice?: number
  maxPrice?: number
  features?: string[]
  seats?: number
  isInstantBook?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest'
  page?: number
  limit?: number
}

export interface SearchResult {
  cars: CarWithOwner[]
  total: number
  page: number
  totalPages: number
}

// Booking form types
export interface BookingFormData {
  carId: string
  startDate: Date
  endDate: Date
  pickupLocation: string
  returnLocation?: string
  renterNote?: string
}

// Review form types
export interface ReviewFormData {
  rating: number
  cleanliness?: number
  communication?: number
  accuracy?: number
  value?: number
  comment?: string
}

// Car form types for listing
export interface CarFormData {
  make: string
  model: string
  year: number
  licensePlate: string
  vin?: string
  color: string
  transmission: Transmission
  fuelType: FuelType
  seats: number
  doors: number
  category: CarCategory
  features: string[]
  city: string
  address: string
  latitude: number
  longitude: number
  pricePerDay: number
  pricePerHour?: number
  securityDeposit: number
  minRentalDays: number
  maxRentalDays: number
  mileageLimit?: number
  extraMileageFee?: number
  currentMileage: number
  isInstantBook: boolean
  description?: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string | null
  role: UserRole
  verificationStatus: VerificationStatus
  isEmailVerified: boolean
  isPhoneVerified: boolean
}

// Admin types
export interface AdminStats {
  totalUsers: number
  totalCars: number
  totalBookings: number
  totalRevenue: number
  pendingVerifications: number
  pendingCarApprovals: number
  activeBookings: number
  recentUsers: UserWithStats[]
  recentCars: CarWithOwner[]
  recentBookings: BookingWithDetails[]
}

export interface UserFilters {
  role?: UserRole
  verificationStatus?: VerificationStatus
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

// Georgian cities
export const GEORGIAN_CITIES = [
  'Tbilisi',
  'Batumi',
  'Kutaisi',
  'Rustavi',
  'Zugdidi',
  'Gori',
  'Poti',
  'Samtredia',
  'Khashuri',
  'Senaki',
  'Zestafoni',
  'Marneuli',
  'Telavi',
  'Akhaltsikhe',
  'Kobuleti',
  'Ozurgeti',
  'Kaspi',
  'Chiatura',
  'Tskaltubo',
  'Sagarejo',
] as const

export type GeorgianCity = typeof GEORGIAN_CITIES[number]

// Car makes
export const CAR_MAKES = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Ford',
  'Honda',
  'Hyundai',
  'Kia',
  'Lexus',
  'Mazda',
  'Mercedes-Benz',
  'Mitsubishi',
  'Nissan',
  'Opel',
  'Peugeot',
  'Porsche',
  'Renault',
  'Subaru',
  'Suzuki',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
] as const

// Car features list
export const CAR_FEATURES = [
  'Air Conditioning',
  'GPS Navigation',
  'Bluetooth',
  'USB Port',
  'Backup Camera',
  'Sunroof',
  'Leather Seats',
  'Heated Seats',
  'Cruise Control',
  'Apple CarPlay',
  'Android Auto',
  'Keyless Entry',
  'Child Seat',
  'Roof Rack',
  'Ski Rack',
  'Bike Rack',
  '4WD/AWD',
  'Snow Tires',
  'Dash Cam',
] as const

export type CarFeature = typeof CAR_FEATURES[number]

// Transmission types
export const TRANSMISSIONS = [
  'AUTOMATIC',
  'MANUAL',
] as const

// Fuel types
export const FUEL_TYPES = [
  'PETROL',
  'DIESEL',
  'ELECTRIC',
  'HYBRID',
  'LPG',
] as const

// Car categories
export const CAR_CATEGORIES = [
  'ECONOMY',
  'COMPACT',
  'MIDSIZE',
  'FULLSIZE',
  'SUV',
  'LUXURY',
  'SPORTS',
  'VAN',
  'PICKUP',
] as const

// Dashboard navigation based on role and active profile mode
export const getDashboardNavigation = (role: UserRole, activeProfileMode?: UserRole | null) => {
  const common = [
    { name: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Messages', href: '/dashboard/messages', icon: 'MessageCircle' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'User' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  ]

  const renterNav = [
    { name: 'My Bookings', href: '/dashboard/bookings', icon: 'Calendar' },
    { name: 'Favorites', href: '/dashboard/favorites', icon: 'Heart' },
  ]

  const ownerNav = [
    { name: 'My Bookings', href: '/dashboard/bookings', icon: 'Calendar' },
    { name: 'My Cars', href: '/dashboard/cars', icon: 'Car' },
    { name: 'Earnings', href: '/dashboard/earnings', icon: 'Wallet' },
    { name: 'Reviews', href: '/dashboard/reviews', icon: 'Star' },
    { name: 'Favorites', href: '/dashboard/favorites', icon: 'Heart' },
  ]

  const adminNav = [
    { name: 'Users', href: '/admin/users', icon: 'Users' },
    { name: 'Cars', href: '/admin/cars', icon: 'Car' },
    { name: 'Bookings', href: '/admin/bookings', icon: 'Calendar' },
    { name: 'Verifications', href: '/admin/verifications', icon: 'Shield' },
    { name: 'Payouts', href: '/admin/payouts', icon: 'Wallet' },
    { name: 'Reports', href: '/admin/reports', icon: 'BarChart' },
    { name: 'Logs', href: '/admin/logs', icon: 'FileText' },
    { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ]

  // For OWNER users, use activeProfileMode if set, otherwise use role
  const effectiveMode = role === 'OWNER' && activeProfileMode ? activeProfileMode : role

  switch (effectiveMode) {
    case 'ADMIN':
      return adminNav
    case 'OWNER':
      return [...common.slice(0, 1), ...ownerNav, ...common.slice(1)]
    case 'RENTER':
    default:
      return [...common.slice(0, 1), ...renterNav, ...common.slice(1)]
  }
}
