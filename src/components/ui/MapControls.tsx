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
    <div className="flex flex-col gap-2 items-end">
      {/* Recenter button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onRecenter}
        className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
        title="Recenter map"
      >
        <Locate className="w-5 h-5 text-gray-700" />
      </motion.button>
      
      {/* Stats card - desktop only */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:block"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 px-4 py-2.5">
          <div className="flex flex-col gap-2 text-xs">
            {/* Car count */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <span className="text-gray-900 font-medium">{carCount} available</span>
            </div>
            
            {/* Winter ready */}
            {winterReadyCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <span className="text-gray-600">{winterReadyCount} winter ready</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
