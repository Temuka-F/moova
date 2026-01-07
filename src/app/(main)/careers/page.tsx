import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Briefcase, 
  Clock,
  Heart,
  Zap,
  Users,
  ArrowRight
} from 'lucide-react'

const openPositions = [
  {
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Tbilisi',
    type: 'Full-time',
    description: 'Build and scale our platform with React, Node.js, and PostgreSQL.'
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Tbilisi / Remote',
    type: 'Full-time',
    description: 'Create beautiful, intuitive experiences for our web and mobile apps.'
  },
  {
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Tbilisi',
    type: 'Full-time',
    description: 'Help our hosts and renters get the most out of Moova.'
  },
  {
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Tbilisi',
    type: 'Full-time',
    description: 'Drive growth through creative campaigns and partnerships.'
  },
]

const benefits = [
  { icon: Heart, title: 'Health Coverage', description: 'Full health insurance for you and your family' },
  { icon: Clock, title: 'Flexible Hours', description: 'Work when you\'re most productive' },
  { icon: Zap, title: 'Free Rides', description: 'Moova credits every month for personal use' },
  { icon: Users, title: 'Great Team', description: 'Work with passionate, talented people' },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="bg-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-primary/20 text-primary border-0 mb-4">We're hiring!</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join the Moova team
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Help us build the future of car sharing in Georgia. 
            We're looking for passionate people to join our mission.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why work with us?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Don't see a perfect fit? Send us your resume anyway – we're always looking for talented people.
          </p>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {openPositions.map((job) => (
              <Card key={job.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{job.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                    </div>
                    <Button asChild className="rounded-full shrink-0">
                      <Link href={`/careers/${job.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        Apply
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see a role that fits?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind.
          </p>
          <Button size="lg" asChild className="rounded-full px-8">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
