"use client"

import { useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import Map, { 
  Marker, 
  GeolocateControl, 
  NavigationControl,
  MapRef 
} from 'react-map-gl'
import { motion, AnimatePresence } from 'motion/react'
import { MapCar, CITIES, CityName } from '@/lib/map-cars'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapCanvasHandle {
  flyToCity: (city: CityName) => void
  flyToCar: (car: MapCar) => void
}

interface MapCanvasProps {
  cars: MapCar[]
  selectedCar: MapCar | null
  onMarkerClick: (car: MapCar) => void
  onMapClick: () => void
  currentCity: CityName
}

// Custom price pill marker component
function CarMarker({ 
  car, 
  isSelected, 
  onClick 
}: { 
  car: MapCar
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void 
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
      className="cursor-pointer select-none"
      style={{ touchAction: 'none' }}
    >
      <div 
        className={`
          relative flex items-center gap-1 px-3 py-1.5 rounded-full
          font-semibold text-sm whitespace-nowrap select-none
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

interface ViewState {
  latitude: number
  longitude: number
  zoom: number
}

export const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(function MapCanvas(
  { cars, selectedCar, onMarkerClick, onMapClick, currentCity },
  ref
) {
  const mapRef = useRef<MapRef>(null)
  const cityData = CITIES[currentCity]
  const [viewState, setViewState] = useState<ViewState>({
    latitude: cityData.lat,
    longitude: cityData.lng,
    zoom: cityData.zoom,
  })

  // Mapbox access token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 
    'pk.eyJ1IjoibW9vdmExIiwiYSI6ImNtazQwOHM3NTAyajMzZnNjODVoMjA5MXUifQ.-uV331lmyvZseA3DQjsVaQ'

  // Map styles - winter style for Gudauri
  const mapStyle = currentCity === 'Gudauri' 
    ? 'mapbox://styles/mapbox/light-v11'
    : 'mapbox://styles/mapbox/streets-v12'

  // Fly to city
  const flyToCity = useCallback((city: CityName) => {
    const target = CITIES[city]
    mapRef.current?.flyTo({
      center: [target.lng, target.lat],
      zoom: target.zoom,
      duration: 2000,
      essential: true,
    })
  }, [])

  // Fly to car
  const flyToCar = useCallback((car: MapCar) => {
    mapRef.current?.flyTo({
      center: [car.lng, car.lat],
      zoom: 15,
      duration: 1500,
      essential: true,
    })
  }, [])

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    flyToCity,
    flyToCar,
  }), [flyToCity, flyToCar])

  // Fly to new city when currentCity changes
  useEffect(() => {
    flyToCity(currentCity)
  }, [currentCity, flyToCity])

  // Handle marker click with proper event handling
  const handleMarkerClick = useCallback((car: MapCar, e: React.MouseEvent) => {
    // CRITICAL: Stop propagation to prevent map click
    e.stopPropagation()
    e.preventDefault()
    onMarkerClick(car)
    flyToCar(car)
  }, [onMarkerClick, flyToCar])

  // Handle map click (deselect car)
  const handleMapClick = useCallback(() => {
    onMapClick()
  }, [onMapClick])

  return (
    <div 
      className="absolute inset-0 z-0" 
      style={{ touchAction: 'none' }}
    >
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
        dragRotate={false}
        pitchWithRotate={false}
      >
        {/* User location control */}
        <GeolocateControl
          position="bottom-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
          style={{
            marginBottom: '160px',
            marginRight: '12px',
          }}
        />

        {/* Navigation controls */}
        <NavigationControl 
          position="bottom-right" 
          showCompass={false}
          style={{
            marginBottom: '220px',
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
              onClick={(e) => {
                // Also stop here for mapbox events
                e.originalEvent.stopPropagation()
                e.originalEvent.preventDefault()
              }}
            >
              <CarMarker
                car={car}
                isSelected={selectedCar?.id === car.id}
                onClick={(e) => handleMarkerClick(car, e)}
              />
            </Marker>
          ))}
        </AnimatePresence>
      </Map>

      {/* Winter mode overlay gradient for Gudauri */}
      {currentCity === 'Gudauri' && (
        <div 
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-100/20 via-transparent to-blue-200/10"
          aria-hidden="true"
        />
      )}
    </div>
  )
})
