'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Search,
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Car,
  MapPin,
  Calendar,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { formatPrice } from '@/lib/flitt'
// Demo cars data
const demoCars = [
  { id: '1', make: 'BMW', model: 'X5', year: 2022, licensePlate: 'AA-123-BB', pricePerDay: 180, city: 'Tbilisi', status: 'PENDING', createdAt: new Date().toISOString(), owner: { firstName: 'Giorgi', lastName: 'Beridze', email: 'giorgi@example.com', avatarUrl: null }, images: [{ url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' }] },
  { id: '2', make: 'Mercedes', model: 'E-Class', year: 2023, licensePlate: 'BB-456-CC', pricePerDay: 200, city: 'Tbilisi', status: 'APPROVED', createdAt: new Date().toISOString(), owner: { firstName: 'Nino', lastName: 'Kvlividze', email: 'nino@example.com', avatarUrl: null }, images: [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400' }] },
  { id: '3', make: 'Toyota', model: 'Camry', year: 2021, licensePlate: 'CC-789-DD', pricePerDay: 120, city: 'Batumi', status: 'APPROVED', createdAt: new Date().toISOString(), owner: { firstName: 'Levan', lastName: 'Tskhadadze', email: 'levan@example.com', avatarUrl: null }, images: [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' }] },
  { id: '4', make: 'Hyundai', model: 'Tucson', year: 2022, licensePlate: 'DD-012-EE', pricePerDay: 100, city: 'Kutaisi', status: 'PENDING', createdAt: new Date().toISOString(), owner: { firstName: 'Ana', lastName: 'Samkharadze', email: 'ana@example.com', avatarUrl: null }, images: [{ url: 'https://images.unsplash.com/photo-1633695610681-8477dcfd5c33?w=400' }] },
  { id: '5', make: 'Tesla', model: 'Model 3', year: 2023, licensePlate: 'EE-345-FF', pricePerDay: 180, city: 'Tbilisi', status: 'APPROVED', createdAt: new Date().toISOString(), owner: { firstName: 'David', lastName: 'Mikadze', email: 'david@example.com', avatarUrl: null }, images: [{ url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400' }] },
]

function AdminCarsContent() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get('status') || ''
  
  const [cars, setCars] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<string>(initialStatus)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [selectedCar, setSelectedCar] = useState<any>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCars = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (search) params.set('search', search)
      params.set('page', page.toString())
      params.set('limit', '20')

      const response = await fetch(`/api/admin/cars?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setCars(data.cars)
        setTotalPages(data.totalPages)
      } else {
        // Use demo data
        let filtered = demoCars
        if (status) filtered = filtered.filter(c => c.status === status)
        if (search) filtered = filtered.filter(c => 
          c.make.toLowerCase().includes(search.toLowerCase()) || 
          c.model.toLowerCase().includes(search.toLowerCase())
        )
        setCars(filtered)
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
      // Use demo data on error
      setCars(demoCars)
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [status, search, page])

  const handleAction = async () => {
    if (!selectedCar || !actionType) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/cars/${selectedCar.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
          reason,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update car')
      }

      toast.success(`Car ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`)
      setSelectedCar(null)
      setActionType(null)
      setReason('')
      fetchCars()
    } catch (error) {
      toast.error('Failed to update car status')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Car Management</h1>
        <p className="text-muted-foreground">
          Review and manage car listings
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, or plate..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="p-12 text-center">
              <Car className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No cars found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Car</th>
                    <th className="text-left py-3 px-4 font-medium">Owner</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Listed</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-16 h-12 rounded-lg bg-cover bg-center shrink-0"
                            style={{
                              backgroundImage: `url('${car.images[0]?.url || '/placeholder-car.jpg'}')`,
                            }}
                          />
                          <div>
                            <p className="font-medium">
                              {car.make} {car.model}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {car.year} • {car.licensePlate}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={car.owner.avatarUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {car.owner.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {car.owner.firstName} {car.owner.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {car.owner.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {car.city}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {formatPrice(car.pricePerDay)}/day
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            car.status === 'APPROVED'
                              ? 'default'
                              : car.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {car.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {format(new Date(car.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/cars/${car.id}`, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {car.status === 'PENDING' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => {
                                  setSelectedCar(car)
                                  setActionType('approve')
                                }}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedCar(car)
                                  setActionType('reject')
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={!!selectedCar && !!actionType} onOpenChange={() => {
        setSelectedCar(null)
        setActionType(null)
        setReason('')
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Car Listing
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'This car will be visible to renters after approval.'
                : 'The owner will be notified about the rejection.'}
            </DialogDescription>
          </DialogHeader>

          {selectedCar && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div
                className="w-20 h-14 rounded-lg bg-cover bg-center shrink-0"
                style={{
                  backgroundImage: `url('${selectedCar.images[0]?.url || '/placeholder-car.jpg'}')`,
                }}
              />
              <div>
                <p className="font-medium">
                  {selectedCar.make} {selectedCar.model} {selectedCar.year}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedCar.licensePlate} • {selectedCar.city}
                </p>
              </div>
            </div>
          )}

          {actionType === 'reject' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                placeholder="Explain why this listing is being rejected..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCar(null)
                setActionType(null)
                setReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={handleAction}
              disabled={isSubmitting || (actionType === 'reject' && !reason)}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : actionType === 'approve' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminCarsPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-96 w-full" /></div>}>
      <AdminCarsContent />
    </Suspense>
  )
}
