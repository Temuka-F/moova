'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ProfileSwitcherProps {
  currentRole: UserRole
  activeProfileMode: UserRole | null
  onSwitch?: () => void
}

export function ProfileSwitcher({ currentRole, activeProfileMode, onSwitch }: ProfileSwitcherProps) {
  const [loading, setLoading] = useState(false)
  const [isOwnerMode, setIsOwnerMode] = useState(activeProfileMode === 'OWNER' || (currentRole === 'OWNER' && !activeProfileMode))

  // Only show switcher for OWNER users
  if (currentRole !== 'OWNER') {
    return null
  }

  const handleSwitch = async (checked: boolean) => {
    setLoading(true)
    try {
      const newMode = checked ? 'OWNER' : 'RENTER'
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeProfileMode: newMode }),
      })

      if (!response.ok) {
        throw new Error('Failed to switch profile mode')
      }

      setIsOwnerMode(checked)
      toast.success(`Switched to ${checked ? 'Owner' : 'Renter'} profile`)
      
      // Refresh the page to update navigation and dashboard
      if (onSwitch) {
        onSwitch()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error switching profile mode:', error)
      toast.error('Failed to switch profile mode')
      setIsOwnerMode(!checked) // Revert on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2 flex-1">
        <Label htmlFor="profile-switch" className="text-sm font-medium cursor-pointer">
          Renter Mode
        </Label>
        <Switch
          id="profile-switch"
          checked={isOwnerMode}
          onCheckedChange={handleSwitch}
          disabled={loading}
        />
        <Label htmlFor="profile-switch" className="text-sm font-medium cursor-pointer">
          Owner Mode
        </Label>
      </div>
      {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  )
}
