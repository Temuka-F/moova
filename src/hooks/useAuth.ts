'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UseAuthOptions {
  redirectTo?: string
  required?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo = '/login', required = false } = options
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let supabase
    try {
      supabase = createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setLoading(false)
      setIsAuthenticated(false)
      return
    }
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setIsAuthenticated(!!user)
        
        if (required && !user) {
          toast.error('Please log in to continue')
          router.push(redirectTo)
        }
      } catch (error) {
        console.error('Error getting user:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setIsAuthenticated(!!currentUser)
      })

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    } catch (error) {
      console.error('Error setting up auth state listener:', error)
      return () => {}
    }
  }, [required, redirectTo, router])

  const requireAuth = useCallback((action: string = 'continue') => {
    if (!isAuthenticated) {
      toast.error(`Please log in to ${action}`, {
        action: {
          label: 'Log in',
          onClick: () => router.push('/login')
        }
      })
      return false
    }
    return true
  }, [isAuthenticated, router])

  const logout = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
      // Still clear local state even if logout fails
      setUser(null)
      setIsAuthenticated(false)
      router.push('/')
    }
  }, [router])

  return {
    user,
    loading,
    isAuthenticated,
    requireAuth,
    logout
  }
}
