'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface DebugData {
  timestamp: string
  checks: {
    bookings?: {
      count: number
      data: Array<{
        id: string
        carId: string
        car: string
        renterId: string
        renter: string
        status: string
        linked: boolean
      }>
    }
    cars?: {
      count: number
      data: Array<{
        id: string
        make: string
        model: string
        ownerId: string
        owner: string
        bookingsCount: number
      }>
    }
    users?: {
      count: number
      data: Array<{
        id: string
        email: string
        name: string
        role: string
        carsCount: number
        bookingsCount: number
      }>
    }
  }
}

export default function DebugPage() {
  const [data, setData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchDebugData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/debug?check=all')
      if (!res.ok) throw new Error('Failed to fetch debug data')
      const debugData = await res.json()
      setData(debugData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(fetchDebugData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [autoRefresh])

  if (loading && !data) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading debug data...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Debug Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time database state monitoring
            {data && (
              <span className="ml-2 text-xs">
                (Last updated: {new Date(data.timestamp).toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button onClick={fetchDebugData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="grid gap-6">
          {/* Bookings */}
          {data.checks.bookings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bookings ({data.checks.bookings.count})</span>
                  <Badge variant={data.checks.bookings.data.every(b => b.linked) ? 'default' : 'destructive'}>
                    {data.checks.bookings.data.every(b => b.linked) ? 'All Linked' : 'Issues Found'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.checks.bookings.data.map((booking) => (
                    <div
                      key={booking.id}
                      className={`p-3 rounded-lg border ${
                        booking.linked ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold">{booking.id}</div>
                          <div className="text-sm text-muted-foreground">
                            Car: {booking.car} ({booking.carId})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Renter: {booking.renter} ({booking.renterId})
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {booking.status}
                          </Badge>
                        </div>
                        <div>
                          {booking.linked ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cars */}
          {data.checks.cars && (
            <Card>
              <CardHeader>
                <CardTitle>Cars ({data.checks.cars.count})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.checks.cars.data.map((car) => (
                    <div key={car.id} className="p-3 rounded-lg border">
                      <div className="font-semibold">
                        {car.make} {car.model} ({car.id})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Owner: {car.owner} ({car.ownerId})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bookings: {car.bookingsCount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users */}
          {data.checks.users && (
            <Card>
              <CardHeader>
                <CardTitle>Users ({data.checks.users.count})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.checks.users.data.map((user) => (
                    <div key={user.id} className="p-3 rounded-lg border">
                      <div className="font-semibold">
                        {user.name} ({user.email})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Role: {user.role} | Cars: {user.carsCount} | Bookings: {user.bookingsCount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
