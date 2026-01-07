'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Car,
  Star,
  MapPin
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: 'RENTER' | 'OWNER' | 'ADMIN'
  verificationStatus: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isIdVerified: boolean
  isLicenseVerified: boolean
  bio: string | null
  createdAt: string
  _count?: {
    cars: number
    bookingsAsRenter: number
    reviewsReceived: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard/profile')
            return
          }
          throw new Error('Failed to fetch profile')
        }
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const getVerificationBadge = () => {
    if (!user) return null

    switch (user.verificationStatus) {
      case 'VERIFIED':
        return <Badge className="bg-green-500/10 text-green-600 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Unverified</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                {getVerificationBadge()}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {user.role === 'ADMIN' ? 'Admin' : user.role === 'OWNER' ? 'Host' : 'Renter'}
                  </Badge>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                </div>
              </div>
              {user.bio && (
                <p className="mt-4 text-muted-foreground">{user.bio}</p>
              )}
              <div className="mt-4">
                <Button asChild variant="outline">
                  <Link href="/dashboard/settings">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {user.role === 'OWNER' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user._count?.cars || 0}</p>
                  <p className="text-sm text-muted-foreground">Cars Listed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user._count?.bookingsAsRenter || 0}</p>
                <p className="text-sm text-muted-foreground">Total Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user._count?.reviewsReceived || 0}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification Status
          </CardTitle>
          <CardDescription>Your account verification details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {user.isEmailVerified ? (
              <Badge className="bg-green-500/10 text-green-600 border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />Verified
              </Badge>
            ) : (
              <Badge variant="outline">Unverified</Badge>
            )}
          </div>
          {user.phone && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
              {user.isPhoneVerified ? (
                <Badge className="bg-green-500/10 text-green-600 border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />Verified
                </Badge>
              ) : (
                <Badge variant="outline">Unverified</Badge>
              )}
            </div>
          )}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">ID Document</p>
                <p className="text-sm text-muted-foreground">Identity verification</p>
              </div>
            </div>
            {user.isIdVerified ? (
              <Badge className="bg-green-500/10 text-green-600 border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />Verified
              </Badge>
            ) : (
              <Badge variant="outline">Unverified</Badge>
            )}
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Driving License</p>
                <p className="text-sm text-muted-foreground">License verification</p>
              </div>
            </div>
            {user.isLicenseVerified ? (
              <Badge className="bg-green-500/10 text-green-600 border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />Verified
              </Badge>
            ) : (
              <Badge variant="outline">Unverified</Badge>
            )}
          </div>
          {user.verificationStatus === 'UNVERIFIED' && (
            <Button asChild className="w-full">
              <Link href="/dashboard/settings">Complete Verification</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
