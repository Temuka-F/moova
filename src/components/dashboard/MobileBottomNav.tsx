'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, MessageCircle, Car, User, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface MobileBottomNavProps {
    onMenuClick: () => void
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
    const pathname = usePathname()

    const items = [
        {
            label: 'Home',
            href: '/',
            icon: Home,
            isActive: (path: string) => path === '/',
        },
        {
            label: 'Trips',
            href: '/dashboard/bookings',
            icon: Car,
            isActive: (path: string) => path.startsWith('/dashboard/bookings'),
        },
        {
            label: 'Inbox',
            href: '/dashboard/messages',
            icon: MessageCircle,
            isActive: (path: string) => path.startsWith('/dashboard/messages'),
        },
        {
            label: 'Profile',
            href: '/dashboard/profile',
            icon: User,
            isActive: (path: string) => path.startsWith('/dashboard/profile'),
        },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200 pb-safe lg:bottom-8 lg:top-auto lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:w-auto lg:rounded-full lg:border lg:shadow-2xl lg:pb-0 lg:bg-white/90">
            <div className="grid grid-cols-5 h-16 w-full lg:flex lg:items-center lg:justify-center lg:w-auto lg:px-6 lg:gap-2">
                {items.map((item) => {
                    const Icon = item.icon
                    const active = item.isActive(pathname)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform lg:w-16 lg:hover:scale-110',
                                active ? 'text-primary' : 'text-muted-foreground hover:text-gray-900'
                            )}
                        >
                            <Icon className={cn('w-6 h-6', active && 'fill-current')} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}

                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-gray-900 active:scale-95 transition-transform lg:w-16 lg:hover:scale-110"
                >
                    <Menu className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>
        </div>
    )
}
