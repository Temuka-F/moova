// Map-ready car data for Moova car rental PWA
// Cars distributed around Tbilisi with winter-ready options

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
}

export const MAP_CARS: MapCar[] = [
  {
    id: 'map-car-1',
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
  },
  {
    id: 'map-car-2',
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
  },
  {
    id: 'map-car-3',
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
  },
  {
    id: 'map-car-4',
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
  },
  {
    id: 'map-car-5',
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
  },
  {
    id: 'map-car-6',
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
  },
  {
    id: 'map-car-7',
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
  },
  {
    id: 'map-car-8',
    lat: 41.7225,
    lng: 44.8135,
    price: 95,
    model: 'Forester',
    make: 'Subaru',
    year: 2022,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1619976215249-0bfc6be0d8fe?w=800',
    category: 'SUV',
    fuelType: 'PETROL',
    rating: 4.8,
    reviewCount: 29,
    features: ['4WD/AWD', 'Snow Tires', 'Roof Rack', 'Ski Rack', 'Heated Seats'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
  },
  {
    id: 'map-car-9',
    lat: 41.6978,
    lng: 44.7723,
    price: 180,
    model: 'GLE',
    make: 'Mercedes-Benz',
    year: 2023,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    category: 'LUXURY',
    fuelType: 'DIESEL',
    rating: 4.9,
    reviewCount: 21,
    features: ['4WD/AWD', 'Snow Tires', 'MBUX System', 'Ambient Lighting', 'Air Suspension'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
  },
  {
    id: 'map-car-10',
    lat: 41.7381,
    lng: 44.8234,
    price: 55,
    model: 'Corolla',
    make: 'Toyota',
    year: 2023,
    isWinterReady: false,
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
    category: 'SEDAN',
    fuelType: 'HYBRID',
    rating: 4.7,
    reviewCount: 43,
    features: ['Fuel Efficient', 'Apple CarPlay', 'Android Auto', 'Safety Sense'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
  },
]

// Gudauri-specific cars (for winter mode)
export const GUDAURI_CARS: MapCar[] = [
  {
    id: 'gudauri-car-1',
    lat: 42.4801,
    lng: 44.4789,
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
  },
  {
    id: 'gudauri-car-2',
    lat: 42.4756,
    lng: 44.4834,
    price: 110,
    model: 'Pajero Sport',
    make: 'Mitsubishi',
    year: 2023,
    isWinterReady: true,
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    category: 'SUV',
    fuelType: 'DIESEL',
    rating: 4.8,
    reviewCount: 34,
    features: ['4WD/AWD', 'Snow Tires', 'Super Select 4WD', 'Heated Seats'],
    isInstantBook: true,
    transmission: 'AUTOMATIC',
  },
  {
    id: 'gudauri-car-3',
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
  },
]

// Filter helpers
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
