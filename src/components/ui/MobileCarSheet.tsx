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
    startDate?: Date
    endDate?: Date
    onViewDetails?: (carId: string) => void
}

// ... existing code ...

export function MobileCarSheet({
    selectedCar,
    onCarSelect,
    startDate,
    endDate,
    onViewDetails,
}: MobileCarSheetProps) {

    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    // Construct URL with date params
    const getCarUrl = (carId: string) => {
        const params = new URLSearchParams()
        if (startDate) params.set('startDate', startDate.toISOString())
        if (endDate) params.set('endDate', endDate.toISOString())
        const queryString = params.toString()
        return `/cars/${carId}${queryString ? `?${queryString}` : ''}`
    }

    return (
        <AnimatePresence>
            {selectedCar && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    drag={isDesktop ? false : "y"}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                        if (isDesktop) return
                        if (info.offset.y < -50 && onViewDetails) {
                            onViewDetails(selectedCar.id)
                        } else if (info.offset.y > 50) {
                            onCarSelect(null)
                        }
                    }}
                    className="fixed bottom-0 left-0 right-0 lg:left-4 lg:right-auto lg:top-24 lg:w-[400px] lg:bottom-auto lg:rounded-3xl lg:border lg:shadow-2xl z-50 bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] px-4 pt-4 pb-safe border-t border-gray-100"
                    style={{ maxHeight: isDesktop ? 'calc(100vh - 120px)' : '85vh', overflowY: 'visible' }}
                >
                    {/* Drag Handle - Hide on Desktop */}
                    <div className="w-12 h-1.5 bg-gray-300/80 rounded-full mx-auto mb-4 lg:hidden" />
                    {/* ... existing content ... */}

                    {/* Content */}
                    <div className="pb-24">
                        <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                            {/* ... image content ... */}
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

                        {onViewDetails ? (
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={() => onViewDetails(selectedCar.id)}
                            >
                                View Details & Book
                            </Button>
                        ) : (
                            <Link href={getCarUrl(selectedCar.id)} className="w-full block">
                                <Button className="w-full h-12 text-lg">View Details & Book</Button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
