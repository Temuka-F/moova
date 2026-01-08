'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

interface RoleGuardProps {
    children: React.ReactNode
    allowedModes: ('RENTER' | 'OWNER' | 'ADMIN')[]
}

export function RoleGuard({ children, allowedModes }: RoleGuardProps) {
    const { user } = useAuth() // This gets simple user metadata
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        // If no user, let the auth guard (or middleware) handle it, or redirect here.
        // Usually useAuth handles redirect if configured, but here we just check role.
        if (!user) {
            // user might be null initially while loading. 
            // usage: useAuth returns loading state too.
            return
        }

        const checkRole = async () => {
            try {
                // Fetch full profile to get activeProfileMode
                const res = await fetch('/api/me')
                if (!res.ok) {
                    throw new Error('Failed to fetch profile')
                }
                const profile = await res.json()

                const effectiveMode = profile.activeProfileMode ||
                    (profile.role === 'OWNER' ? 'OWNER' : 'RENTER')

                if (allowedModes.includes(effectiveMode)) {
                    setAuthorized(true)
                } else {
                    // Not authorized for this view
                    window.location.href = '/dashboard' // Hard redirect to default dashboard
                }
            } catch (error) {
                console.error('Role check failed:', error)
                // In case of error, maybe safe to redirect to dashboard?
                router.push('/dashboard')
            } finally {
                setLoading(false)
            }
        }

        checkRole()
    }, [user, allowedModes, router])

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
            </div>
        )
    }

    if (!authorized) {
        return null // Will redirect
    }

    return <>{children}</>
}
