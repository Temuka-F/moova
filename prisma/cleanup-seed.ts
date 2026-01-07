/**
 * Cleanup Script for Seed/Dummy Data
 * 
 * Run this script before going live to remove all seed data from the database.
 * This will delete all users, cars, and bookings that were marked as seed data.
 * 
 * Usage: npx tsx prisma/cleanup-seed.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupSeedData() {
  console.log('🧹 Starting seed data cleanup...\n')
  
  // Count seed data before deletion
  const seedBookingsCount = await prisma.booking.count({ where: { isSeedData: true } })
  const seedCarsCount = await prisma.car.count({ where: { isSeedData: true } })
  const seedUsersCount = await prisma.user.count({ where: { isSeedData: true } })
  
  console.log('📊 Seed data found:')
  console.log(`   - Bookings: ${seedBookingsCount}`)
  console.log(`   - Cars: ${seedCarsCount}`)
  console.log(`   - Users: ${seedUsersCount}`)
  console.log('')
  
  if (seedBookingsCount === 0 && seedCarsCount === 0 && seedUsersCount === 0) {
    console.log('✅ No seed data found. Database is clean!')
    return
  }
  
  // Delete in order to respect foreign key constraints
  console.log('🗑️  Deleting seed data...')
  
  // 1. Delete reviews for seed bookings
  const deletedReviews = await prisma.review.deleteMany({
    where: {
      booking: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedReviews.count} reviews`)
  
  // 2. Delete messages for seed bookings
  const deletedMessages = await prisma.message.deleteMany({
    where: {
      booking: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedMessages.count} messages`)
  
  // 3. Delete payments for seed bookings
  const deletedPayments = await prisma.payment.deleteMany({
    where: {
      booking: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedPayments.count} payments`)
  
  // 4. Delete seed bookings
  const deletedBookings = await prisma.booking.deleteMany({
    where: { isSeedData: true }
  })
  console.log(`   - Deleted ${deletedBookings.count} bookings`)
  
  // 5. Delete favorites for seed cars
  const deletedFavorites = await prisma.favorite.deleteMany({
    where: {
      car: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedFavorites.count} favorites`)
  
  // 6. Delete car images for seed cars
  const deletedCarImages = await prisma.carImage.deleteMany({
    where: {
      car: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedCarImages.count} car images`)
  
  // 7. Delete availabilities for seed cars
  const deletedAvailabilities = await prisma.availability.deleteMany({
    where: {
      car: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedAvailabilities.count} availabilities`)
  
  // 8. Delete seed cars
  const deletedCars = await prisma.car.deleteMany({
    where: { isSeedData: true }
  })
  console.log(`   - Deleted ${deletedCars.count} cars`)
  
  // 9. Delete notifications for seed users
  const deletedNotifications = await prisma.notification.deleteMany({
    where: {
      user: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedNotifications.count} notifications`)
  
  // 10. Delete payment methods for seed users
  const deletedPaymentMethods = await prisma.paymentMethod.deleteMany({
    where: {
      user: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedPaymentMethods.count} payment methods`)
  
  // 11. Delete payouts for seed users
  const deletedPayouts = await prisma.payout.deleteMany({
    where: {
      user: { isSeedData: true }
    }
  })
  console.log(`   - Deleted ${deletedPayouts.count} payouts`)
  
  // 12. Delete seed users
  const deletedUsers = await prisma.user.deleteMany({
    where: { isSeedData: true }
  })
  console.log(`   - Deleted ${deletedUsers.count} users`)
  
  console.log('')
  console.log('✅ Seed data cleanup completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`   - Total bookings deleted: ${deletedBookings.count}`)
  console.log(`   - Total cars deleted: ${deletedCars.count}`)
  console.log(`   - Total users deleted: ${deletedUsers.count}`)
}

// Add a safety check
async function main() {
  console.log('⚠️  WARNING: This will permanently delete all seed data!')
  console.log('   Make sure you have a backup before proceeding.\n')
  
  // Check if running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('🛡️  Running in PRODUCTION mode.')
    console.log('   Please confirm by setting CONFIRM_CLEANUP=true\n')
    
    if (process.env.CONFIRM_CLEANUP !== 'true') {
      console.log('❌ Cleanup aborted. Set CONFIRM_CLEANUP=true to proceed.')
      process.exit(1)
    }
  }
  
  await cleanupSeedData()
}

main()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
