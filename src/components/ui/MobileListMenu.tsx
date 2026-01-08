'use client'

import { Drawer } from 'vaul'
import {
    User,
    Settings,
    HelpCircle,
    LogOut,
    Car,
    CreditCard,
    Heart,
    LayoutDashboard,
    LogIn,
    UserPlus,
    Plus,
    RefreshCw,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface MobileListMenuProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface UserProfile {
    role: 'RENTER' | 'OWNER' | 'ADMIN'
    activeProfileMode: 'RENTER' | 'OWNER'
    firstName: string
    lastName: string
    avatarUrl: string | null
    email: string
}

export function MobileListMenu({ open, onOpenChange }: MobileListMenuProps) {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(false)
    const [switching, setSwitching] = useState(false)

    // Fetch extended profile data
    useEffect(() => {
        if (!user || !open) return

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/me')
                if (res.ok) {
                    const data = await res.json()
                    setProfile(data)
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
            }
        }
        fetchProfile()
    }, [user, open])

    const handleSwitchMode = async () => {
        if (!profile || switching) return

        setSwitching(true)
        const newMode = profile.activeProfileMode === 'OWNER' ? 'RENTER' : 'OWNER'

        try {
            const res = await fetch('/api/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activeProfileMode: newMode }),
            })

            if (!res.ok) throw new Error('Failed to switch mode')

            const updated = await res.json()
            setProfile(updated)
            toast.success(`Switched to ${newMode === 'OWNER' ? 'Owner' : 'Renter'} mode`)

            // Redirect to dashboard to ensure valid page for new mode
            window.location.href = '/dashboard'

        } catch (error) {
            toast.error('Failed to switch mode')
        } finally {
            setSwitching(false)
        }
    }

    const mode = profile?.activeProfileMode || 'RENTER'
    const isOwner = profile?.role === 'OWNER' || profile?.role === 'ADMIN'

    const publicItems = [
        {
            label: 'Browse Cars',
            icon: Car,
            href: '/cars',
            showIn: ['RENTER']
        },
        {
            label: 'List Your Car',
            icon: Plus,
            href: '/list-your-car',
            showIn: ['RENTER', 'OWNER'] // Upsell for renter, utility for owner
        },
        {
            label: 'Help & Support',
            icon: HelpCircle,
            href: '/help',
            showIn: ['RENTER', 'OWNER']
        },
    ]

    const privateItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            showIn: ['OWNER']
        },
        {
            label: 'My Cars',
            icon: Car,
            href: '/dashboard/cars', // Assuming this route exists or uses filtering
            showIn: ['OWNER']
        },
        {
            label: 'Earnings',
            icon: CreditCard,
            href: '/dashboard/earnings',
            showIn: ['OWNER']
        },
        {
            label: 'My Bookings',
            icon: Car,
            href: '/dashboard/bookings',
            showIn: ['RENTER']
        },
        {
            label: 'Favorites',
            icon: Heart,
            href: '/dashboard/favorites',
            showIn: ['RENTER']
        },
        {
            label: 'Settings',
            icon: Settings,
            href: '/dashboard/settings',
            showIn: ['RENTER', 'OWNER']
        },
    ]

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[85vh] fixed bottom-0 left-0 right-0 z-[70] outline-none">
                    {/* Handle */}
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 my-4" />

                    <div className="flex-1 overflow-y-auto px-4 pb-8">
                        {/* User Header */}
                        {user ? (
                            <div className="flex items-center gap-4 mb-8 p-2">
                                <Avatar className="w-14 h-14 border-2 border-gray-100">
                                    <AvatarImage src={user.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                        {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-gray-900 truncate">
                                        {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        {profile && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                                {profile.activeProfileMode}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} asChild>
                                    <Link href="/dashboard/profile">
                                        <Settings className="w-5 h-5 text-gray-400" />
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="mb-8 text-center p-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Moova</h2>
                                <p className="text-sm text-gray-500 mb-6">Log in to manage your bookings and account</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="w-full rounded-xl" asChild onClick={() => onOpenChange(false)}>
                                        <Link href="/login">
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Log In
                                        </Link>
                                    </Button>
                                    <Button className="w-full rounded-xl" asChild onClick={() => onOpenChange(false)}>
                                        <Link href="/register">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Sign Up
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            {/* Mode Switcher for Owners */}
                            {user && isOwner && (
                                <div className="mb-6 px-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between group"
                                        onClick={handleSwitchMode}
                                        disabled={switching}
                                    >
                                        <span className="flex items-center gap-2">
                                            <RefreshCw className={cn("w-4 h-4", switching && "animate-spin")} />
                                            Switch to {mode === 'OWNER' ? 'Renter' : 'Owner'} Mode
                                        </span>
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2 px-1">
                                        Currently viewing as {mode === 'OWNER' ? 'Owner' : 'Renter'}
                                    </p>
                                </div>
                            )}

                            {/* Private Items (Only if logged in) */}
                            {user && (
                                <>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-2">
                                        {mode === 'OWNER' ? 'Owner Tools' : 'My Account'}
                                    </h3>
                                    {privateItems
                                        .filter(item => item.showIn.includes(mode))
                                        .map((item) => {
                                            const isActive = pathname === item.href
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => onOpenChange(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98]",
                                                        isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500")} />
                                                    <span className="flex-1">{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    <div className="h-px bg-gray-100 my-4 mx-4" />
                                </>
                            )}

                            {/* Public Items */}
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-2">Explore</h3>
                            {publicItems
                                .filter(item => !user || item.showIn.includes(mode))
                                .map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => onOpenChange(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98]",
                                                isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500")} />
                                            <span className="flex-1">{item.label}</span>
                                        </Link>
                                    )
                                })}

                            {/* Logout (Only if logged in) */}
                            {user && (
                                <>
                                    <div className="h-px bg-gray-100 my-4 mx-4" />
                                    <Button
                                        variant="ghost"
                                        className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 h-auto"
                                        onClick={() => {
                                            logout()
                                            onOpenChange(false)
                                        }}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Log Out</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
