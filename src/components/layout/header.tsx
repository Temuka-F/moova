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
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navigation = [
  { name: 'Browse Cars', href: '/cars' },
  { name: 'List Your Car', href: '/list-your-car' },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isHomePage = pathname === '/'
  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  // Don't show header on auth pages
  if (isAuthPage) return null

  // Different header for dashboard
  const headerBg = isDashboard 
    ? 'bg-white border-b shadow-sm' 
    : isScrolled || !isHomePage
      ? 'bg-white/95 backdrop-blur-xl border-b border-border shadow-sm'
      : 'bg-transparent'

  const textColor = isDashboard || isScrolled || !isHomePage 
    ? 'text-foreground' 
    : 'text-white'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`text-2xl font-bold tracking-tight transition-colors ${
              isDashboard || isScrolled || !isHomePage ? 'text-primary' : 'text-white'
            }`}>
              moova
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : isDashboard || isScrolled || !isHomePage
                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-10 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center gap-2 rounded-full pl-2 pr-3 ${
                      isDashboard || isScrolled || !isHomePage ? '' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
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
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-3 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/bookings">
                      <Car className="mr-3 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/messages">
                      <MessageCircle className="mr-3 h-4 w-4" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/favorites">
                      <Heart className="mr-3 h-4 w-4" />
                      Saved Cars
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/list-your-car">
                      <Plus className="mr-3 h-4 w-4" />
                      List Your Car
                    </Link>
                  </DropdownMenuItem>
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className={`rounded-full ${
                    isDashboard || isScrolled || !isHomePage ? '' : 'text-white hover:bg-white/10'
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
                      href="/cars"
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
                      <Button variant="destructive" className="w-full rounded-xl" onClick={handleLogout}>
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
        </div>
      </nav>
    </header>
  )
}
