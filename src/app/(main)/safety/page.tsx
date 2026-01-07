import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Shield, 
  CheckCircle2, 
  Car, 
  Phone, 
  FileCheck,
  Users,
  Lock,
  AlertTriangle
} from 'lucide-react'

export default function SafetyPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="bg-secondary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your safety is our priority
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Every trip on Moova is protected with comprehensive insurance, 
            verified users, and 24/7 support.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Users</h3>
                <p className="text-muted-foreground">
                  All hosts and renters are verified with ID documents and driver's licenses before they can use Moova.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Insurance Included</h3>
                <p className="text-muted-foreground">
                  Every trip comes with comprehensive liability and collision coverage to protect both parties.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Our support team is available around the clock for emergencies, questions, or roadside assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How we protect you */}
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How we protect you</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Document Verification</h3>
                <p className="text-muted-foreground">
                  We verify every user's identity, driver's license, and driving history before they can book or list a car. This ensures everyone on the platform is who they say they are.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Vehicle Standards</h3>
                <p className="text-muted-foreground">
                  All cars listed on Moova must meet our safety standards. We check registration, insurance, and maintenance records to ensure every vehicle is safe to drive.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  All payments are processed securely through our platform. We hold funds until the trip is complete, protecting both renters and hosts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Community Reviews</h3>
                <p className="text-muted-foreground">
                  After every trip, both the renter and host leave reviews. This creates accountability and helps you make informed decisions about who you rent from or to.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Emergency Support</h3>
                <p className="text-muted-foreground">
                  In case of an accident or emergency, our team is available 24/7. We provide roadside assistance and help coordinate with insurance and local authorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Have questions about safety?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Our team is here to help. Reach out anytime with questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="rounded-full px-8">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8">
              <Link href="/help">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
