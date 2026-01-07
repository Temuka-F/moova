"use client"

import { motion } from 'motion/react'
import { 
  Locate, 
  Plus, 
  Minus,
  Layers,
  Info
} from 'lucide-react'
import { CityName, CITIES } from '@/lib/map-cars'

interface MapControlsProps {
  onRecenter: () => void
  currentCity: CityName
  carCount: number
  winterReadyCount: number
}

export function MapControls({ 
  onRecenter, 
  currentCity,
  carCount,
  winterReadyCount
}: MapControlsProps) {
  return (
    <>
      {/* Left side controls */}
      <div className="absolute bottom-32 left-4 z-40 flex flex-col gap-2 lg:bottom-8">
        {/* Recenter button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onRecenter}
          className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
          title="Recenter map"
        >
          <Locate className="w-5 h-5 text-gray-700" />
        </motion.button>
      </div>

      {/* Legend / Stats card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 hidden sm:block lg:bottom-8"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 px-5 py-3">
          <div className="flex items-center gap-6 text-sm">
            {/* Car count */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded-full" />
              <span className="text-gray-900 font-medium">{carCount} cars</span>
            </div>
            
            {/* Winter ready */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full ring-2 ring-blue-200" />
              <span className="text-gray-600">{winterReadyCount} winter ready</span>
            </div>

            {/* Instant book */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-gray-600">Instant book</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile car count badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-36 left-4 z-40 sm:hidden"
      >
        <div className="bg-black text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg">
          {carCount} cars in {currentCity}
        </div>
      </motion.div>
    </>
  )
}
