import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { User, UserRole } from '@/types'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) return null

  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
  })

  return user
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!user.isActive || user.isBanned) {
    throw new Error('Account suspended')
  }

  return user
}

export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth()
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }

  return user
}

export async function requireAdmin(): Promise<User> {
  return requireRole(['ADMIN'])
}

export async function requireOwner(): Promise<User> {
  return requireRole(['OWNER', 'ADMIN'])
}

// Sync Supabase user with our database
export async function syncUser(authUser: { 
  id: string
  email: string
  user_metadata: { 
    first_name?: string
    last_name?: string
    avatar_url?: string
    phone?: string
  }
}): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { email: authUser.email },
  })

  if (existingUser) {
    return existingUser
  }

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      id: authUser.id,
      email: authUser.email!,
      firstName: authUser.user_metadata?.first_name || 'User',
      lastName: authUser.user_metadata?.last_name || '',
      avatarUrl: authUser.user_metadata?.avatar_url,
      phone: authUser.user_metadata?.phone,
      role: 'RENTER', // Default role
    },
  })

  return newUser
}
