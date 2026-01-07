/**
 * Production Database Seeding Script
 * 
 * This script seeds the production database with dummy data.
 * Make sure you have the production DATABASE_URL and DIRECT_URL set in your environment.
 * 
 * Usage:
 * 1. Set production env vars: npx vercel env pull .env.production
 * 2. Copy DATABASE_URL and DIRECT_URL to .env.local
 * 3. Run: npx tsx scripts/seed-production.ts
 */

import { PrismaClient } from '@prisma/client'
import { DUMMY_USERS, DUMMY_CARS, DUMMY_BOOKINGS } from '../src/lib/dummy-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting PRODUCTION database seed...')
  console.log('⚠️  WARNING: This will seed the PRODUCTION database!')
  console.log('')

  // Check if we're using production database
  const dbUrl = process.env.DATABASE_URL || ''
  if (!dbUrl.includes('supabase') && !dbUrl.includes('production')) {
    console.error('❌ ERROR: DATABASE_URL does not appear to be a production database!')
    console.error('   Please verify your environment variables.')
    process.exit(1)
  }

  console.log('📊 Checking existing data...')
  const existingCars = await prisma.car.count({ where: { isSeedData: true } })
  const existingUsers = await prisma.user.count({ where: { isSeedData: true } })
  
  if (existingCars > 0 || existingUsers > 0) {
    console.log(`⚠️  Found existing seed data: ${existingCars} cars, ${existingUsers} users`)
    console.log('   The seed script will skip existing records.')
  }

  // Create seed users
  console.log('👥 Creating seed users...')
  const seedUsers: any[] = []
  
  for (const dummyUser of DUMMY_USERS) {
    // Check if user already exists by ID first (for seeded users)
    let user = await prisma.user.findUnique({
      where: { id: dummyUser.id },
    })

    // If not found by ID, check by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: dummyUser.email },
      })
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: dummyUser.id,
          email: dummyUser.email,
          firstName: dummyUser.firstName,
          lastName: dummyUser.lastName,
          phone: dummyUser.phone,
          avatarUrl: dummyUser.avatarUrl,
          role: dummyUser.role as 'RENTER' | 'OWNER' | 'ADMIN',
          isEmailVerified: dummyUser.verificationStatus === 'VERIFIED',
          isPhoneVerified: dummyUser.verificationStatus === 'VERIFIED',
          isIdVerified: dummyUser.verificationStatus === 'VERIFIED',
          isLicenseVerified: dummyUser.verificationStatus === 'VERIFIED',
          verificationStatus: dummyUser.verificationStatus as 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED',
          responseTime: dummyUser.responseTime || null,
          responseRate: dummyUser.responseRate || null,
          bio: `Hi! I'm ${dummyUser.firstName}, ${dummyUser.role === 'OWNER' ? 'a car owner' : 'a renter'} on Moova.`,
          createdAt: new Date(dummyUser.createdAt),
          isSeedData: true,
        },
      })
    }
    
    seedUsers.push(user)
  }

  console.log(`✅ Created/Found ${seedUsers.length} users`)

  // Create seed cars
  console.log('🚗 Creating seed cars...')
  const seedCars = []
  
  for (const dummyCar of DUMMY_CARS) {
    const owner = seedUsers.find(u => u.id === dummyCar.ownerId)
    if (!owner) {
      console.warn(`⚠️  Owner ${dummyCar.ownerId} not found for car ${dummyCar.id}`)
      continue
    }

    let car = await prisma.car.findUnique({
      where: { id: dummyCar.id },
    })

    if (!car) {
      const licensePlate = `GE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(Math.random() * 1000)}`
      
      car = await prisma.car.create({
        data: {
          id: dummyCar.id,
          ownerId: owner.id,
          make: dummyCar.make,
          model: dummyCar.model,
          year: dummyCar.year,
          licensePlate: licensePlate,
          color: dummyCar.color,
          transmission: dummyCar.transmission as 'AUTOMATIC' | 'MANUAL',
          fuelType: dummyCar.fuelType as 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC' | 'LPG',
          seats: dummyCar.seats,
          doors: dummyCar.doors,
          category: dummyCar.category as any,
          features: dummyCar.features || [],
          city: dummyCar.city,
          address: dummyCar.address,
          latitude: dummyCar.latitude,
          longitude: dummyCar.longitude,
          pricePerDay: dummyCar.pricePerDay,
          pricePerHour: dummyCar.pricePerHour || null,
          securityDeposit: dummyCar.securityDeposit,
          mileageLimit: dummyCar.mileageLimit || null,
          currentMileage: dummyCar.currentMileage || 0,
          status: dummyCar.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED',
          isActive: dummyCar.isActive,
          isInstantBook: dummyCar.isInstantBook,
          isSeedData: true,
        },
      })

      // Create car images
      if (dummyCar.images && dummyCar.images.length > 0) {
        await prisma.carImage.createMany({
          data: dummyCar.images.map((img, index) => ({
            carId: car!.id,
            url: img.url,
            isPrimary: img.isPrimary || index === 0,
            order: index,
          })),
        })
      }
    }
    
    seedCars.push(car)
  }

  console.log(`✅ Created/Found ${seedCars.length} cars`)

  // Create sample bookings
  console.log('📅 Creating sample bookings...')
  let bookingCount = 0

  if (DUMMY_BOOKINGS && DUMMY_BOOKINGS.length > 0) {
    for (const dummyBooking of DUMMY_BOOKINGS) {
      // Fetch car from database instead of relying on seedCars array
      // This ensures we get cars that already exist in the database
      const car = await prisma.car.findUnique({
        where: { id: dummyBooking.carId },
      })
      
      // Also check seedCars as fallback (for newly created cars)
      const carFromSeed = car || seedCars.find(c => c.id === dummyBooking.carId)
      
      // Find renter - check database first, then seedUsers array
      let renter = seedUsers.find(u => u.id === dummyBooking.renterId)
      if (!renter) {
        renter = await prisma.user.findUnique({
          where: { id: dummyBooking.renterId },
        })
      }

      if (!carFromSeed || !renter) {
        console.warn(`⚠️  Car or renter not found for booking ${dummyBooking.id}. Car: ${carFromSeed ? 'found' : 'not found'}, Renter: ${renter ? 'found' : 'not found'}`)
        continue
      }

      // Check if booking already exists
      const existingBooking = await prisma.booking.findUnique({
        where: { id: dummyBooking.id },
      })

      if (!existingBooking) {
        const totalDays = dummyBooking.totalDays || Math.ceil(
          (new Date(dummyBooking.endDate).getTime() - new Date(dummyBooking.startDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        const bookingData = dummyBooking as any
        const subtotal = bookingData.subtotal || (carFromSeed.pricePerDay * totalDays)
        const serviceFee = dummyBooking.serviceFee || Math.round(subtotal * 0.15)
        const totalAmount = dummyBooking.totalAmount || (subtotal + serviceFee)

        await prisma.booking.create({
          data: {
            id: dummyBooking.id,
            carId: carFromSeed.id,
            renterId: renter.id,
            startDate: new Date(dummyBooking.startDate),
            endDate: new Date(dummyBooking.endDate),
            pickupLocation: dummyBooking.pickupLocation,
            dailyRate: dummyBooking.dailyRate || carFromSeed.pricePerDay,
            totalDays,
            subtotal,
            serviceFee,
            totalAmount,
            securityDeposit: carFromSeed.securityDeposit,
            status: dummyBooking.status as 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED',
            paymentStatus: (bookingData.paymentStatus || 'COMPLETED') as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED',
            createdAt: new Date((dummyBooking as any).createdAt || Date.now()),
            isSeedData: true, // Mark as seed data for easy cleanup
          },
        })
        bookingCount++
      }
    }
  }

  console.log(`✅ Created ${bookingCount} bookings`)
  console.log('')
  console.log('✅ Production seed completed successfully!')
  console.log(`📊 Summary: ${seedUsers.length} users, ${seedCars.length} cars, ${bookingCount} bookings`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
