// Map-ready car data for Moova car rental PWA
// Cars distributed across Georgia: Tbilisi, Batumi, Kutaisi, Gudauri

export interface MapCar {
  id: string
  lat: number
  lng: number
  price: number
  model: string
  make: string
  year: number
  isWinterReady: boolean
  imageUrl: string
  category: 'SUV' | 'SEDAN' | 'COMPACT' | 'LUXURY' | 'SPORTS'
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'
  rating: number
  reviewCount: number
  features: string[]
  isInstantBook: boolean
  transmission: 'AUTOMATIC' | 'MANUAL'
  city: 'Tbilisi' | 'Batumi' | 'Kutaisi' | 'Gudauri'
}

// City coordinates
export const CITIES = {
  Tbilisi: { lat: 41.7151, lng: 44.8271, zoom: 12, label: '🏙️ Tbilisi' },
  Batumi: { lat: 41.6168, lng: 41.6367, zoom: 13, label: '🏖️ Batumi' },
  Kutaisi: { lat: 42.2662, lng: 42.7180, zoom: 13, label: '🏛️ Kutaisi' },
  Gudauri: { lat: 42.4784, lng: 44.4842, zoom: 14, label: '🏔️ Gudauri' },
} as const

export type CityName = keyof typeof CITIES

// All cars across Georgia - 15 cars
export const ALL_CARS: MapCar[] = [
  // ===== TBILISI (7 cars) =====
  {
    id: 'tbilisi-1',
    lat: 41.7151,
    lng: 44.8271,
    price: 120,
    model: 'Land Cruiser Prado',
    make: 'Toyota',
    year: 2023,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    category: 'SUV',
    fuelType: 'DIESEL',
    rating: 4.9,
    reviewCount: 47,
    features: ['4WD/AWD', 'Snow Tires', 'Heated Seats', 'GPS Navigation', 'Ski Rack'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Tbilisi',
  },
  {
    id: 'tbilisi-2',
    lat: 41.7089,
    lng: 44.7478,
    price: 85,
    model: 'Tucson',
    make: 'Hyundai',
    year: 2022,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1633695610681-8477dcfd5c33?w=800',
    category: 'SUV',
    fuelType: 'PETROL',
    rating: 4.7,
    reviewCount: 32,
    features: ['4WD/AWD', 'Snow Tires', 'Backup Camera', 'Bluetooth'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Tbilisi',
  },
  {
    id: 'tbilisi-3',
    lat: 41.7215,
    lng: 44.7665,
    price: 200,
    model: 'Model Y',
    make: 'Tesla',
    year: 2024,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    category: 'SUV',
    fuelType: 'ELECTRIC',
    rating: 5.0,
    reviewCount: 18,
    features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Supercharger Access'],
    isInstantBook: false,
    transmission: 'AUTOMATIC',
    city: 'Tbilisi',
  },
  {
    id: 'tbilisi-4',
    lat: 41.7320,
    lng: 44.7890,
    price: 60,
    model: 'Camry',
    make: 'Toyota',
    year: 2021,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    category: 'SEDAN',
    fuelType: 'HYBRID',
    rating: 4.8,
    reviewCount: 56,
    features: ['Fuel Efficient', 'Bluetooth', 'Cruise Control', 'USB Port'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Tbilisi',
  },
  {
    id: 'tbilisi-5',
    lat: 41.6934,
    lng: 44.8015,
    price: 150,
    model: 'X5',
    make: 'BMW',
    year: 2023,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    category: 'LUXURY',
    fuelType: 'DIESEL',
    rating: 4.9,
    reviewCount: 24,
    features: ['4WD/AWD', 'Snow Tires', 'Leather Seats', 'Panoramic Roof', 'Heated Steering'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Tbilisi',
  },
  {
    id: 'tbilisi-6',
    lat: 41.7452,
    lng: 44.7891,
    price: 45,
    model: 'Golf',
    make: 'Volkswagen',
    year: 2022,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800',
    category: 'COMPACT',
    fuelType: 'PETROL',
    rating: 4.6,
    reviewCount: 38,
    features: ['Fuel Efficient', 'Bluetooth', 'USB Port', 'Air Conditioning'],
    isInstantBook: true,
    transmission: 'MANUAL',
    city: 'Tbilisi',
  },
  {
    id: 'tbilisi-7',
    lat: 41.7089,
    lng: 44.7856,
    price: 280,
    model: 'Cayenne',
    make: 'Porsche',
    year: 2023,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    category: 'LUXURY',
    fuelType: 'PETROL',
    rating: 5.0,
    reviewCount: 12,
    features: ['4WD/AWD', 'Snow Tires', 'Premium Audio', 'Sport Mode', 'Leather Interior'],
    isInstantBook: false,
    transmission: 'AUTOMATIC',
    city: 'Tbilisi',
  },

  // ===== BATUMI (4 cars) =====
  {
    id: 'batumi-1',
    lat: 41.6168,
    lng: 41.6367,
    price: 70,
    model: 'Corolla',
    make: 'Toyota',
    year: 2023,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
    category: 'SEDAN',
    fuelType: 'HYBRID',
    rating: 4.8,
    reviewCount: 34,
    features: ['Fuel Efficient', 'Apple CarPlay', 'Android Auto', 'Safety Sense'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Batumi',
  },
  {
    id: 'batumi-2',
    lat: 41.6234,
    lng: 41.6290,
    price: 55,
    model: 'Clio',
    make: 'Renault',
    year: 2022,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    category: 'COMPACT',
    fuelType: 'PETROL',
    rating: 4.5,
    reviewCount: 28,
    features: ['Fuel Efficient', 'Bluetooth', 'USB Port', 'Air Conditioning'],
    isInstantBook: true,
    transmission: 'MANUAL',
    city: 'Batumi',
  },
  {
    id: 'batumi-3',
    lat: 41.6089,
    lng: 41.6412,
    price: 180,
    model: 'E-Class',
    make: 'Mercedes-Benz',
    year: 2023,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    category: 'LUXURY',
    fuelType: 'DIESEL',
    rating: 4.9,
    reviewCount: 19,
    features: ['MBUX System', 'Ambient Lighting', 'Leather Seats', 'Premium Audio'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Batumi',
  },
  {
    id: 'batumi-4',
    lat: 41.6201,
    lng: 41.6523,
    price: 65,
    model: 'Sportage',
    make: 'Kia',
    year: 2022,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1619976215249-0bfc6be0d8fe?w=800',
    category: 'SUV',
    fuelType: 'PETROL',
    rating: 4.6,
    reviewCount: 41,
    features: ['Backup Camera', 'Bluetooth', 'Cruise Control', 'Roof Rails'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Batumi',
  },

  // ===== KUTAISI (2 cars) =====
  {
    id: 'kutaisi-1',
    lat: 42.2662,
    lng: 42.7180,
    price: 50,
    model: 'Focus',
    make: 'Ford',
    year: 2021,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800',
    category: 'COMPACT',
    fuelType: 'PETROL',
    rating: 4.4,
    reviewCount: 22,
    features: ['Fuel Efficient', 'Bluetooth', 'Air Conditioning'],
    isInstantBook: true,
    transmission: 'MANUAL',
    city: 'Kutaisi',
  },
  {
    id: 'kutaisi-2',
    lat: 42.2712,
    lng: 42.7089,
    price: 75,
    model: 'RAV4',
    make: 'Toyota',
    year: 2022,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
    category: 'SUV',
    fuelType: 'HYBRID',
    rating: 4.7,
    reviewCount: 35,
    features: ['4WD/AWD', 'Fuel Efficient', 'Backup Camera', 'Lane Assist'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Kutaisi',
  },

  // ===== GUDAURI (2 cars) =====
  {
    id: 'gudauri-1',
    lat: 42.4784,
    lng: 44.4842,
    price: 140,
    model: 'Land Cruiser 200',
    make: 'Toyota',
    year: 2022,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    category: 'SUV',
    fuelType: 'DIESEL',
    rating: 4.9,
    reviewCount: 67,
    features: ['4WD/AWD', 'Snow Chains', 'Heated Everything', 'Ski Rack', 'Mountain Ready'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
    city: 'Gudauri',
  },
  {
    id: 'gudauri-2',
    lat: 42.4823,
    lng: 44.4712,
    price: 160,
    model: 'Defender',
    make: 'Land Rover',
    year: 2023,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800',
    category: 'SUV',
    fuelType: 'DIESEL',
    rating: 5.0,
    reviewCount: 19,
    features: ['4WD/AWD', 'Terrain Response', 'Wade Sensing', 'Heated Windscreen'],
    isInstantBook: false,
    transmission: 'AUTOMATIC',
    city: 'Gudauri',
  },
]

// Filter helpers
export function getCarsByCity(city: CityName): MapCar[] {
  return ALL_CARS.filter(car => car.city === city)
}

export function getWinterReadyCars(cars: MapCar[]): MapCar[] {
  return cars.filter(car => car.isWinterReady)
}

export function getCarsByCategory(cars: MapCar[], category: MapCar['category']): MapCar[] {
  return cars.filter(car => car.category === category)
}

export function getCarsByFuelType(cars: MapCar[], fuelType: MapCar['fuelType']): MapCar[] {
  return cars.filter(car => car.fuelType === fuelType)
}

export function getHybridElectricCars(cars: MapCar[]): MapCar[] {
  return cars.filter(car => car.fuelType === 'HYBRID' || car.fuelType === 'ELECTRIC')
}

export function getTopRatedCars(cars: MapCar[], limit = 5): MapCar[] {
  return [...cars].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

// Legacy exports for backward compatibility
export const MAP_CARS = ALL_CARS.filter(car => car.city === 'Tbilisi')
export const GUDAURI_CARS = ALL_CARS.filter(car => car.city === 'Gudauri')
