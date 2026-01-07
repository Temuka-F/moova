'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Shield, 
  Lock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Car
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  avatarUrl: string | null
  bio: string | null
  role: 'RENTER' | 'OWNER' | 'ADMIN'
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isIdVerified: boolean
  isLicenseVerified: boolean
  verificationStatus: string
  drivingLicenseNo: string | null
  drivingLicenseUrl: string | null
  idDocumentUrl: string | null
}

function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    bookingUpdates: true,
    marketing: false,
  })

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me')
        
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login?redirect=/dashboard/settings')
            return
          }
          throw new Error('Failed to fetch user')
        }
        
        const data = await res.json()
        setUser(data)
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          bio: data.bio || '',
        })
      } catch (err) {
        console.error('Error fetching user:', err)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleSave = async () => {
    if (!user) return
    
    setIsSaving(true)
    
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      const updatedUser = await res.json()
      setUser(updatedUser)
      toast.success('Settings saved successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpgradeToOwner = async () => {
    if (!user) return
    
    setIsUpgrading(true)
    
    try {
      const res = await fetch(`/api/users/${user.id}/upgrade`, {
        method: 'POST',
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upgrade')
      }
      
      const updatedUser = await res.json()
      setUser({ ...user, role: updatedUser.role })
      toast.success('Congratulations! You are now a host. Start listing your first car!')
      router.push('/list-your-car')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upgrade to owner')
    } finally {
      setIsUpgrading(false)
    }
  }

  if (loading) {
    return <SettingsSkeleton />
  }

  if (!user) {
    return null
  }

  const isHost = user.role === 'OWNER' || user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Become a Host Banner - for RENTERS */}
          {!isHost && (
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
              <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg mb-1">Become a Host</h3>
                  <p className="text-sm text-muted-foreground">
                    Start earning by sharing your car. Hosts earn up to ₾1,500/month on Moova!
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="rounded-full"
                  onClick={handleUpgradeToOwner}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Upgrading...
                    </>
                  ) : (
                    <>
                      Upgrade Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Host Status Banner */}
          {isHost && (
            <Card className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-emerald-500/10 border-green-500/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">You're a Host!</h3>
                    <Badge className="bg-green-500/10 text-green-600 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can list cars and earn money on Moova
                  </p>
                </div>
                <Button variant="outline" className="rounded-full" asChild>
                  <a href="/list-your-car">List a Car</a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email}
                    disabled
                    className="rounded-xl bg-muted" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+995 555 123 456"
                    className="rounded-xl" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us a bit about yourself..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification
              </CardTitle>
              <CardDescription>Verify your identity to unlock all features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.isEmailVerified ? 'bg-green-500/10' : 'bg-yellow-500/10'
                  }`}>
                    <Mail className={`w-5 h-5 ${user.isEmailVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {user.isEmailVerified ? (
                  <Badge className="bg-green-500/10 text-green-600 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full">
                    Verify
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.isPhoneVerified ? 'bg-green-500/10' : 'bg-yellow-500/10'
                  }`}>
                    <Phone className={`w-5 h-5 ${user.isPhoneVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                {user.isPhoneVerified ? (
                  <Badge className="bg-green-500/10 text-green-600 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full" disabled={!user.phone}>
                    Verify
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.isLicenseVerified ? 'bg-green-500/10' : 'bg-yellow-500/10'
                  }`}>
                    <Shield className={`w-5 h-5 ${user.isLicenseVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                  </div>
                  <div>
                    <p className="font-medium">Driver's License</p>
                    <p className="text-sm text-muted-foreground">
                      {user.drivingLicenseUrl ? 'Document uploaded' : 'Upload your license for verification'}
                    </p>
                  </div>
                </div>
                {user.isLicenseVerified ? (
                  <Badge className="bg-green-500/10 text-green-600 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : user.verificationStatus === 'PENDING' ? (
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-0">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how we contact you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(v) => setNotifications({ ...notifications, email: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about booking changes</p>
                </div>
                <Switch 
                  checked={notifications.bookingUpdates}
                  onCheckedChange={(v) => setNotifications({ ...notifications, bookingUpdates: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Receive tips, promotions, and news</p>
                </div>
                <Switch 
                  checked={notifications.marketing}
                  onCheckedChange={(v) => setNotifications({ ...notifications, marketing: v })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>Keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your password regularly</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  Change
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" className="rounded-full" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
