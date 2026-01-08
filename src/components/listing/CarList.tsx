"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { MapCar } from '@/lib/map-cars'
import { Car, Snowflake, Zap, Star, MapPin, Users, Fuel, Gauge } from 'lucide-react'

interface CarListProps {
    cars: MapCar[]
    onCarSelect?: (car: MapCar) => void // Optional, if we want list items to just open details directly
}

export function CarList({ cars }: CarListProps) {
    if (cars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <Car className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No cars found</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                    Try adjusting your filters or changing the location.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
            {cars.map((car, index) => (
                <CarListCard key={car.id} car={car} index={index} />
            ))}
        </div>
    )
}

function CarListCard({ car, index }: { car: MapCar; index: number }) {
    const [imageError, setImageError] = useState(false)

    return (
        <Link href={`/cars/${car.id}`} className="block group">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {imageError ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Car className="w-12 h-12 text-gray-300" />
                        </div>
                    ) : (
                        <Image
                            src={car.images[0]}
                            alt={`${car.make} ${car.model}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => setImageError(true)}
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {car.isWinterReady && (
                            <div className="w-8 h-8 rounded-full bg-blue-500/90 backdrop-blur-sm flex items-center justify-center text-white shadow-sm" title="Winter Ready">
                                <Snowflake className="w-4 h-4" />
                            </div>
                        )}
                        {car.isInstantBook && (
                            <div className="w-8 h-8 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center text-white shadow-sm" title="Instant Book">
                                <Zap className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                        <span className="font-bold text-gray-900">{car.price}₾</span>
                        <span className="text-xs text-gray-500 font-medium">/day</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                {car.make} {car.model}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate">{car.city} • {car.address}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-sm text-gray-900">{car.rating}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 py-3 border-t border-gray-100 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            {car.seats} seats
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-gray-400" />
                            {car.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Fuel className="w-3.5 h-3.5 text-gray-400" />
                            {car.fuelType}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
