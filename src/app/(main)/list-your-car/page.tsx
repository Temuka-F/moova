'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Car,
  Upload,
  MapPin,
  DollarSign,
  Settings2,
  Check,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Info,
  LogIn,
} from 'lucide-react'
import { GEORGIAN_CITIES, CAR_MAKES, CAR_FEATURES } from '@/types'
import type { CarCategory, Transmission, FuelType } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

const carSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, 'License plate is required'),
  color: z.string().min(1, 'Color is required'),
  transmission: z.enum(['AUTOMATIC', 'MANUAL']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'LPG']),
  seats: z.number().min(2).max(12),
  doors: z.number().min(2).max(6),
  category: z.enum(['ECONOMY', 'COMPACT', 'SEDAN', 'SUV', 'LUXURY', 'SPORTS', 'VAN', 'MINIVAN', 'PICKUP', 'CONVERTIBLE']),
  features: z.array(z.string()),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  pricePerDay: z.number().min(10, 'Minimum price is ₾10'),
  securityDeposit: z.number().min(0),
  description: z.string().optional(),
  isInstantBook: z.boolean(),
  mileageLimit: z.number().optional(),
  currentMileage: z.number().min(0),
})

type CarFormData = z.infer<typeof carSchema>

const steps = [
  { id: 1, name: 'Basic Info', icon: Car },
  { id: 2, name: 'Location', icon: MapPin },
  { id: 3, name: 'Pricing', icon: DollarSign },
  { id: 4, name: 'Features', icon: Settings2 },
]

