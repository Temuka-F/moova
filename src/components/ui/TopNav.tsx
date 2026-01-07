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
  CalendarDays
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
                {/* City selector */}
                <button
                  onClick={() => {
                    setIsCityPickerOpen(!isCityPickerOpen)
                    setIsDatePickerOpen(false)
                  }}
                  className={`
                    flex-1 flex items-center gap-3 p-3 
                    transition-all duration-300 hover:bg-gray-50
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
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          isCityPickerOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </button>

                {/* Date selector */}
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      onClick={() => {
                        setIsDatePickerOpen(!isDatePickerOpen)
                        setIsCityPickerOpen(false)
                      }}
                      className={`
                        flex items-center gap-2 px-4 py-3
                        transition-all duration-300 hover:bg-gray-50
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
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Select dates</h3>
                      <p className="text-sm text-gray-500">When do you need the car?</p>
                    </div>
                    <div className="flex gap-4 p-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Pick-up</p>
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => onDateChange?.(date, endDate)}
                          disabled={(date) => date < new Date()}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Return</p>
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => onDateChange?.(startDate, date)}
                          disabled={(date) => date <= (startDate || new Date())}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                      <button
                        onClick={() => onDateChange?.(undefined, undefined)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear dates
                      </button>
                      <button
                        onClick={() => setIsDatePickerOpen(false)}
                        className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900"
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
                              w-full flex items-center gap-3 px-3 py-3 rounded-xl
                              transition-all duration-200
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

        {/* User Profile Button */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100/50 flex items-center justify-center hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 rounded-l-3xl">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {/* User avatar placeholder */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Guest User</p>
                    <p className="text-sm text-gray-500">Sign in to book</p>
                  </div>
                </div>

                {/* Menu items */}
                <Link 
                  href="/login"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Login / Sign Up</p>
                    <p className="text-sm text-gray-500">Access your account</p>
                  </div>
                </Link>

                <Link 
                  href="/list-your-car"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">List Your Car</p>
                    <p className="text-sm text-gray-500">Earn money sharing</p>
                  </div>
                </Link>

                <Link 
                  href="/dashboard/bookings"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Bookings</p>
                    <p className="text-sm text-gray-500">View your trips</p>
                  </div>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </div>
    </div>
  )
}
