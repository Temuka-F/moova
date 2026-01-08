"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { MapCar } from '@/lib/map-cars'
import { X, Star, Zap, Snowflake, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MapCarCardProps {
    car: MapCar
    onClose: () => void
}

export function MapCarCard({ car, onClose }: MapCarCardProps) {
    const [imageError, setImageError] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-24 lg:bottom-8 left-4 right-4 lg:left-auto lg:right-auto lg:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
        >
            {/* Close Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                }}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex p-3 gap-3">
                {/* Image (Thumbnail) */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {imageError ? (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    ) : (
                        <Image
                            src={car.images[0]}
                            alt={car.make}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    )}
                    {car.isInstantBook && (
                        <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 truncate pr-6">{car.make} {car.model}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="font-medium text-gray-900">{car.rating}</span>
                            <span>({car.reviewCount})</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">{car.address}</p>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                        <div>
                            <span className="font-bold text-lg text-gray-900">{car.price}₾</span>
                            <span className="text-xs text-gray-500">/day</span>
                        </div>
                        <Link href={`/cars/${car.id}`}>
                            <Button size="sm" className="h-8 text-xs px-3 rounded-lg">
                                View
                                <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
