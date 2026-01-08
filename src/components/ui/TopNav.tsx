"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  MapPin,
  ChevronDown,
  User,
  LogIn,
  Car,
  Calendar,
  X,
  Menu,
  Mountain,
  CalendarDays,
  Settings
} from 'lucide-react'
import { CITIES, CityName } from '@/lib/map-cars'
import { format, addDays } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface TopNavProps {
  currentCity: CityName
  onCityChange: (city: CityName) => void
  carCount: number
  startDate?: Date
  endDate?: Date
  onDateChange?: (start: Date | undefined, end: Date | undefined) => void
}

export function TopNav({
  currentCity,
  onCityChange,
  carCount,
  startDate,
  endDate,
  onDateChange
}: TopNavProps) {
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, logout } = useAuth()
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

      // Redirect to dashboard to ensure valid page for new mode
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Failed to switch mode', error)
    } finally {
      setSwitching(false)
    }
  }

  const mode = profile?.activeProfileMode || 'RENTER'
  const isOwner = profile?.role === 'OWNER' || profile?.role === 'ADMIN'

  const cityInfo = CITIES[currentCity]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCityPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Group cities by type
  const cityGroups = {
    'Major Cities': ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi'] as CityName[],
    'Mountain Resorts': ['Gudauri', 'Bakuriani', 'Mestia'] as CityName[],
    'Wine & Nature': ['Telavi', 'Borjomi', 'Zugdidi'] as CityName[],
  }

  return (
    <div className="p-4 pointer-events-none safe-pt">
      <div className="flex items-center gap-3 pointer-events-auto max-w-2xl mx-auto lg:mx-0">
        {/* Main Search Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex-1"
          ref={dropdownRef}
        >
          <div className="relative">
            {/* Main button */}
            <div className="bg-white rounded-[20px] shadow-xl border border-gray-100/50 overflow-hidden transition-all duration-300">
              <div className="flex items-stretch">
                {/* City selector - minimum 44px touch target */}
                <button
                  onClick={() => {
                    setIsCityPickerOpen(!isCityPickerOpen)
                    setIsDatePickerOpen(false)
                  }}
                  className={`
                    flex-1 flex items-center gap-3 p-3 min-h-[56px]
                    transition-all duration-300 hover:bg-gray-50 active:bg-gray-100
                    border-r border-gray-100
                    ${isCityPickerOpen ? 'bg-gray-50' : ''}
                  `}
                >
                  {/* Location icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>

                  {/* Location text */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs text-gray-500 mb-0.5">Location</p>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900 truncate">
                        {currentCity}
                      </p>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isCityPickerOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Date selector - minimum 44px touch target */}
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      onClick={() => {
                        setIsDatePickerOpen(!isDatePickerOpen)
                        setIsCityPickerOpen(false)
                      }}
                      className={`
                        flex items-center gap-2 px-4 py-3 min-h-[56px] min-w-[44px]
                        transition-all duration-300 hover:bg-gray-50 active:bg-gray-100
                        ${isDatePickerOpen ? 'bg-gray-50' : ''}
                      `}
                    >
                      <CalendarDays className="w-5 h-5 text-gray-400" />
                      <div className="text-left hidden sm:block">
                        <p className="text-xs text-gray-500 mb-0.5">Dates</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {startDate && endDate
                            ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
                            : 'Add dates'
                          }
                        </p>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl" align="end">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900">Select dates</h3>
                      <p className="text-sm text-gray-500">When do you need the car?</p>
                    </div>
                    <div className="p-4 flex justify-center">
                      <CalendarComponent
                        mode="range"
                        selected={{ from: startDate, to: endDate }}
                        onSelect={(range) => onDateChange?.(range?.from, range?.to)}
                        disabled={(date) => date < new Date()}
                        numberOfMonths={2}
                        className="rounded-xl border border-gray-100 bg-white"
                      />
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <button
                        onClick={() => onDateChange?.(undefined, undefined)}
                        className="text-sm text-gray-500 hover:text-gray-900 font-medium px-2"
                      >
                        Clear dates
                      </button>
                      <button
                        onClick={() => setIsDatePickerOpen(false)}
                        className="px-6 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 active:scale-95 transition-transform"
                      >
                        Apply
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Car count bar */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{carCount}</span> cars available
                  </p>
                  {currentCity === 'Gudauri' || currentCity === 'Bakuriani' || currentCity === 'Mestia' ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <Mountain className="w-3 h-3" />
                      <span>Winter Ready</span>
                    </div>
                  ) : currentCity === 'Telavi' ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      <span>🍇</span>
                      <span>Wine Region</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* City Picker Dropdown */}
            <AnimatePresence>
              {isCityPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-2xl border border-gray-100 overflow-hidden max-h-[70vh] overflow-y-auto"
                >
                  {Object.entries(cityGroups).map(([groupName, cities]) => (
                    <div key={groupName}>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {groupName}
                        </p>
                      </div>
                      <div className="p-2">
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              onCityChange(city)
                              setIsCityPickerOpen(false)
                            }}
                            className={`
                              w-full flex items-center gap-3 px-3 py-3 min-h-[52px] rounded-xl
                              transition-all duration-200 active:scale-[0.98]
                              ${currentCity === city
                                ? 'bg-black text-white'
                                : 'hover:bg-gray-50 text-gray-700'
                              }
                            `}
                          >
                            <span className="text-xl w-8 text-center">{CITIES[city].label.split(' ')[0]}</span>
                            <div className="flex-1 text-left">
                              <p className="font-medium">{city}</p>
                              <p className={`text-xs ${currentCity === city ? 'text-gray-300' : 'text-gray-500'}`}>
                                {CITIES[city].description}
                              </p>
                            </div>
                            {currentCity === city && (
                              <motion.div
                                layoutId="cityIndicator"
                                className="w-2 h-2 rounded-full bg-emerald-400"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* User Profile Button - 44px minimum touch target */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-white shadow-xl border border-gray-100/50 flex items-center justify-center hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 rounded-l-3xl">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {/* User Info */}
                {user ? (
                  <Link href="/dashboard/profile" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6 hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-xl">
                      {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.user_metadata?.first_name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        {profile && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium uppercase tracking-wider">
                            {mode}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Guest User</p>
                      <p className="text-sm text-gray-500">Sign in to book</p>
                    </div>
                  </div>
                )}

                {/* Switcher */}
                {user && isOwner && (
                  <button
                    onClick={handleSwitchMode}
                    disabled={switching}
                    className="w-full flex items-center gap-4 p-4 min-h-[56px] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors border-2 border-dashed border-gray-200 mb-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Switch to {mode === 'OWNER' ? 'Renter' : 'Owner'}</p>
                    </div>
                  </button>
                )}

                {/* Items */}
                {!user && (
                  <Link
                    href="/login"
                    className="flex items-center gap-4 p-4 min-h-[64px] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                      <LogIn className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Login / Sign Up</p>
                      <p className="text-sm text-gray-500">Access your account</p>
                    </div>
                  </Link>
                )}

                {/* Owner Items */}
                {user && mode === 'OWNER' && (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 p-4 min-h-[64px] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                        <ChevronDown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dashboard</p>
                        <p className="text-sm text-gray-500">Manage your business</p>
                      </div>
                    </Link>
                    <Link
                      href="/list-your-car"
                      className="flex items-center gap-4 p-4 min-h-[64px] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">List Your Car</p>
                        <p className="text-sm text-gray-500">Earn money sharing</p>
                      </div>
                    </Link>
                  </>
                )}

                {/* Renter Items */}
                {user && mode === 'RENTER' && (
                  <Link
                    href="/dashboard/bookings"
                    className="flex items-center gap-4 p-4 min-h-[64px] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">My Bookings</p>
                      <p className="text-sm text-gray-500">View your trips</p>
                    </div>
                  </Link>
                )}

                {user && (
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-4 p-4 min-h-[64px] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Settings</p>
                      <p className="text-sm text-gray-500">Account preferences</p>
                    </div>
                  </Link>
                )}

                {user && (
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-4 p-4 min-h-[64px] rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-600">Log Out</p>
                    </div>
                  </button>
                )}

              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </div>
    </div>
  )
}
