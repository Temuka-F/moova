'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Calendar,
  Car,
  MessageCircle,
  Heart,
  User,
  Settings,
  Wallet,
  Star,
  Users,
  Shield,
  BarChart,
  FileText,
  LogOut,
  Plus,
  ChevronLeft,
} from 'lucide-react'
type UserRole = 'RENTER' | 'OWNER' | 'ADMIN'

interface NavItem {
  name: string
  href: string
  icon: string
  badge?: number
}

import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Calendar,
  Car,
  MessageCircle,
  Heart,
  User,
  Settings,
  Wallet,
  Star,
  Users,
  Shield,
  BarChart,
  FileText,
}

interface DashboardSidebarProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatarUrl?: string | null
    role: UserRole
    activeProfileMode?: UserRole | null
  }
  navigation: NavItem[]
  isCollapsed?: boolean
  onToggle?: () => void
}

export function DashboardSidebar({ user, navigation, isCollapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const effectiveRole = user.role === 'OWNER' && user.activeProfileMode ? user.activeProfileMode : user.role

  return (
    <div className={cn(
      'flex flex-col h-full bg-card border-r transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">moova</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onToggle}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')} />
        </Button>
      </div>

      {/* User Info */}
      <div className={cn('p-4 border-b', isCollapsed && 'flex justify-center')}>
        <div className={cn('flex items-center gap-3', isCollapsed && 'flex-col')}>
          <Link href="/dashboard/profile" className="hover:opacity-80 transition-opacity">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.firstName[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <Link href="/dashboard/profile" className="block hover:underline">
                <p className="font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </Link>
              <Badge variant="secondary" className="mt-1 text-xs">
                {user.role === 'ADMIN' ? 'Admin' : user.role === 'OWNER' ? 'Host' : 'Renter'}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.name}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge
                          variant={isActive ? 'secondary' : 'default'}
                          className="min-w-[20px] h-5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions */}
        {effectiveRole === 'OWNER' && !isCollapsed && (
          <div className="mt-6 px-3">
            <Button asChild className="w-full shadow-lg shadow-primary/20">
              <Link href="/list-your-car">
                <Plus className="w-4 h-4 mr-2" />
                List New Car
              </Link>
            </Button>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={cn('w-full justify-start text-muted-foreground', isCollapsed && 'justify-center')}
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Log out</span>}
        </Button>
      </div>
    </div>
  )
}
