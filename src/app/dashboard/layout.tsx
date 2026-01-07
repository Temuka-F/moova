'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Menu, Bell } from 'lucide-react'
import { getDashboardNavigation } from '@/types'

type UserRole = 'RENTER' | 'OWNER' | 'ADMIN'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string | null
  role: UserRole
}

// Demo user for when API is not available
const demoUser: UserData = {
  id: 'demo-user',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@moova.ge',
  avatarUrl: null,
  role: 'OWNER',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me')
        if (!response.ok) {
          // Use demo user instead of redirecting
          setUser(demoUser)
          setIsLoading(false)
          return
        }
        const data = await response.json()
        setUser(data)

        // Redirect admin to admin dashboard
        if (data.role === 'ADMIN' && window.location.pathname === '/dashboard') {
          router.push('/admin')
        }
      } catch (error) {
        // Use demo user on error
        setUser(demoUser)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        <div className="w-64 border-r bg-card p-4 hidden lg:block">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = getDashboardNavigation(user.role)

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar
            user={user}
            navigation={navigation}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <DashboardSidebar
            user={user}
            navigation={navigation}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-semibold">Dashboard</span>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
