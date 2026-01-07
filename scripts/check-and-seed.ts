import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database...')
  
  // Check if cars exist
  const carCount = await prisma.car.count()
  console.log(`📊 Total cars in database: ${carCount}`)
  
  const approvedCars = await prisma.car.count({
    where: {
      status: 'APPROVED',
      isActive: true,
    },
  })
  console.log(`✅ Approved and active cars: ${approvedCars}`)
  
  // Check if seed data exists
  const seedCars = await prisma.car.count({
    where: {
      isSeedData: true,
    },
  })
  console.log(`🌱 Seed data cars: ${seedCars}`)
  
  // List a few car IDs
  const sampleCars = await prisma.car.findMany({
    take: 5,
    select: {
      id: true,
      make: true,
      model: true,
      status: true,
      isActive: true,
      isSeedData: true,
    },
  })
  
  console.log('\n📋 Sample cars:')
  sampleCars.forEach(car => {
    console.log(`  - ${car.id}: ${car.make} ${car.model} (${car.status}, active: ${car.isActive}, seed: ${car.isSeedData})`)
  })
  
  if (carCount === 0 || approvedCars === 0) {
    console.log('\n⚠️  No cars found or no approved cars. You may need to run: npx prisma db seed')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
