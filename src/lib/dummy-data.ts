// Comprehensive dummy data for Moova car sharing platform
// Simulating ~50 active users with realistic Georgian data

export const DUMMY_USERS = [
  { id: 'user-1', firstName: 'Giorgi', lastName: 'Beridze', email: 'giorgi.b@example.com', phone: '+995 555 123 456', role: 'OWNER', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-06-15', carsCount: 3, tripsCount: 47, rating: 4.9, responseTime: '< 1 hour', responseRate: 98 },
  { id: 'user-2', firstName: 'Nino', lastName: 'Kvlividze', email: 'nino.k@example.com', phone: '+995 555 234 567', role: 'OWNER', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-07-20', carsCount: 2, tripsCount: 31, rating: 4.8, responseTime: '< 30 min', responseRate: 100 },
  { id: 'user-3', firstName: 'Levan', lastName: 'Tskhadadze', email: 'levan.t@example.com', phone: '+995 555 345 678', role: 'OWNER', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-05-10', carsCount: 5, tripsCount: 89, rating: 5.0, responseTime: '< 15 min', responseRate: 99 },
  { id: 'user-4', firstName: 'Ana', lastName: 'Sturua', email: 'ana.s@example.com', phone: '+995 555 456 789', role: 'RENTER', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-08-01', carsCount: 0, tripsCount: 12, rating: 4.7, responseTime: null, responseRate: null },
  { id: 'user-5', firstName: 'David', lastName: 'Maisuradze', email: 'david.m@example.com', phone: '+995 555 567 890', role: 'RENTER', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-09-05', carsCount: 0, tripsCount: 8, rating: 4.9, responseTime: null, responseRate: null },
  { id: 'user-6', firstName: 'Mariam', lastName: 'Gabashvili', email: 'mariam.g@example.com', phone: '+995 555 678 901', role: 'OWNER', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-04-22', carsCount: 1, tripsCount: 23, rating: 4.6, responseTime: '< 2 hours', responseRate: 92 },
  { id: 'user-7', firstName: 'Irakli', lastName: 'Bolashvili', email: 'irakli.b@example.com', phone: '+995 555 789 012', role: 'RENTER', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-10-12', carsCount: 0, tripsCount: 5, rating: 5.0, responseTime: null, responseRate: null },
  { id: 'user-8', firstName: 'Tamar', lastName: 'Janelidze', email: 'tamar.j@example.com', phone: '+995 555 890 123', role: 'OWNER', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-03-18', carsCount: 2, tripsCount: 56, rating: 4.8, responseTime: '< 1 hour', responseRate: 97 },
  { id: 'user-9', firstName: 'Sandro', lastName: 'Papuashvili', email: 'sandro.p@example.com', phone: '+995 555 901 234', role: 'RENTER', avatarUrl: null, verificationStatus: 'VERIFIED', createdAt: '2024-11-01', carsCount: 0, tripsCount: 3, rating: 4.5, responseTime: null, responseRate: null },
  { id: 'user-10', firstName: 'Ketevan', lastName: 'Lomidze', email: 'ketevan.l@example.com', phone: '+995 555 012 345', role: 'OWNER', avatarUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150', verificationStatus: 'VERIFIED', createdAt: '2024-02-28', carsCount: 4, tripsCount: 112, rating: 4.9, responseTime: '< 30 min', responseRate: 100 },
]

export const DUMMY_CARS = [
  {
    id: 'car-1',
    ownerId: 'user-1',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    color: 'Black',
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    seats: 5,
    doors: 4,
    category: 'SUV',
    pricePerDay: 180,
    pricePerHour: 25,
    securityDeposit: 500,
    city: 'Tbilisi',
    address: 'Rustaveli Avenue 12',
    latitude: 41.7151,
    longitude: 44.8271,
    isInstantBook: true,
    rating: 4.9,
    reviewCount: 24,
    features: ['GPS Navigation', 'Leather Seats', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Bluetooth', 'Apple CarPlay'],
    images: [
      { id: 'img-1-1', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', isPrimary: true },
      { id: 'img-1-2', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', isPrimary: false },
      { id: 'img-1-3', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', isPrimary: false },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 25000,
    mileageLimit: 200,
  },
  {
    id: 'car-2',
    ownerId: 'user-2',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2022,
    color: 'Silver',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'LUXURY',
    pricePerDay: 200,
    pricePerHour: 30,
    securityDeposit: 600,
    city: 'Tbilisi',
    address: 'Chavchavadze Avenue 45',
    latitude: 41.7089,
    longitude: 44.7478,
    isInstantBook: true,
    rating: 4.8,
    reviewCount: 18,
    features: ['GPS Navigation', 'Leather Seats', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Bluetooth', 'Android Auto', 'Cruise Control'],
    images: [
      { id: 'img-2-1', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', isPrimary: true },
      { id: 'img-2-2', url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800', isPrimary: false },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 18000,
    mileageLimit: 250,
  },
  {
    id: 'car-3',
    ownerId: 'user-3',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'White',
    transmission: 'AUTOMATIC',
    fuelType: 'HYBRID',
    seats: 5,
    doors: 4,
    category: 'SEDAN',
    pricePerDay: 120,
    pricePerHour: 18,
    securityDeposit: 300,
    city: 'Tbilisi',
    address: 'Vake Park Area',
    latitude: 41.7215,
    longitude: 44.7665,
    isInstantBook: true,
    rating: 4.9,
    reviewCount: 47,
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Cruise Control', 'Keyless Entry'],
    images: [
      { id: 'img-3-1', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', isPrimary: true },
      { id: 'img-3-2', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', isPrimary: false },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 12000,
    mileageLimit: null,
  },
  {
    id: 'car-4',
    ownerId: 'user-3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    color: 'Red',
    transmission: 'AUTOMATIC',
    fuelType: 'ELECTRIC',
    seats: 5,
    doors: 4,
    category: 'SEDAN',
    pricePerDay: 220,
    pricePerHour: 35,
    securityDeposit: 700,
    city: 'Tbilisi',
    address: 'Saburtalo District',
    latitude: 41.7320,
    longitude: 44.7590,
    isInstantBook: false,
    rating: 5.0,
    reviewCount: 12,
    features: ['Autopilot', 'GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Keyless Entry', 'Premium Audio'],
    images: [
      { id: 'img-4-1', url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', isPrimary: true },
      { id: 'img-4-2', url: 'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800', isPrimary: false },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 5000,
    mileageLimit: 300,
  },
  {
    id: 'car-5',
    ownerId: 'user-6',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    color: 'Blue',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'SUV',
    pricePerDay: 100,
    pricePerHour: 15,
    securityDeposit: 250,
    city: 'Kutaisi',
    address: 'Central Kutaisi',
    latitude: 42.2679,
    longitude: 42.6946,
    isInstantBook: true,
    rating: 4.7,
    reviewCount: 19,
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning'],
    images: [
      { id: 'img-5-1', url: 'https://images.unsplash.com/photo-1633695610681-8477dcfd5c33?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 35000,
    mileageLimit: 200,
  },
  {
    id: 'car-6',
    ownerId: 'user-8',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2021,
    color: 'Gray',
    transmission: 'MANUAL',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'COMPACT',
    pricePerDay: 70,
    pricePerHour: 12,
    securityDeposit: 200,
    city: 'Tbilisi',
    address: 'Didube District',
    latitude: 41.7452,
    longitude: 44.7891,
    isInstantBook: true,
    rating: 4.6,
    reviewCount: 54,
    features: ['Bluetooth', 'USB Port', 'Air Conditioning', 'Cruise Control'],
    images: [
      { id: 'img-6-1', url: 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 48000,
    mileageLimit: null,
  },
  {
    id: 'car-7',
    ownerId: 'user-1',
    make: 'Audi',
    model: 'A4',
    year: 2022,
    color: 'Black',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'SEDAN',
    pricePerDay: 150,
    pricePerHour: 22,
    securityDeposit: 400,
    city: 'Batumi',
    address: 'Batumi Boulevard',
    latitude: 41.6458,
    longitude: 41.6416,
    isInstantBook: true,
    rating: 4.8,
    reviewCount: 15,
    features: ['GPS Navigation', 'Leather Seats', 'Bluetooth', 'USB Port', 'Backup Camera', 'Sunroof'],
    images: [
      { id: 'img-7-1', url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 22000,
    mileageLimit: 200,
  },
  {
    id: 'car-8',
    ownerId: 'user-10',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2023,
    color: 'White',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'LUXURY',
    pricePerDay: 350,
    pricePerHour: 50,
    securityDeposit: 1000,
    city: 'Tbilisi',
    address: 'Vera District',
    latitude: 41.7089,
    longitude: 44.7856,
    isInstantBook: false,
    rating: 5.0,
    reviewCount: 8,
    features: ['GPS Navigation', 'Leather Seats', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Bluetooth', 'Premium Audio', '4WD/AWD'],
    images: [
      { id: 'img-8-1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 8000,
    mileageLimit: 150,
  },
  {
    id: 'car-9',
    ownerId: 'user-3',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    color: 'Green',
    transmission: 'AUTOMATIC',
    fuelType: 'HYBRID',
    seats: 5,
    doors: 4,
    category: 'SUV',
    pricePerDay: 110,
    pricePerHour: 16,
    securityDeposit: 300,
    city: 'Tbilisi',
    address: 'Gldani District',
    latitude: 41.7812,
    longitude: 44.8234,
    isInstantBook: true,
    rating: 4.7,
    reviewCount: 22,
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning', 'Roof Rack'],
    images: [
      { id: 'img-9-1', url: 'https://images.unsplash.com/photo-1568844293986-8c8a3f6f4f29?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 42000,
    mileageLimit: null,
  },
  {
    id: 'car-10',
    ownerId: 'user-2',
    make: 'Nissan',
    model: 'Qashqai',
    year: 2022,
    color: 'Orange',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'SUV',
    pricePerDay: 95,
    pricePerHour: 14,
    securityDeposit: 250,
    city: 'Batumi',
    address: 'New Boulevard',
    latitude: 41.6389,
    longitude: 41.6321,
    isInstantBook: true,
    rating: 4.5,
    reviewCount: 13,
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning'],
    images: [
      { id: 'img-10-1', url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 28000,
    mileageLimit: 200,
  },
  {
    id: 'car-11',
    ownerId: 'user-10',
    make: 'Lexus',
    model: 'RX 350',
    year: 2023,
    color: 'Silver',
    transmission: 'AUTOMATIC',
    fuelType: 'HYBRID',
    seats: 5,
    doors: 4,
    category: 'LUXURY',
    pricePerDay: 280,
    pricePerHour: 40,
    securityDeposit: 800,
    city: 'Tbilisi',
    address: 'Mtatsminda District',
    latitude: 41.6934,
    longitude: 44.8015,
    isInstantBook: true,
    rating: 4.9,
    reviewCount: 16,
    features: ['GPS Navigation', 'Leather Seats', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Bluetooth', 'Premium Audio', 'Keyless Entry'],
    images: [
      { id: 'img-11-1', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 15000,
    mileageLimit: 200,
  },
  {
    id: 'car-12',
    ownerId: 'user-8',
    make: 'Ford',
    model: 'Mustang',
    year: 2022,
    color: 'Yellow',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 4,
    doors: 2,
    category: 'SPORTS',
    pricePerDay: 250,
    pricePerHour: 38,
    securityDeposit: 700,
    city: 'Tbilisi',
    address: 'Heroes Square',
    latitude: 41.7225,
    longitude: 44.7935,
    isInstantBook: false,
    rating: 4.9,
    reviewCount: 21,
    features: ['GPS Navigation', 'Leather Seats', 'Bluetooth', 'USB Port', 'Backup Camera', 'Premium Audio'],
    images: [
      { id: 'img-12-1', url: 'https://images.unsplash.com/photo-1584345604476-8ec5f82bd3a5?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 19000,
    mileageLimit: 150,
  },
  {
    id: 'car-13',
    ownerId: 'user-10',
    make: 'Kia',
    model: 'Sportage',
    year: 2023,
    color: 'Red',
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    seats: 5,
    doors: 4,
    category: 'SUV',
    pricePerDay: 90,
    pricePerHour: 14,
    securityDeposit: 250,
    city: 'Rustavi',
    address: 'Central Rustavi',
    latitude: 41.5493,
    longitude: 45.0086,
    isInstantBook: true,
    rating: 4.6,
    reviewCount: 28,
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning', 'Cruise Control'],
    images: [
      { id: 'img-13-1', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 32000,
    mileageLimit: null,
  },
  {
    id: 'car-14',
    ownerId: 'user-3',
    make: 'Mazda',
    model: 'CX-5',
    year: 2022,
    color: 'Blue',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'SUV',
    pricePerDay: 105,
    pricePerHour: 16,
    securityDeposit: 280,
    city: 'Tbilisi',
    address: 'Isani District',
    latitude: 41.6923,
    longitude: 44.8456,
    isInstantBook: true,
    rating: 4.8,
    reviewCount: 33,
    features: ['GPS Navigation', 'Leather Seats', 'Bluetooth', 'USB Port', 'Backup Camera', 'Sunroof', 'Heated Seats'],
    images: [
      { id: 'img-14-1', url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 27000,
    mileageLimit: 200,
  },
  {
    id: 'car-15',
    ownerId: 'user-1',
    make: 'Subaru',
    model: 'Forester',
    year: 2021,
    color: 'Green',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    category: 'SUV',
    pricePerDay: 95,
    pricePerHour: 15,
    securityDeposit: 260,
    city: 'Gudauri',
    address: 'Gudauri Resort Area',
    latitude: 42.4801,
    longitude: 44.4789,
    isInstantBook: true,
    rating: 4.7,
    reviewCount: 41,
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', '4WD/AWD', 'Snow Tires', 'Roof Rack', 'Ski Rack'],
    images: [
      { id: 'img-15-1', url: 'https://images.unsplash.com/photo-1619976215249-0bfc6be0d8fe?w=800', isPrimary: true },
    ],
    status: 'APPROVED',
    isActive: true,
    currentMileage: 45000,
    mileageLimit: null,
  },
]

export const DUMMY_BOOKINGS = [
  {
    id: 'booking-1',
    carId: 'car-1',
    renterId: 'user-4',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'CONFIRMED',
    totalAmount: 540,
    dailyRate: 180,
    totalDays: 3,
    serviceFee: 81,
    pickupLocation: 'Rustaveli Avenue 12, Tbilisi',
  },
  {
    id: 'booking-2',
    carId: 'car-3',
    renterId: 'user-5',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    totalAmount: 360,
    dailyRate: 120,
    totalDays: 3,
    serviceFee: 54,
    pickupLocation: 'Vake Park Area, Tbilisi',
  },
  {
    id: 'booking-3',
    carId: 'car-2',
    renterId: 'user-7',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    totalAmount: 800,
    dailyRate: 200,
    totalDays: 4,
    serviceFee: 120,
    pickupLocation: 'Chavchavadze Avenue 45, Tbilisi',
  },
  {
    id: 'booking-4',
    carId: 'car-5',
    renterId: 'user-9',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED',
    totalAmount: 300,
    dailyRate: 100,
    totalDays: 3,
    serviceFee: 45,
    pickupLocation: 'Central Kutaisi',
  },
  {
    id: 'booking-5',
    carId: 'car-4',
    renterId: 'user-4',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED',
    totalAmount: 1100,
    dailyRate: 220,
    totalDays: 5,
    serviceFee: 165,
    pickupLocation: 'Saburtalo District, Tbilisi',
  },
]

export const DUMMY_REVIEWS = [
  {
    id: 'review-1',
    bookingId: 'booking-4',
    carId: 'car-5',
    reviewerId: 'user-9',
    rating: 5,
    cleanliness: 5,
    communication: 5,
    accuracy: 5,
    comment: 'Amazing car and great host! The Hyundai Tucson was perfect for our trip to Kutaisi. Very clean and well-maintained.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-2',
    bookingId: 'booking-5',
    carId: 'car-4',
    reviewerId: 'user-4',
    rating: 5,
    cleanliness: 5,
    communication: 5,
    accuracy: 5,
    comment: 'The Tesla Model 3 exceeded all expectations! Super smooth ride and Levan was incredibly helpful with explaining all the features.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-3',
    bookingId: 'booking-1',
    carId: 'car-1',
    reviewerId: 'user-4',
    rating: 5,
    cleanliness: 5,
    communication: 4,
    accuracy: 5,
    comment: 'Beautiful BMW X5, drove like a dream. Perfect for exploring Tbilisi. Will definitely rent again!',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const DUMMY_MESSAGES = [
  {
    id: 'msg-1',
    bookingId: 'booking-1',
    senderId: 'user-4',
    receiverId: 'user-1',
    content: 'Hi Giorgi! I\'m excited about picking up the BMW X5 on Friday. Will you be available at 10 AM?',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'msg-2',
    bookingId: 'booking-1',
    senderId: 'user-1',
    receiverId: 'user-4',
    content: 'Hello Ana! Yes, 10 AM works perfectly for me. I\'ll have the car ready and fueled up for you. See you then!',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    isRead: true,
  },
  {
    id: 'msg-3',
    bookingId: 'booking-3',
    senderId: 'user-7',
    receiverId: 'user-2',
    content: 'The E-Class is amazing! Quick question - where\'s the best place to get it washed before I return it?',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
]

export const DUMMY_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'BOOKING_REQUEST',
    title: 'New Booking Request',
    message: 'Ana S. wants to book your BMW X5 for 3 days',
    data: { bookingId: 'booking-1' },
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'user-4',
    type: 'BOOKING_CONFIRMED',
    title: 'Booking Confirmed!',
    message: 'Your booking for BMW X5 has been confirmed by Giorgi B.',
    data: { bookingId: 'booking-1' },
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'user-2',
    type: 'MESSAGE_RECEIVED',
    title: 'New Message',
    message: 'Irakli B. sent you a message about Mercedes-Benz E-Class',
    data: { messageId: 'msg-3' },
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper functions
export function getCarById(id: string) {
  const car = DUMMY_CARS.find(c => c.id === id)
  if (!car) return null
  const owner = DUMMY_USERS.find(u => u.id === car.ownerId)
  const reviews = DUMMY_REVIEWS.filter(r => r.carId === id).map(review => ({
    ...review,
    reviewer: DUMMY_USERS.find(u => u.id === review.reviewerId)
  }))
  return { ...car, owner, reviews }
}

export function getUserById(id: string) {
  return DUMMY_USERS.find(u => u.id === id)
}

export function getCarsByCity(city: string) {
  return DUMMY_CARS.filter(c => c.city.toLowerCase() === city.toLowerCase())
}

export function getCarsByOwner(ownerId: string) {
  return DUMMY_CARS.filter(c => c.ownerId === ownerId)
}

export function getBookingsByUser(userId: string) {
  return DUMMY_BOOKINGS.filter(b => b.renterId === userId).map(booking => ({
    ...booking,
    car: DUMMY_CARS.find(c => c.id === booking.carId)
  }))
}

export function getBookingsByHost(hostId: string) {
  const hostCars = getCarsByOwner(hostId)
  const carIds = hostCars.map(c => c.id)
  return DUMMY_BOOKINGS.filter(b => carIds.includes(b.carId)).map(booking => ({
    ...booking,
    car: DUMMY_CARS.find(c => c.id === booking.carId),
    renter: DUMMY_USERS.find(u => u.id === booking.renterId)
  }))
}

export function searchCars(filters: {
  city?: string
  minPrice?: number
  maxPrice?: number
  transmission?: string
  fuelType?: string
  category?: string
  features?: string[]
  isInstantBook?: boolean
}) {
  return DUMMY_CARS.filter(car => {
    if (filters.city && car.city.toLowerCase() !== filters.city.toLowerCase()) return false
    if (filters.minPrice && car.pricePerDay < filters.minPrice) return false
    if (filters.maxPrice && car.pricePerDay > filters.maxPrice) return false
    if (filters.transmission && car.transmission !== filters.transmission) return false
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false
    if (filters.category && car.category !== filters.category) return false
    if (filters.isInstantBook !== undefined && car.isInstantBook !== filters.isInstantBook) return false
    if (filters.features && filters.features.length > 0) {
      if (!filters.features.every(f => car.features.includes(f))) return false
    }
    return true
  }).map(car => ({
    ...car,
    owner: DUMMY_USERS.find(u => u.id === car.ownerId)
  }))
}

// Stats for dashboard
export function getHostStats(hostId: string) {
  const cars = getCarsByOwner(hostId)
  const bookings = getBookingsByHost(hostId)
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
  const activeBookings = bookings.filter(b => b.status === 'ACTIVE')
  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0)
  
  return {
    totalCars: cars.length,
    activeCars: cars.filter(c => c.isActive).length,
    totalBookings: bookings.length,
    completedBookings: completedBookings.length,
    activeBookings: activeBookings.length,
    pendingBookings: pendingBookings.length,
    totalEarnings,
    avgRating: cars.length > 0 ? cars.reduce((sum, c) => sum + c.rating, 0) / cars.length : 0,
  }
}

export function getRenterStats(userId: string) {
  const bookings = getBookingsByUser(userId)
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
  const upcomingBookings = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status))
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0)
  
  return {
    totalTrips: completedBookings.length,
    upcomingTrips: upcomingBookings.length,
    totalSpent,
    savedCars: 3, // Mock favorites count
  }
}

export function getAdminStats() {
  const totalUsers = DUMMY_USERS.length
  const totalCars = DUMMY_CARS.length
  const totalBookings = DUMMY_BOOKINGS.length
  const activeBookings = DUMMY_BOOKINGS.filter(b => b.status === 'ACTIVE').length
  const pendingBookings = DUMMY_BOOKINGS.filter(b => b.status === 'PENDING').length
  const completedBookings = DUMMY_BOOKINGS.filter(b => b.status === 'COMPLETED')
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.serviceFee, 0)
  
  return {
    totalUsers,
    totalCars,
    totalBookings,
    activeBookings,
    pendingBookings,
    totalRevenue,
    pendingVerifications: 3,
    pendingCarApprovals: 2,
    newUsersThisMonth: 12,
    newCarsThisMonth: 5,
  }
}
