'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft, Save } from 'lucide-react'

type ApiCar = {
  id: string
  make: string
  model: string
  year: number
  color: string
  address: string
  pricePerDay: number
  securityDeposit: number
  isInstantBook: boolean
  mileageLimit: number | null
  extraMileageFee: number | null
  currentMileage: number
  features: string[]
}

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [car, setCar] = useState<ApiCar | null>(null)

  const [form, setForm] = useState({
    color: '',
    address: '',
    pricePerDay: 0,
    securityDeposit: 0,
    isInstantBook: false,
    mileageLimit: '' as string,
    extraMileageFee: '' as string,
    currentMileage: 0,
    featuresText: '',
  })

  const parsedFeatures = useMemo(() => {
    return form.featuresText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [form.featuresText])

  useEffect(() => {
    async function fetchCar() {
      setLoading(true)
      try {
        const res = await fetch(`/api/cars/${carId}`)
        if (!res.ok) {
          if (res.status === 401) {
            router.push(`/login?redirect=/dashboard/cars/${carId}/edit`)
            return
          }
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load car')
        }
        const data: ApiCar = await res.json()
        setCar(data)
        setForm({
          color: data.color || '',
          address: data.address || '',
          pricePerDay: data.pricePerDay || 0,
          securityDeposit: data.securityDeposit || 0,
          isInstantBook: !!data.isInstantBook,
          mileageLimit: data.mileageLimit != null ? String(data.mileageLimit) : '',
          extraMileageFee: data.extraMileageFee != null ? String(data.extraMileageFee) : '',
          currentMileage: data.currentMileage || 0,
          featuresText: (data.features || []).join(', '),
        })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load car'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    if (carId) fetchCar()
  }, [carId, router])

  const handleSave = async () => {
    if (!car) return

    if (!form.color.trim()) {
      toast.error('Color is required')
      return
    }
    if (!form.address.trim()) {
      toast.error('Address is required')
      return
    }
    if (!Number.isFinite(form.pricePerDay) || form.pricePerDay <= 0) {
      toast.error('Price per day must be greater than 0')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/cars/${car.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          color: form.color.trim(),
          address: form.address.trim(),
          pricePerDay: form.pricePerDay,
          securityDeposit: form.securityDeposit,
          isInstantBook: form.isInstantBook,
          currentMileage: form.currentMileage,
          mileageLimit: form.mileageLimit ? Number(form.mileageLimit) : null,
          extraMileageFee: form.extraMileageFee ? Number(form.extraMileageFee) : null,
          features: parsedFeatures,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update car')
      }

      toast.success('Car updated!')
      router.push('/dashboard/cars')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update car'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!car) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Car not found or you don&apos;t have access.</p>
          <Button asChild>
            <Link href="/dashboard/cars">Back to My Cars</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/cars">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Car</h1>
          <p className="text-muted-foreground">
            {car.make} {car.model} ({car.year})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listing details</CardTitle>
          <CardDescription>Update your car details. Changes apply immediately.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={form.color}
                onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per day (₾)</Label>
              <Input
                id="pricePerDay"
                type="number"
                value={form.pricePerDay}
                onChange={(e) => setForm((p) => ({ ...p, pricePerDay: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security deposit (₾)</Label>
              <Input
                id="securityDeposit"
                type="number"
                value={form.securityDeposit}
                onChange={(e) => setForm((p) => ({ ...p, securityDeposit: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMileage">Current mileage (km)</Label>
              <Input
                id="currentMileage"
                type="number"
                value={form.currentMileage}
                onChange={(e) => setForm((p) => ({ ...p, currentMileage: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileageLimit">Daily mileage limit (km) (optional)</Label>
              <Input
                id="mileageLimit"
                type="number"
                value={form.mileageLimit}
                onChange={(e) => setForm((p) => ({ ...p, mileageLimit: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="extraMileageFee">Extra mileage fee (₾/km) (optional)</Label>
              <Input
                id="extraMileageFee"
                type="number"
                value={form.extraMileageFee}
                onChange={(e) => setForm((p) => ({ ...p, extraMileageFee: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
            <div>
              <p className="font-medium">Instant Book</p>
              <p className="text-sm text-muted-foreground">Allow renters to book without approval.</p>
            </div>
            <Switch
              checked={form.isInstantBook}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isInstantBook: v }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea
              id="features"
              rows={3}
              value={form.featuresText}
              onChange={(e) => setForm((p) => ({ ...p, featuresText: e.target.value }))}
              placeholder="e.g., GPS, Bluetooth, Child Seat"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" asChild>
              <Link href="/dashboard/cars">Cancel</Link>
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
