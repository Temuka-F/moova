"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, ChevronDown, CalendarDays } from 'lucide-react'
import { CITIES, CityName } from '@/lib/map-cars'
import { format } from 'date-fns'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface SearchBarProps {
    currentCity: CityName
    onCityChange: (city: CityName) => void
    startDate?: Date
    endDate?: Date
    onDateChange?: (start: Date | undefined, end: Date | undefined) => void
}

export function SearchBar({
    currentCity,
    onCityChange,
    startDate,
    endDate,
    onDateChange
}: SearchBarProps) {
    const [isCityPickerOpen, setIsCityPickerOpen] = useState(false)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

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

    const cityGroups = {
        'Major Cities': ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi'] as CityName[],
        'Mountain Resorts': ['Gudauri', 'Bakuriani', 'Mestia'] as CityName[],
        'Wine & Nature': ['Telavi', 'Borjomi', 'Zugdidi'] as CityName[],
    }

    return (
        <div className="w-full max-w-2xl mx-auto" ref={dropdownRef}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex items-stretch h-14">
                {/* City Selector */}
                <button
                    onClick={() => {
                        setIsCityPickerOpen(!isCityPickerOpen)
                        setIsDatePickerOpen(false)
                    }}
                    className={`
            flex-1 flex items-center gap-3 px-4
            transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100
            border-r border-gray-100
            ${isCityPickerOpen ? 'bg-gray-50' : ''}
          `}
                >
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Location</p>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-900 truncate text-sm">{currentCity}</span>
                            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isCityPickerOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </button>

                {/* Date Selector */}
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                        <button
                            onClick={() => {
                                setIsDatePickerOpen(!isDatePickerOpen)
                                setIsCityPickerOpen(false)
                            }}
                            className={`
                 flex-[0.8] flex items-center gap-3 px-4
                 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100
                 ${isDatePickerOpen ? 'bg-gray-50' : ''}
               `}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <CalendarDays className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Dates</p>
                                <p className="font-semibold text-gray-900 truncate text-sm">
                                    {startDate && endDate
                                        ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
                                        : 'Any time'
                                    }
                                </p>
                            </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-32px)] sm:w-auto p-0 rounded-2xl shadow-xl border-gray-200 mr-4" align="end" sideOffset={5}>
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Select dates</h3>
                        </div>
                        <div className="flex gap-4 p-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Pick-up</p>
                                <CalendarComponent
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => onDateChange?.(date, endDate)}
                                    disabled={(date) => date < new Date()}
                                    className="rounded-xl border border-gray-100"
                                />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Return</p>
                                <CalendarComponent
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) => onDateChange?.(startDate, date)}
                                    disabled={(date) => date <= (startDate || new Date())}
                                    className="rounded-xl border border-gray-100"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <button
                                onClick={() => onDateChange?.(undefined, undefined)}
                                className="text-sm text-gray-500 hover:text-gray-900 font-medium"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsDatePickerOpen(false)}
                                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-transform active:scale-95"
                            >
                                Apply
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* City Picker Dropdown (Absolute) */}
            <AnimatePresence>
                {isCityPickerOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-16 left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-h-[60vh] overflow-y-auto mx-4 lg:mx-0 lg:w-[400px]"
                    >
                        {Object.entries(cityGroups).map(([groupName, cities]) => (
                            <div key={groupName}>
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 sticky top-0">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{groupName}</p>
                                </div>
                                <div>
                                    {cities.map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => {
                                                onCityChange(city)
                                                setIsCityPickerOpen(false)
                                            }}
                                            className={`
                                w-full flex items-center gap-3 px-4 py-3 text-left
                                transition-colors hover:bg-gray-50
                                ${currentCity === city ? 'bg-black/5' : ''}
                             `}
                                        >
                                            <div className="w-8 text-xl text-center">{CITIES[city].label.split(' ')[0]}</div>
                                            <div>
                                                <p className={`font-medium ${currentCity === city ? 'text-black' : 'text-gray-700'}`}>{city}</p>
                                                <p className="text-xs text-gray-500">{CITIES[city].description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
