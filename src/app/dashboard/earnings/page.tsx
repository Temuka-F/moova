'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'

interface EarningsStats {
  totalEarnings: number
  pendingPayouts: number
  completedPayouts: number
  thisMonth: number
  lastMonth: number
}

interface Payout {
  id: string
  amount: number
  status: string
  createdAt: string
  completedAt: string | null
}

export default function EarningsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<EarningsStats | null>(null)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEarnings() {
      try {
        // Fetch bookings to calculate earnings
        const bookingsRes = await fetch('/api/bookings?type=host')
        if (!bookingsRes.ok) {
          if (bookingsRes.status === 401 || bookingsRes.status === 403) {
            router.push('/login?redirect=/dashboard/earnings')
            return
          }
          throw new Error('Failed to fetch earnings')
        }
        const bookingsData = await bookingsRes.json()
        const bookings = bookingsData.bookings || []

        // Calculate stats
        const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED')
        const totalEarnings = completedBookings.reduce((sum: number, b: any) => sum + (b.subtotal || 0), 0)
        
        const now = new Date()
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const thisMonthBookings = completedBookings.filter((b: any) => 
          new Date(b.endDate) >= thisMonthStart
        )
        const thisMonth = thisMonthBookings.reduce((sum: number, b: any) => sum + (b.subtotal || 0), 0)

        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
        const lastMonthBookings = completedBookings.filter((b: any) => {
          const endDate = new Date(b.endDate)
          return endDate >= lastMonthStart && endDate <= lastMonthEnd
        })
        const lastMonth = lastMonthBookings.reduce((sum: number, b: any) => sum + (b.subtotal || 0), 0)

        setStats({
          totalEarnings,
          pendingPayouts: 0, // TODO: Calculate from payouts
          completedPayouts: totalEarnings, // TODO: Calculate from payouts
          thisMonth,
          lastMonth,
        })

        // TODO: Fetch payouts from API when available
        setPayouts([])
      } catch (err) {
        console.error('Error fetching earnings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [router])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track your income and payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₾{stats?.totalEarnings.toLocaleString() || 0}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₾{stats?.pendingPayouts.toLocaleString() || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₾{stats?.completedPayouts.toLocaleString() || 0}</p>
                <p className="text-sm text-muted-foreground">Paid Out</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>Compare your earnings month over month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold">₾{stats?.thisMonth.toLocaleString() || 0}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Last Month</p>
              <p className="text-2xl font-bold">₾{stats?.lastMonth.toLocaleString() || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>View your payout transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length > 0 ? (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">₾{payout.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(payout.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    {payout.status === 'COMPLETED' ? (
                      <Badge className="bg-green-500/10 text-green-600 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />Completed
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No payouts yet</h3>
              <p className="text-muted-foreground">
                Your completed bookings will generate payouts here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
