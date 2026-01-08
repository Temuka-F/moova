"use client"

import { useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import Map, {
  Marker,
  GeolocateControl,
  NavigationControl,
  MapRef,
  Popup
} from 'react-map-gl'
import { motion, AnimatePresence } from 'motion/react'
import { MapCar, CITIES, CityName } from '@/lib/map-cars'
import { Star } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapCanvasHandle {
  flyToCity: (city: CityName) => void
  flyToCar: (car: MapCar) => void
}

interface MapCanvasProps {
  cars: MapCar[]
  selectedCar: MapCar | null
  hoveredCar?: MapCar | null
  onMarkerClick: (car: MapCar) => void
  onMapClick: () => void
  currentCity: CityName
  className?: string
  id?: string
}

interface ViewState {
  latitude: number
  longitude: number
  zoom: number
}

// Custom price pill marker component
function CarMarker({
  car,
  isSelected,
  isHovered,
  onClick
}: {
  car: MapCar
  isSelected: boolean
  isHovered: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  const highlighted = isSelected || isHovered

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: highlighted ? 1.2 : 1,
        opacity: 1,
        zIndex: highlighted ? 100 : 1,
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="cursor-pointer select-none"
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className={`
          relative flex items-center gap-1.5 px-3 py-2 rounded-full
          font-bold text-sm whitespace-nowrap select-none
          transition-all duration-200 ease-out
          ${highlighted
            ? 'bg-black text-white shadow-2xl ring-4 ring-white'
            : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
          }
          ${car.isWinterReady && !highlighted ? 'ring-2 ring-blue-400' : ''}
        `}
      >
        {car.isWinterReady && (
          <span className="text-sm">❄️</span>
        )}
        <span className="text-base">{car.price}₾</span>

        {/* Pointer triangle */}
        <div
          className={`
            absolute -bottom-2 left-1/2 -translate-x-1/2 
            w-0 h-0 
            border-l-[8px] border-l-transparent
            border-r-[8px] border-r-transparent
            border-t-[10px] 
            ${highlighted ? 'border-t-black' : 'border-t-white'}
          `}
        />
      </div>
    </motion.div>
  )
}

export const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(function MapCanvas(
  { cars, selectedCar, hoveredCar, onMarkerClick, onMapClick, currentCity, id, className },
  ref
) {
  const mapRef = useRef<MapRef>(null)
  const cityData = CITIES[currentCity]
  const [viewState, setViewState] = useState<ViewState>({
    latitude: cityData.lat,
    longitude: cityData.lng,
    zoom: cityData.zoom,
  })
  const [popupInfo, setPopupInfo] = useState<MapCar | null>(null)

  // Mapbox access token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    'pk.eyJ1IjoibW9vdmExIiwiYSI6ImNtazQwOHM3NTAyajMzZnNjODVoMjA5MXUifQ.-uV331lmyvZseA3DQjsVaQ'

  // Map styles - winter/mountain style for ski resorts
  const mountainCities: CityName[] = ['Gudauri', 'Bakuriani', 'Mestia']
  const mapStyle = mountainCities.includes(currentCity)
    ? 'mapbox://styles/mapbox/outdoors-v12'
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

    // Fly to the car
    flyToCar(car)

    // Notify parent
    onMarkerClick(car)
  }, [onMarkerClick, flyToCar])

  // Handle map click (deselect car)
  const handleMapClick = useCallback(() => {
    setPopupInfo(null)
    onMapClick()
  }, [onMapClick])

  return (
    <div
      className={`absolute inset-0 z-0 ${className || ''}`}
      style={{ touchAction: 'pan-x pan-y' }}
    >
      <Map
        id={id}
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
        touchZoomRotate={true}
        doubleClickZoom={true}
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
                e.originalEvent.stopPropagation()
                e.originalEvent.preventDefault()
              }}
            >
              <CarMarker
                car={car}
                isSelected={selectedCar?.id === car.id}
                isHovered={hoveredCar?.id === car.id}
                onClick={(e) => handleMarkerClick(car, e)}
              />
            </Marker>
          ))}
        </AnimatePresence>

        {/* Mini popup on hover (desktop only) */}
        {hoveredCar && !selectedCar && (
          <Popup
            latitude={hoveredCar.lat}
            longitude={hoveredCar.lng}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -45]}
            className="map-popup"
          >
            <div className="p-2 min-w-[180px]">
              <p className="font-semibold text-gray-900">{hoveredCar.make} {hoveredCar.model}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{hoveredCar.rating}</span>
                <span>·</span>
                <span>{hoveredCar.category}</span>
              </div>
              <p className="font-bold text-gray-900 mt-1">{hoveredCar.price}₾/day</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Mountain mode overlay gradient for ski resorts */}
      {mountainCities.includes(currentCity) && (
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-100/20 via-transparent to-blue-200/10"
          aria-hidden="true"
        />
      )}
    </div>
  )
})
