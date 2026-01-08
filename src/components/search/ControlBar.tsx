"use client"

import { Map as MapIcon, List, SlidersHorizontal, Snowflake, Car, Sparkles, Leaf, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ControlBarProps {
    viewMode: 'map' | 'list'
    onViewChange: (mode: 'map' | 'list') => void
    activeFilter: string | null
    onFilterChange: (filter: string | null) => void
    totalCars: number
    showToggle?: boolean // Added prop
}

const FILTER_CHIPS = [
    { id: 'winter', label: 'Winter', icon: Snowflake },
    { id: 'suv', label: 'SUV', icon: Car },
    { id: 'luxury', label: 'Luxury', icon: Sparkles },
    { id: 'hybrid', label: 'Hybrid', icon: Leaf },
    { id: 'instant', label: 'Instant', icon: Zap },
]

export function ControlBar({
    viewMode,
    onViewChange,
    activeFilter,
    onFilterChange,
    totalCars,
    showToggle = true // Default to true
}: ControlBarProps) {
    return (
        <div className="flex flex-col gap-3 py-2">
            {/* Top Row: Toggle + Count */}
            <div className="flex items-center justify-between px-1">
                {/* View Toggle (Segmented Control) */}
                {showToggle ? (
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 h-10 w-48">
                        <button
                            type="button"
                            onClick={() => onViewChange('map')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 h-full rounded-md text-sm font-medium transition-all",
                                viewMode === 'map' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <MapIcon className="w-4 h-4" />
                            Map
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewChange('list')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 h-full rounded-md text-sm font-medium transition-all",
                                viewMode === 'list' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <List className="w-4 h-4" />
                            List
                        </button>
                    </div>
                ) : (
                    <div className="flex-1" /> /* Spacer if toggle hidden */
                )}

                {/* Count */}
                <p className="text-sm font-medium text-gray-900 hidden sm:block">
                    {totalCars} cars available
                </p>

                {/* Mobile Filter Button (if we want a modal later) or just spacing */}
                <button type="button" className="sm:hidden p-2 rounded-full hover:bg-gray-100">
                    <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* Bottom Row: Horizontal Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                {FILTER_CHIPS.map((chip) => {
                    const Icon = chip.icon
                    const isActive = activeFilter === chip.id
                    return (
                        <button
                            type="button"
                            key={chip.id}
                            onClick={() => onFilterChange(isActive ? null : chip.id)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all active:scale-95",
                                isActive
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {chip.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
