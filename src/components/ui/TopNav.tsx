"use client"

import { useState } from 'react'
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
  Mountain
} from 'lucide-react'
import { CITIES, CityName } from '@/lib/map-cars'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface TopNavProps {
  currentCity: CityName
  onCityChange: (city: CityName) => void
  carCount: number
}

export function TopNav({ currentCity, onCityChange, carCount }: TopNavProps) {
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false)

  const cityInfo = CITIES[currentCity]

  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none safe-pt">
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Search Pill / City Selector */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex-1"
        >
          <div className="relative">
            <button
              onClick={() => setIsCityPickerOpen(!isCityPickerOpen)}
              className={`
                w-full flex items-center gap-3 p-3 
                bg-white rounded-2xl shadow-xl border border-gray-100/50
                transition-all duration-300 ease-out
                ${isCityPickerOpen ? 'shadow-2xl ring-2 ring-black/5' : ''}
              `}
            >
              {/* Search icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>

              {/* Location text */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="font-semibold text-gray-900 truncate">
                    {currentCity}
                  </p>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      isCityPickerOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {carCount} cars available
                </p>
              </div>

              {/* Winter indicator for Gudauri */}
              {currentCity === 'Gudauri' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <Mountain className="w-3 h-3" />
                  <span>Ski</span>
                </div>
              )}
            </button>

            {/* City Picker Dropdown */}
            <AnimatePresence>
              {isCityPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Select City
                    </p>
                    {(Object.keys(CITIES) as CityName[]).map((city) => (
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
                        <span className="text-xl">{CITIES[city].label.split(' ')[0]}</span>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{city}</p>
                          <p className={`text-xs ${currentCity === city ? 'text-gray-300' : 'text-gray-500'}`}>
                            {city === 'Gudauri' ? 'Winter Resort' : 'Available cars'}
                          </p>
                        </div>
                        {currentCity === city && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Backdrop */}
            {isCityPickerOpen && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsCityPickerOpen(false)}
              />
            )}
          </div>
        </motion.div>

        {/* User Profile Button */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100/50 flex items-center justify-center hover:shadow-2xl transition-shadow">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
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
                <a 
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
                </a>

                <a 
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
                </a>

                <a 
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
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </div>
    </div>
  )
}
