'use server'

import { prisma } from '@/lib/prisma'

export async function checkUserExists(email: string): Promise<boolean> {
    if (!email) return false

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(),
            },
            select: {
                id: true,
            },
        })

        return !!user
    } catch (error) {
        console.error('Error checking user existence:', error)
        // Fail safe - if DB check fails, let Supabase handle it
        return false
    }
}
