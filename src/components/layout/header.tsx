'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Menu,
  LogOut,
  Settings,
  LayoutDashboard,
  Plus,
  ChevronDown,
  Car,
  Heart,
  MessageCircle,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Use centralized auth hook
  const { user, loading, logout } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [switching, setSwitching] = useState(false)

  // Fetch extended profile data
  useEffect(() => {
    if (!user) return
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
  }, [user])

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
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Failed to switch mode', error)
    } finally {
      setSwitching(false)
    }
  }

  const mode = profile?.activeProfileMode || 'RENTER'
  const isOwner = profile?.role === 'OWNER' || profile?.role === 'ADMIN'

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = pathname === '/'
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <header
      className={`${isScrolled || isDashboard || true ? 'relative' : 'fixed'} top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isDashboard || true // Always opaque for now to ensure visibility on MapHomePage
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm'
        : 'bg-transparent py-5'
        }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-bold tracking-tight transition-colors ${isDashboard || isScrolled || true ? 'text-primary' : 'text-white'
            }`}
        >
          moova
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {!isDashboard && (
            <>
              <Link
                href="/?view=list#cars-section"
                className={`text-sm font-medium transition-colors hover:opacity-80 ${isScrolled || true ? 'text-foreground' : 'text-white'
                  }`}
              >
                Browse Cars
              </Link>
              <Link
                href="/list-your-car"
                className={`text-sm font-medium transition-colors hover:opacity-80 ${isScrolled || true ? 'text-foreground' : 'text-white'
                  }`}
              >
                List Your Car
              </Link>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-10 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-1">
              <Link href="/dashboard/profile">
                <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity cursor-pointer">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 rounded-full px-2 ${isDashboard || isScrolled || true ? '' : 'text-white hover:bg-white/10'
                      }`}
                  >
                    <span className="hidden lg:inline font-medium">
                      {user.user_metadata?.first_name || 'Account'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-3 py-3 border-b">
                    <p className="font-semibold">
                      {user.user_metadata?.first_name || 'User'} {user.user_metadata?.last_name || ''}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate max-w-[140px]">
                        {user.email}
                      </p>
                      {profile && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium border uppercase tracking-wider">
                          {profile.activeProfileMode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mode Switcher */}
                  {isOwner && (
                    <>
                      <DropdownMenuItem
                        onClick={handleSwitchMode}
                        disabled={switching}
                        className="cursor-pointer font-medium text-primary bg-primary/5 focus:bg-primary/10 focus:text-primary"
                      >
                        <div className="flex items-center w-full">
                          <LayoutDashboard className="mr-3 h-4 w-4" />
                          Switch to {mode === 'OWNER' ? 'Renter' : 'Owner'}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* Owner Items */}
                  {mode === 'OWNER' && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard">
                          <LayoutDashboard className="mr-3 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/cars">
                          <Car className="mr-3 h-4 w-4" />
                          My Cars
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/earnings">
                          <div className="mr-3 h-4 w-4 flex items-center justify-center font-bold text-xs">$</div>
                          Earnings
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Renter Items */}
                  {mode === 'RENTER' && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/bookings">
                          <Car className="mr-3 h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/favorites">
                          <Heart className="mr-3 h-4 w-4" />
                          Saved Cars
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/messages">
                      <MessageCircle className="mr-3 h-4 w-4" />
                      Messages
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Shared Items */}
                  {mode === 'OWNER' && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/list-your-car">
                        <Plus className="mr-3 h-4 w-4" />
                        List Your Car
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/help">
                      <HelpCircle className="mr-3 h-4 w-4" />
                      Help
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className={`rounded-full ${isDashboard || isScrolled || true ? '' : 'text-white hover:bg-white/10'
                  }`}
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={isDashboard || isScrolled || !isHomePage ? '' : 'text-white hover:bg-white/10'}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <Link href="/" className="text-2xl font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>
                  moova
                </Link>
              </div>

              <div className="flex-1 p-6">
                <div className="space-y-1">
                  <Link
                    href="/?view=list#cars-section"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors hover:bg-muted"
                  >
                    <Car className="w-5 h-5" />
                    Browse Cars
                  </Link>
                  <Link
                    href="/list-your-car"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors hover:bg-muted"
                  >
                    <Plus className="w-5 h-5" />
                    List Your Car
                  </Link>
                  {user && (
                    <>
                      <div className="h-px bg-border my-4" />
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors hover:bg-muted"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-muted text-muted-foreground"
                      >
                        <Car className="w-5 h-5" />
                        My Bookings
                      </Link>
                      <Link
                        href="/dashboard/messages"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-muted text-muted-foreground"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Messages
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:bg-muted text-muted-foreground"
                      >
                        <Settings className="w-5 h-5" />
                        Settings
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 border-t">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="destructive" className="w-full rounded-xl" onClick={() => logout()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="rounded-xl" asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button className="rounded-xl" asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header >
  )
}
