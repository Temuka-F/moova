import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Car, 
  Globe, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="bg-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Revolutionizing car sharing<br />in Georgia
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Moova connects car owners with travelers, making car rental personal, 
            affordable, and seamless for everyone.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">15+</p>
              <p className="text-muted-foreground">Cars Listed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">50+</p>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">4.9</p>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">10+</p>
              <p className="text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We believe in a world where car ownership is optional, not necessary. 
              Moova makes it easy to share your car when you're not using it, 
              and find the perfect car when you need one.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 bg-muted/50 rounded-2xl">
                <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Accessible</h3>
                <p className="text-sm text-muted-foreground">
                  Cars available in every major city across Georgia
                </p>
              </div>
              <div className="p-6 bg-muted/50 rounded-2xl">
                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Every trip is insured and all users are verified
                </p>
              </div>
              <div className="p-6 bg-muted/50 rounded-2xl">
                <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Trusted</h3>
                <p className="text-sm text-muted-foreground">
                  Built on reviews and community trust
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works for both */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">For Renters</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Browse hundreds of cars from local hosts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Book instantly or send a request</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Pick up the car directly from the host</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>24/7 support and roadside assistance</span>
                </li>
              </ul>
              <Button asChild className="mt-6 rounded-full">
                <Link href="/cars">
                  Browse Cars <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white">
                  <Car className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">For Hosts</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>List your car for free in minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Set your own prices and availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Your car is insured during every trip</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Get paid directly to your bank account</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="mt-6 rounded-full">
                <Link href="/list-your-car">
                  List Your Car <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of users who trust Moova for their car sharing needs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="rounded-full px-8">
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8">
              <Link href="/cars">Browse Cars</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
