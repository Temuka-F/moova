'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, TrendingUp, Shield } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/80" />

          {/* Content */}
          <div className="relative px-8 py-16 lg:px-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  Turn Your Car into a
                  <span className="block text-secondary">Money Machine</span>
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-lg">
                  Join thousands of hosts earning extra income by sharing their cars. Average hosts earn up to ₾1,500/month.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="shadow-lg text-base"
                    asChild
                  >
                    <Link href="/list-your-car">
                      Start Earning Today
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white text-base"
                    asChild
                  >
                    <Link href="/calculator">
                      Calculate Earnings
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Content - Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">₾1,500</div>
                      <div className="text-white/70 text-sm">Avg. monthly earnings</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Car className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">500+</div>
                      <div className="text-white/70 text-sm">Cars listed</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Shield className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">₾50K</div>
                      <div className="text-white/70 text-sm">Insurance coverage</div>
                    </div>
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
