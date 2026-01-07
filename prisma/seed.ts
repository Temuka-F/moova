import { PrismaClient } from '@prisma/client'
import { DUMMY_USERS, DUMMY_CARS, DUMMY_BOOKINGS } from '../src/lib/dummy-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing seeded data (optional - comment out if you want to keep existing data)
  // await cleanupSeededData()

  // Create seed users
  console.log('👥 Creating seed users...')
  const seedUsers: any[] = []
  
  for (const dummyUser of DUMMY_USERS) {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: dummyUser.email },
    })

    if (!user) {
      // Create user with a deterministic UUID based on email for consistency
      // In production, these would have real Supabase auth IDs
      user = await prisma.user.create({
        data: {
          id: dummyUser.id, // Use the dummy ID for seeded users
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
        },
      })
    }
    
    seedUsers.push(user)
  }

  console.log(`✅ Created ${seedUsers.length} users`)

  // Create seed cars
  console.log('🚗 Creating seed cars...')
  const seedCars = []
  
  for (const dummyCar of DUMMY_CARS) {
    // Find the owner
    const owner = seedUsers.find(u => u.id === dummyCar.ownerId)
    if (!owner) {
      console.warn(`⚠️  Owner ${dummyCar.ownerId} not found for car ${dummyCar.id}`)
      continue
    }

    // Check if car already exists
    let car = await prisma.car.findUnique({
      where: { id: dummyCar.id },
    })

    if (!car) {
      // Generate a unique license plate if not provided
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
          category: dummyCar.category as 'ECONOMY' | 'COMPACT' | 'SEDAN' | 'SUV' | 'LUXURY' | 'SPORTS' | 'VAN' | 'MINIVAN' | 'PICKUP' | 'CONVERTIBLE',
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

  console.log(`✅ Created ${seedCars.length} cars`)

  // Create sample bookings
  console.log('📅 Creating sample bookings...')
  let bookingCount = 0

  if (DUMMY_BOOKINGS && DUMMY_BOOKINGS.length > 0) {
    for (const dummyBooking of DUMMY_BOOKINGS) {
      const car = seedCars.find(c => c.id === dummyBooking.carId)
      const renter = seedUsers.find(u => u.id === dummyBooking.renterId)

      if (!car || !renter) {
        console.warn(`⚠️  Car or renter not found for booking ${dummyBooking.id}`)
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
      const subtotal = dummyBooking.subtotal || (car.pricePerDay * totalDays)
      const serviceFee = dummyBooking.serviceFee || Math.round(subtotal * 0.15)
      const totalAmount = dummyBooking.totalAmount || (subtotal + serviceFee)

      await prisma.booking.create({
        data: {
          id: dummyBooking.id,
          carId: car.id,
          renterId: renter.id,
          startDate: new Date(dummyBooking.startDate),
          endDate: new Date(dummyBooking.endDate),
          pickupLocation: dummyBooking.pickupLocation,
          dailyRate: dummyBooking.dailyRate || car.pricePerDay,
          totalDays,
          subtotal,
          serviceFee,
          totalAmount,
          securityDeposit: car.securityDeposit,
          status: dummyBooking.status as 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED',
          paymentStatus: (dummyBooking.paymentStatus || 'COMPLETED') as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED',
          createdAt: new Date((dummyBooking as any).createdAt || Date.now()),
        },
      })
        bookingCount++
      }
    }
  } else {
    // Create some sample bookings if DUMMY_BOOKINGS doesn't exist
    const sampleBookings = [
      {
        car: seedCars[0],
        renter: seedUsers.find(u => u.role === 'RENTER') || seedUsers[3],
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: 'CONFIRMED' as const,
      },
      {
        car: seedCars[1],
        renter: seedUsers.find(u => u.role === 'RENTER' && u.id !== seedUsers[3]?.id) || seedUsers[4],
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
        status: 'PENDING' as const,
      },
    ]

    for (const booking of sampleBookings) {
      if (!booking.car || !booking.renter) continue

      const totalDays = Math.ceil(
        (booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      const subtotal = booking.car.pricePerDay * totalDays
      const serviceFee = Math.round(subtotal * 0.15)

      await prisma.booking.create({
        data: {
          carId: booking.car.id,
          renterId: booking.renter.id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          pickupLocation: booking.car.address,
          dailyRate: booking.car.pricePerDay,
          totalDays,
          subtotal,
          serviceFee,
          totalAmount: subtotal + serviceFee,
          securityDeposit: booking.car.securityDeposit,
          status: booking.status,
          paymentStatus: booking.status === 'CONFIRMED' ? 'COMPLETED' : 'PENDING',
        },
      })
      bookingCount++
    }
  }

  console.log(`✅ Created ${bookingCount} bookings`)

  // Create some sample reviews
  console.log('⭐ Creating sample reviews...')
  const completedBookings = await prisma.booking.findMany({
    where: { status: 'COMPLETED' },
    take: 5,
  })

  for (const booking of completedBookings) {
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: booking.id },
    })

    if (!existingReview) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          carId: booking.carId,
          reviewerId: booking.renterId,
          revieweeId: booking.car.ownerId,
          type: 'CAR_REVIEW',
          rating: 4 + Math.floor(Math.random() * 2), // 4 or 5
          cleanliness: 4 + Math.floor(Math.random() * 2),
          communication: 4 + Math.floor(Math.random() * 2),
          accuracy: 4 + Math.floor(Math.random() * 2),
          value: 4 + Math.floor(Math.random() * 2),
          comment: 'Great car, very clean and well maintained. Owner was responsive and helpful!',
        },
      })
    }
  }

  console.log('✅ Seed completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Users: ${seedUsers.length}`)
  console.log(`   - Cars: ${seedCars.length}`)
  console.log(`   - Bookings: ${bookingCount}`)
}

async function cleanupSeededData() {
  console.log('🧹 Cleaning up existing seeded data...')
  
  // Delete bookings for seeded cars
  const seededCarIds = DUMMY_CARS.map(c => c.id)
  await prisma.booking.deleteMany({
    where: { carId: { in: seededCarIds } },
  })

  // Delete reviews for seeded cars
  await prisma.review.deleteMany({
    where: { carId: { in: seededCarIds } },
  })

  // Delete car images
  await prisma.carImage.deleteMany({
    where: { carId: { in: seededCarIds } },
  })

  // Delete seeded cars
  await prisma.car.deleteMany({
    where: { id: { in: seededCarIds } },
  })

  // Optionally delete seeded users (commented out to preserve user data)
  // const seededUserIds = DUMMY_USERS.map(u => u.id)
  // await prisma.user.deleteMany({
  //   where: { id: { in: seededUserIds } },
  // })

  console.log('✅ Cleanup completed')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
