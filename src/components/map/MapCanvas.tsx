"use client"

import { useRef, useCallback, useEffect, useState } from 'react'
import Map, { 
  Marker, 
  GeolocateControl, 
  NavigationControl,
  MapRef 
} from 'react-map-gl'
import { motion, AnimatePresence } from 'motion/react'
import { MapCar } from '@/lib/map-cars'
import 'mapbox-gl/dist/mapbox-gl.css'

// Tbilisi coordinates
const TBILISI_CENTER = {
  latitude: 41.7151,
  longitude: 44.8271,
  zoom: 12,
}

// Gudauri coordinates (for winter mode)
const GUDAURI_CENTER = {
  latitude: 42.4801,
  longitude: 44.4789,
  zoom: 13,
}

interface MapCanvasProps {
  cars: MapCar[]
  selectedCar: MapCar | null
  setSelectedCar: (car: MapCar | null) => void
  isWinterMode: boolean
}

// Custom price pill marker component
function CarMarker({ 
  car, 
  isSelected, 
  onClick 
}: { 
  car: MapCar
  isSelected: boolean
  onClick: () => void 
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.15 : 1, 
        opacity: 1,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div 
        className={`
          relative flex items-center gap-1 px-3 py-1.5 rounded-full
          font-semibold text-sm whitespace-nowrap
          transition-all duration-200 ease-out
          ${isSelected 
            ? 'bg-black text-white shadow-2xl scale-110 ring-2 ring-white' 
            : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
          }
          ${car.isWinterReady ? 'border-2 border-blue-400' : ''}
        `}
      >
        {car.isWinterReady && (
          <span className="text-xs">❄️</span>
        )}
        <span>{car.price}₾</span>
        
        {/* Pointer triangle */}
        <div 
          className={`
            absolute -bottom-2 left-1/2 -translate-x-1/2 
            w-0 h-0 
            border-l-[6px] border-l-transparent
            border-r-[6px] border-r-transparent
            border-t-[8px] 
            ${isSelected ? 'border-t-black' : 'border-t-white'}
          `}
        />
      </div>
    </motion.div>
  )
}

export function MapCanvas({ 
  cars, 
  selectedCar, 
  setSelectedCar,
  isWinterMode 
}: MapCanvasProps) {
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useState(isWinterMode ? GUDAURI_CENTER : TBILISI_CENTER)

  // Mapbox access token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 
    'pk.eyJ1IjoibW9vdmExIiwiYSI6ImNtazQwOHM3NTAyajMzZnNjODVoMjA5MXUifQ.-uV331lmyvZseA3DQjsVaQ'

  // Map styles
  const mapStyle = isWinterMode 
    ? 'mapbox://styles/mapbox/light-v11'
    : 'mapbox://styles/mapbox/streets-v12'

  // Fly to car when selected
  const flyToCar = useCallback((car: MapCar) => {
    mapRef.current?.flyTo({
      center: [car.lng, car.lat],
      zoom: 15,
      duration: 1500,
      essential: true,
    })
  }, [])

  // Fly to location when winter mode changes
  useEffect(() => {
    const center = isWinterMode ? GUDAURI_CENTER : TBILISI_CENTER
    mapRef.current?.flyTo({
      center: [center.longitude, center.latitude],
      zoom: center.zoom,
      duration: 2000,
      essential: true,
    })
  }, [isWinterMode])

  // Handle marker click
  const handleMarkerClick = useCallback((car: MapCar) => {
    setSelectedCar(car)
    flyToCar(car)
  }, [setSelectedCar, flyToCar])

  // Handle map click (deselect car)
  const handleMapClick = useCallback(() => {
    if (selectedCar) {
      setSelectedCar(null)
    }
  }, [selectedCar, setSelectedCar])

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
      >
        {/* User location control */}
        <GeolocateControl
          position="bottom-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
          style={{
            marginBottom: '140px',
            marginRight: '12px',
          }}
        />

        {/* Navigation controls */}
        <NavigationControl 
          position="bottom-right" 
          showCompass={false}
          style={{
            marginBottom: '200px',
            marginRight: '12px',
          }}
        />

        {/* Car markers */}
        <AnimatePresence>
          {cars.map((car) => (
            <Marker
              key={car.id}
              latitude={car.lat}
              longitude={car.lng}
              anchor="bottom"
            >
              <CarMarker
                car={car}
                isSelected={selectedCar?.id === car.id}
                onClick={() => handleMarkerClick(car)}
              />
            </Marker>
          ))}
        </AnimatePresence>
      </Map>

      {/* Winter mode overlay gradient */}
      {isWinterMode && (
        <div 
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-100/20 via-transparent to-blue-200/10"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
