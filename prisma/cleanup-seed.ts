import { PrismaClient } from '@prisma/client'
import { DUMMY_USERS, DUMMY_CARS } from '../src/lib/dummy-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Starting cleanup of seeded data...')

  const seededCarIds = DUMMY_CARS.map(c => c.id)
  const seededUserIds = DUMMY_USERS.map(u => u.id)

  // Delete bookings for seeded cars
  console.log('📅 Deleting bookings...')
  const deletedBookings = await prisma.booking.deleteMany({
    where: { carId: { in: seededCarIds } },
  })
  console.log(`   Deleted ${deletedBookings.count} bookings`)

  // Delete reviews for seeded cars
  console.log('⭐ Deleting reviews...')
  const deletedReviews = await prisma.review.deleteMany({
    where: { carId: { in: seededCarIds } },
  })
  console.log(`   Deleted ${deletedReviews.count} reviews`)

  // Delete favorites for seeded cars
  console.log('❤️  Deleting favorites...')
  const deletedFavorites = await prisma.favorite.deleteMany({
    where: { carId: { in: seededCarIds } },
  })
  console.log(`   Deleted ${deletedFavorites.count} favorites`)

  // Delete car images
  console.log('🖼️  Deleting car images...')
  const deletedImages = await prisma.carImage.deleteMany({
    where: { carId: { in: seededCarIds } },
  })
  console.log(`   Deleted ${deletedImages.count} car images`)

  // Delete seeded cars
  console.log('🚗 Deleting cars...')
  const deletedCars = await prisma.car.deleteMany({
    where: { id: { in: seededCarIds } },
  })
  console.log(`   Deleted ${deletedCars.count} cars`)

  // Delete messages for seeded users
  console.log('💬 Deleting messages...')
  const deletedMessages = await prisma.message.deleteMany({
    where: {
      OR: [
        { senderId: { in: seededUserIds } },
        { receiverId: { in: seededUserIds } },
      ],
    },
  })
  console.log(`   Deleted ${deletedMessages.count} messages`)

  // Delete notifications for seeded users
  console.log('🔔 Deleting notifications...')
  const deletedNotifications = await prisma.notification.deleteMany({
    where: { userId: { in: seededUserIds } },
  })
  console.log(`   Deleted ${deletedNotifications.count} notifications`)

  // Optionally delete seeded users (commented out by default)
  // Uncomment if you want to delete seed users as well
  /*
  console.log('👥 Deleting users...')
  const deletedUsers = await prisma.user.deleteMany({
    where: { id: { in: seededUserIds } },
  })
  console.log(`   Deleted ${deletedUsers.count} users`)
  */

  console.log('✅ Cleanup completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Bookings: ${deletedBookings.count}`)
  console.log(`   - Reviews: ${deletedReviews.count}`)
  console.log(`   - Favorites: ${deletedFavorites.count}`)
  console.log(`   - Car Images: ${deletedImages.count}`)
  console.log(`   - Cars: ${deletedCars.count}`)
  console.log(`   - Messages: ${deletedMessages.count}`)
  console.log(`   - Notifications: ${deletedNotifications.count}`)
}

main()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
