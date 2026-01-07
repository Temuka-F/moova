import { PrismaClient } from '@prisma/client'
import { DUMMY_BOOKINGS } from '../src/lib/dummy-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking existing bookings...')
  
  const existingBookings = await prisma.booking.findMany({
    where: { isSeedData: true },
    include: {
      car: {
        select: {
          id: true,
          make: true,
          model: true,
        },
      },
      renter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  console.log(`Found ${existingBookings.length} existing seed bookings`)
  
  if (existingBookings.length > 0) {
    console.log('\n📋 Existing bookings:')
    existingBookings.forEach(b => {
      console.log(`  - ${b.id}: Car ${b.carId} (${b.car?.make || 'NOT FOUND'} ${b.car?.model || ''}), Renter ${b.renterId} (${b.renter?.firstName || 'NOT FOUND'} ${b.renter?.lastName || ''})`)
    })
  }

  console.log('\n🔄 Fixing bookings...')
  
  // Get all cars and users from database
  const allCars = await prisma.car.findMany({
    where: { isSeedData: true },
  })
  const allUsers = await prisma.user.findMany({
    where: { isSeedData: true },
  })

  let fixedCount = 0
  let createdCount = 0

  if (DUMMY_BOOKINGS && DUMMY_BOOKINGS.length > 0) {
    for (const dummyBooking of DUMMY_BOOKINGS) {
      // Fetch car from database
      const car = await prisma.car.findUnique({
        where: { id: dummyBooking.carId },
      })
      
      // Find renter
      const renter = await prisma.user.findUnique({
        where: { id: dummyBooking.renterId },
      })

      if (!car || !renter) {
        console.warn(`⚠️  Skipping booking ${dummyBooking.id}: Car ${car ? 'found' : 'NOT FOUND'}, Renter ${renter ? 'found' : 'NOT FOUND'}`)
        continue
      }

      // Check if booking exists
      const existingBooking = await prisma.booking.findUnique({
        where: { id: dummyBooking.id },
      })

      if (existingBooking) {
        // Check if it's properly linked
        if (existingBooking.carId !== car.id || existingBooking.renterId !== renter.id) {
          console.log(`🔧 Fixing booking ${dummyBooking.id}...`)
          await prisma.booking.update({
            where: { id: dummyBooking.id },
            data: {
              carId: car.id,
              renterId: renter.id,
            },
          })
          fixedCount++
        }
      } else {
        // Create new booking
        console.log(`➕ Creating booking ${dummyBooking.id}...`)
        const totalDays = dummyBooking.totalDays || Math.ceil(
          (new Date(dummyBooking.endDate).getTime() - new Date(dummyBooking.startDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        const bookingData = dummyBooking as any
        const subtotal = bookingData.subtotal || (car.pricePerDay * totalDays)
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
            paymentStatus: (bookingData.paymentStatus || 'COMPLETED') as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED',
            createdAt: new Date((dummyBooking as any).createdAt || Date.now()),
            isSeedData: true,
          },
        })
        createdCount++
      }
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} bookings`)
  console.log(`✅ Created ${createdCount} bookings`)
  console.log('\n✅ All bookings are now properly linked!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
