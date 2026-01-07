'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Car, DollarSign, Calendar } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 bg-secondary text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Become a Host */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Earn money with your car
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Turn your car into a <span className="text-primary">money machine</span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-lg">
              Join thousands of car owners who earn extra income by sharing their vehicles on Moova.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">₾800+</p>
                <p className="text-sm text-white/60">Avg. monthly earnings</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">Flexible</p>
                <p className="text-sm text-white/60">Set your own schedule</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">Free</p>
                <p className="text-sm text-white/60">To list your car</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold"
              asChild
            >
              <Link href="/list-your-car">
                List your car
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Right - Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1000&auto=format&fit=crop"
                alt="Car owner"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-foreground rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">₾2,400</p>
                  <p className="text-muted-foreground">Earned last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
