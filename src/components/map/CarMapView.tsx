'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Locate, ZoomIn, ZoomOut, Star, Zap } from 'lucide-react'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface CarLocation {
  id: string
  make: string
  model: string
  year: number
  pricePerDay: number
  latitude: number
  longitude: number
  rating: number
  isInstantBook: boolean
  image: string
}

interface CarMapProps {
  cars: CarLocation[]
  selectedCarId?: string | null
  onCarSelect?: (carId: string) => void
  center?: [number, number]
  zoom?: number
  className?: string
  showControls?: boolean
}

export function CarMap({
  cars,
  selectedCarId,
  onCarSelect,
  center = [41.7151, 44.8271], // Tbilisi default
  zoom = 12,
  className = '',
  showControls = true,
}: CarMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [mapRef, setMapRef] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // Import Leaflet on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)
    })
    // Add Leaflet CSS via link tag
    if (typeof document !== 'undefined' && !document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
  }, [])

  const createCustomIcon = useMemo(() => {
    if (!L) return null
    return (price: number, isSelected: boolean, isInstantBook: boolean) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative group">
            <div class="flex items-center gap-1 px-2.5 py-1.5 rounded-full font-semibold text-sm shadow-lg transition-all duration-200 ${
              isSelected 
                ? 'bg-primary text-white scale-110' 
                : 'bg-white text-foreground hover:scale-105'
            }" style="border: 2px solid ${isSelected ? 'hsl(174, 100%, 41%)' : '#e5e5e5'}">
              ${isInstantBook ? '<span class="text-xs">⚡</span>' : ''}
              <span>₾${price}</span>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
              isSelected ? 'bg-primary' : 'bg-white'
            }" style="border-right: 2px solid ${isSelected ? 'hsl(174, 100%, 41%)' : '#e5e5e5'}; border-bottom: 2px solid ${isSelected ? 'hsl(174, 100%, 41%)' : '#e5e5e5'}"></div>
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 40],
      })
    }
  }, [L])

  const handleLocate = () => {
    if (navigator.geolocation && mapRef) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.flyTo([position.coords.latitude, position.coords.longitude], 14)
        },
        () => {
          console.log('Unable to get location')
        }
      )
    }
  }

  const handleZoomIn = () => {
    if (mapRef) mapRef.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef) mapRef.zoomOut()
  }

  if (!isClient) {
    return (
      <div className={`bg-muted animate-pulse rounded-2xl ${className}`}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Loading map...
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
        ref={setMapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {cars.map((car) => (
          createCustomIcon && (
            <Marker
              key={car.id}
              position={[car.latitude, car.longitude]}
              icon={createCustomIcon(car.pricePerDay, car.id === selectedCarId, car.isInstantBook)}
              eventHandlers={{
                click: () => onCarSelect?.(car.id),
              }}
            >
              <Popup className="car-popup">
                <div className="w-64 p-0">
                  <div 
                    className="h-32 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url('${car.image}')` }}
                  />
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{car.make} {car.model}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span>{car.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{car.year}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">₾{car.pricePerDay}</span>
                        <span className="text-sm text-muted-foreground">/day</span>
                      </div>
                      {car.isInstantBook && (
                        <Badge variant="default" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Instant
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <Button
            size="icon"
            variant="secondary"
            className="w-10 h-10 rounded-xl shadow-lg bg-white hover:bg-gray-50"
            onClick={handleLocate}
          >
            <Locate className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-10 h-10 rounded-xl shadow-lg bg-white hover:bg-gray-50"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-10 h-10 rounded-xl shadow-lg bg-white hover:bg-gray-50"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Car Count Badge */}
      <div className="absolute bottom-4 left-4 z-30">
        <Badge variant="secondary" className="px-3 py-1.5 bg-white shadow-lg">
          {cars.length} cars nearby
        </Badge>
      </div>
    </div>
  )
}

// Mini map component for car cards
export function MiniCarMap({ 
  latitude, 
  longitude,
  className = ''
}: { 
  latitude: number
  longitude: number
  className?: string
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Add Leaflet CSS via link tag
    if (typeof document !== 'undefined' && !document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
  }, [])

  if (!isClient) {
    return <div className={`bg-muted animate-pulse rounded-xl ${className}`} />
  }

  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        className="w-full h-full"
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
      </MapContainer>
    </div>
  )
}
