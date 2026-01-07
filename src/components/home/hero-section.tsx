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
    <section className="relative min-h-screen bg-gradient-to-br from-secondary via-secondary to-primary/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-24">
          {/* Left Content */}
          <div className="space-y-8 animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Now available in 20+ cities across Georgia
            </div>

            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Drive your way
                <span className="block text-primary">across Georgia</span>
              </h1>
              <p className="mt-6 text-xl text-white/80 max-w-lg">
                Rent unique cars from trusted local hosts. From city drives to mountain adventures — find your perfect ride.
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-xl">
              <div className="relative">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                  <MapPin className="w-5 h-5 text-primary" />
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
                      className="border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto"
                    />
                    
                    {/* City Suggestions */}
                    {showSuggestions && location && filteredCities.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                        {filteredCities.slice(0, 5).map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left"
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
                  className="w-full mt-2 h-14 text-lg font-semibold rounded-xl"
                >
                  Search available cars
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-5 h-5 text-primary" />
                <span>Fully insured</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-5 h-5 text-primary" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Star className="w-5 h-5 text-primary" />
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
