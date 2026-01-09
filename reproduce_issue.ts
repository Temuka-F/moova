
import { prisma } from './src/lib/prisma';

async function main() {
    try {
        console.log('Fetching cars...');
        const result = await prisma.car.findMany({
            where: {
                status: 'APPROVED',
                isActive: true,
            },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        verificationStatus: true,
                    },
                },
                _count: {
                    select: {
                        bookings: true,
                        reviews: true,
                    },
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
            skip: 0
        });
        console.log('Success!', result);
    } catch (e) {
        console.error('Error fetching cars:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
