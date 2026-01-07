'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'
import { Loader2, User, Car, Check } from 'lucide-react'
import { getErrorMessage } from '@/lib/error-utils'
import { cn } from '@/lib/utils'

interface ProfileSwitcherProps {
  currentRole: UserRole
  activeProfileMode: UserRole | null
  onSwitch?: (newMode: UserRole) => void
}

export function ProfileSwitcher({ currentRole, activeProfileMode, onSwitch }: ProfileSwitcherProps) {
  const [loading, setLoading] = useState(false)
  const [currentMode, setCurrentMode] = useState<UserRole>(
    activeProfileMode || (currentRole === 'OWNER' ? 'OWNER' : 'RENTER')
  )

  // Only show switcher for OWNER users
  if (currentRole !== 'OWNER') {
    return null
  }

  // Update local state when prop changes
  useEffect(() => {
    setCurrentMode(activeProfileMode || 'OWNER')
  }, [activeProfileMode])

  const handleSwitch = async (newMode: UserRole) => {
    if (newMode === currentMode || loading) return

    setLoading(true)
    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeProfileMode: newMode }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to switch profile mode')
      }

      const updatedUser = await response.json()
      setCurrentMode(newMode)
      toast.success(`Switched to ${newMode === 'OWNER' ? 'Owner' : 'Renter'} profile`)
      
      // Call onSwitch callback to update parent state
      if (onSwitch) {
        onSwitch(newMode)
      }
    } catch (error) {
      console.error('Error switching profile mode:', error)
      toast.error(getErrorMessage(error, 'Failed to switch profile mode'))
    } finally {
      setLoading(false)
    }
  }

  const isRenterMode = currentMode === 'RENTER'
  const isOwnerMode = currentMode === 'OWNER'

  return (
    <div className="w-full">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Profile Mode</h3>
        <p className="text-xs text-muted-foreground">Switch between renter and owner views</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Renter Mode Card */}
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            isRenterMode && "ring-2 ring-primary shadow-md",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !loading && handleSwitch('RENTER')}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-lg transition-colors",
                isRenterMode ? "bg-primary/10" : "bg-muted"
              )}>
                <User className={cn(
                  "w-6 h-6",
                  isRenterMode ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-base">Renter Mode</h4>
                  {isRenterMode && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Book cars, manage trips, and browse listings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Mode Card */}
        <Card 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            isOwnerMode && "ring-2 ring-primary shadow-md",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !loading && handleSwitch('OWNER')}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-lg transition-colors",
                isOwnerMode ? "bg-primary/10" : "bg-muted"
              )}>
                <Car className={cn(
                  "w-6 h-6",
                  isOwnerMode ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-base">Owner Mode</h4>
                  {isOwnerMode && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage fleet, view earnings, and handle bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {loading && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Switching profile...</span>
        </div>
      )}
    </div>
  )
}
