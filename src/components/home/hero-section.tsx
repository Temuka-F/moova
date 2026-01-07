'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, ArrowRight, Car, Shield, Clock, Star } from 'lucide-react'
import { GEORGIAN_CITIES } from '@/types'

export function HeroSection() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredCities = GEORGIAN_CITIES.filter(city =>
    city.toLowerCase().includes(location.toLowerCase())
  )

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('city', location)
    router.push(`/cars?${params.toString()}`)
  }

  const handleCitySelect = (city: string) => {
    setLocation(city)
    setShowSuggestions(false)
  }

  return (
    <section className="relative min-h-[100dvh] bg-gradient-to-br from-secondary via-secondary to-primary/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[100dvh] py-20 md:py-24">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 animate-slideUp pt-16 md:pt-0">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs md:text-sm">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-primary rounded-full animate-pulse" />
              Now available in 20+ cities across Georgia
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Drive your way
                <span className="block text-primary">across Georgia</span>
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-xl text-white/80 max-w-lg">
                Rent unique cars from trusted local hosts. From city drives to mountain adventures — find your perfect ride.
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-xl">
              <div className="relative">
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-muted rounded-xl">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Where do you want to pick up?"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="border-0 bg-transparent text-base md:text-lg placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto"
                    />
                    
                    {/* City Suggestions */}
                    {showSuggestions && location && filteredCities.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                        {filteredCities.slice(0, 5).map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="w-full flex items-center gap-3 p-3 md:p-4 hover:bg-muted transition-colors text-left"
                          >
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">{city}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full mt-2 h-12 md:h-14 text-base md:text-lg font-semibold rounded-xl"
                >
                  Search available cars
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 md:gap-6 pt-2 md:pt-4">
              <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span>Fully insured</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span>Verified hosts</span>
              </div>
            </div>
          </div>

          {/* Right Content - Car Image */}
          <div className="relative hidden lg:block animate-slideInRight delay-200">
            <div className="relative">
              {/* Car Image */}
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt="Luxury car"
                  className="w-full h-auto object-contain rounded-3xl shadow-2xl"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">500+</p>
                    <p className="text-sm text-muted-foreground">Cars available</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 animate-float delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">4.9★</p>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