export default function ListYourCarPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      seats: 5,
      doors: 4,
      category: 'SEDAN',
      features: [],
      securityDeposit: 200,
      isInstantBook: false,
      currentMileage: 0,
    },
  })

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 pb-8 md:pb-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6 md:mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Auth gate - show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 pb-8 md:pb-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Car className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">List Your Car</h1>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Sign in to start earning money by sharing your car with verified renters in Georgia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="rounded-full min-h-[44px]">
                  <Link href="/login?redirect=/list-your-car">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In to Continue
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full min-h-[44px]">
                  <Link href="/register?redirect=/list-your-car">
                    Create Account
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                New to Moova?{' '}
                <Link href="/register" className="text-primary hover:underline">
                  Sign up for free
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const nextStep = async () => {
    // Validate current step fields
    const fieldsToValidate: (keyof CarFormData)[] = {
      1: ['make', 'model', 'year', 'licensePlate', 'color', 'transmission', 'fuelType', 'seats', 'doors', 'category'],
      2: ['city', 'address'],
      3: ['pricePerDay', 'securityDeposit', 'currentMileage'],
      4: ['features', 'description', 'isInstantBook'],
    }[currentStep] as (keyof CarFormData)[]

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) => {
      const updated = prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
      setValue('features', updated)
      return updated
    })
  }

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true)

    try {
      // First upgrade user to OWNER if needed
      if (user?.role === 'RENTER') {
        await fetch('/api/users/me/upgrade', { method: 'POST' })
      }

      // Create car
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          latitude: 41.7151, // Default to Tbilisi, will be updated with geocoding
          longitude: 44.8271,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create car')
      }

      const car = await response.json()
      toast.success('Car listed successfully! It will be reviewed by our team.')
      router.push(`/dashboard/cars`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to list car')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-8 md:pb-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">List Your Car</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Start earning by sharing your car with verified renters
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-1.5 md:gap-2 ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      currentStep > step.id
                        ? 'bg-primary border-primary text-primary-foreground'
                        : currentStep === step.id
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </div>
                  <span className="hidden md:block font-medium text-sm">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-6 sm:w-12 md:w-24 h-0.5 mx-1 md:mx-2 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Tell us about your car
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Select
                      onValueChange={(v) => setValue('make', v)}
                      defaultValue={watch('make')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAR_MAKES.map((make) => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.make && (
                      <p className="text-sm text-destructive">{errors.make.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., X5, Camry"
                      {...register('model')}
                    />
                    {errors.model && (
                      <p className="text-sm text-destructive">{errors.model.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2020"
                      {...register('year', { valueAsNumber: true })}
                    />
                    {errors.year && (
                      <p className="text-sm text-destructive">{errors.year.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      placeholder="e.g., Black, White"
                      {...register('color')}
                    />
                    {errors.color && (
                      <p className="text-sm text-destructive">{errors.color.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input
                      id="licensePlate"
                      placeholder="AA-123-BB"
                      {...register('licensePlate')}
                    />
                    {errors.licensePlate && (
                      <p className="text-sm text-destructive">{errors.licensePlate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(v) => setValue('category', v as CarCategory)}
                      defaultValue={watch('category')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ECONOMY">Economy</SelectItem>
                        <SelectItem value="COMPACT">Compact</SelectItem>
                        <SelectItem value="SEDAN">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="LUXURY">Luxury</SelectItem>
                        <SelectItem value="SPORTS">Sports</SelectItem>
                        <SelectItem value="VAN">Van</SelectItem>
                        <SelectItem value="MINIVAN">Minivan</SelectItem>
                        <SelectItem value="PICKUP">Pickup</SelectItem>
                        <SelectItem value="CONVERTIBLE">Convertible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      onValueChange={(v) => setValue('transmission', v as Transmission)}
                      defaultValue={watch('transmission')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                        <SelectItem value="MANUAL">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      onValueChange={(v) => setValue('fuelType', v as FuelType)}
                      defaultValue={watch('fuelType')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PETROL">Petrol</SelectItem>
                        <SelectItem value="DIESEL">Diesel</SelectItem>
                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                        <SelectItem value="ELECTRIC">Electric</SelectItem>
                        <SelectItem value="LPG">LPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seats">Seats</Label>
                    <Input
                      id="seats"
                      type="number"
                      {...register('seats', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doors">Doors</Label>
                    <Input
                      id="doors"
                      type="number"
                      {...register('doors', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Where is your car located?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select
                      onValueChange={(v) => setValue('city', v)}
                      defaultValue={watch('city')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {GEORGIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address where the car is parked"
                      {...register('address')}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Your exact address will only be shared with confirmed renters.
                    Other users will see the approximate area.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                  Set your daily rate and other pricing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Price per Day (₾)</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      placeholder="100"
                      {...register('pricePerDay', { valueAsNumber: true })}
                    />
                    {errors.pricePerDay && (
                      <p className="text-sm text-destructive">{errors.pricePerDay.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">Security Deposit (₾)</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      placeholder="200"
                      {...register('securityDeposit', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentMileage">Current Mileage (km)</Label>
                    <Input
                      id="currentMileage"
                      type="number"
                      placeholder="50000"
                      {...register('currentMileage', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mileageLimit">Daily Mileage Limit (km)</Label>
                    <Input
                      id="mileageLimit"
                      type="number"
                      placeholder="Unlimited"
                      {...register('mileageLimit', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">Leave empty for unlimited</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="instantBook" className="font-medium">
                      Enable Instant Book
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allow renters to book immediately without your approval
                    </p>
                  </div>
                  <Switch
                    id="instantBook"
                    checked={watch('isInstantBook')}
                    onCheckedChange={(v) => setValue('isInstantBook', v)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Features */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Features & Description</CardTitle>
                <CardDescription>
                  Highlight what makes your car special
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Select Features</Label>
                  <div className="flex flex-wrap gap-2">
                    {CAR_FEATURES.map((feature) => (
                      <Badge
                        key={feature}
                        variant={selectedFeatures.includes(feature) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                        onClick={() => toggleFeature(feature)}
                      >
                        {selectedFeatures.includes(feature) && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Tell potential renters about your car. What makes it special? Any rules or tips?"
                    {...register('description')}
                  />
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium mb-2">📷 Add Photos</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cars with photos get 3x more bookings. You'll be able to add photos after creating the listing.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    List My Car
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
