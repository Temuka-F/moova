"use client"

import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, MapPin, Mountain, ChevronDown } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface FloatingOmniboxProps {
  isWinterMode: boolean
  setIsWinterMode: (value: boolean) => void
}

export function FloatingOmnibox({ 
  isWinterMode, 
  setIsWinterMode 
}: FloatingOmniboxProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      {/* Main omnibox container */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="pointer-events-auto"
      >
        <div 
          className={`
            bg-white rounded-2xl shadow-xl border border-gray-100/50
            transition-all duration-300 ease-out overflow-hidden
            ${isExpanded ? 'shadow-2xl' : ''}
          `}
        >
          {/* Search bar row */}
          <div 
            className="flex items-center gap-3 p-3 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* Search icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>

            {/* Location text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="font-semibold text-gray-900 truncate">
                  {isWinterMode ? 'Gudauri' : 'Tbilisi'}
                </p>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-sm text-gray-500 truncate">
                {isWinterMode ? 'Ski resorts & mountain adventures' : 'Find cars near you'}
              </p>
            </div>

            {/* Winter mode toggle */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <motion.div
                animate={{ 
                  scale: isWinterMode ? [1, 1.2, 1] : 1,
                  rotate: isWinterMode ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <Mountain 
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isWinterMode ? 'text-blue-500' : 'text-gray-400'
                  }`} 
                />
                {isWinterMode && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 text-[10px]"
                  >
                    ❄️
                  </motion.span>
                )}
              </motion.div>
              <Switch
                checked={isWinterMode}
                onCheckedChange={setIsWinterMode}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          {/* Expanded content */}
          <motion.div
            initial={false}
            animate={{ 
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100">
              {/* Quick location options */}
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Popular Destinations
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    setIsWinterMode(false)
                    setIsExpanded(false)
                  }}
                  className={`
                    flex items-center gap-2 p-3 rounded-xl text-left transition-all
                    ${!isWinterMode 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl">🏙️</span>
                  <div>
                    <p className="font-medium text-sm">Tbilisi</p>
                    <p className={`text-xs ${!isWinterMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      City & surroundings
                    </p>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    setIsWinterMode(true)
                    setIsExpanded(false)
                  }}
                  className={`
                    flex items-center gap-2 p-3 rounded-xl text-left transition-all
                    ${isWinterMode 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl">🏔️</span>
                  <div>
                    <p className="font-medium text-sm">Gudauri</p>
                    <p className={`text-xs ${isWinterMode ? 'text-blue-100' : 'text-gray-500'}`}>
                      Ski resort
                    </p>
                  </div>
                </button>
              </div>

              {/* Winter mode info */}
              {isWinterMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">❄️</span>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Gudauri Mode Active</p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Showing only winter-ready vehicles with 4WD, snow tires, and mountain equipment.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
