"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'motion/react'
import {
    Snowflake,
    Car,
    Zap,
    Star,
    X,
    MapPin,
    ChevronUp,
    ChevronDown,
    Sparkles,
    Leaf
} from 'lucide-react'
import { MapCar, getTopRatedCars } from '@/lib/map-cars'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Reuse the same types/interfaces as DesktopSidebar to ensure parity
interface MobileCarSheetProps {
    selectedCar: MapCar | null
    onCarSelect: (car: MapCar | null) => void
}

const FILTER_CHIPS = [
    { id: 'winter', label: 'Winter Ready', icon: Snowflake, color: 'bg-blue-500' },
    { id: 'suv', label: 'SUV', icon: Car, color: 'bg-orange-500' },
    { id: 'luxury', label: 'Luxury', icon: Sparkles, color: 'bg-purple-500' },
    { id: 'hybrid', label: 'Hybrid/EV', icon: Leaf, color: 'bg-green-500' },
    { id: 'instant', label: 'Instant Book', icon: Zap, color: 'bg-emerald-500' },
    { id: 'compact', label: 'Compact', icon: Car, color: 'bg-gray-500' },
    { id: 'sedan', label: 'Sedan', icon: Car, color: 'bg-indigo-500' },
]

export function MobileCarSheet({
    selectedCar,
    onCarSelect,
}: MobileCarSheetProps) {
    return (
        <AnimatePresence>
            {selectedCar && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] px-4 pt-4 pb-safe border-t border-gray-100"
                    style={{ maxHeight: '85vh', overflowY: 'auto' }}
                >
                    {/* Close Handle / Indicator */}
                    <div className="w-full flex justify-center mb-4 cursor-pointer" onClick={() => onCarSelect(null)}>
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="pb-24">
                        <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                            <Image
                                src={selectedCar.images[0]}
                                alt={selectedCar.make}
                                fill
                                className="object-cover"
                            />
                            {/* Close Button Overlay */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onCarSelect(null)
                                }}
                                className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedCar.make} {selectedCar.model}</h2>
                                <p className="text-gray-500">{selectedCar.year} • {selectedCar.transmission}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold">{selectedCar.price}₾</p>
                                <p className="text-gray-500 text-sm">/day</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 mb-6">
                            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="font-semibold">{selectedCar.rating}</span>
                                <span className="text-gray-400">({selectedCar.reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                <MapPin className="w-4 h-4" />
                                <span>{selectedCar.city}</span>
                            </div>
                        </div>

                        <Link href={`/cars/${selectedCar.id}`} className="w-full block">
                            <Button className="w-full h-12 text-lg">View Details & Book</Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
