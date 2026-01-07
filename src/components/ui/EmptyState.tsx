'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Car, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Search,
  Plus,
  MapPin
} from 'lucide-react'

interface EmptyStateProps {
  icon?: 'car' | 'calendar' | 'heart' | 'message' | 'search' | 'location'
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  children?: ReactNode
}

const icons = {
  car: Car,
  calendar: Calendar,
  heart: Heart,
  message: MessageCircle,
  search: Search,
  location: MapPin,
}

export function EmptyState({
  icon = 'car',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  children
}: EmptyStateProps) {
  const Icon = icons[icon]
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      
      {children}
      
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Button asChild className="rounded-full min-h-[44px]">
            <Link href={actionHref}>
              <Plus className="w-4 h-4 mr-2" />
              {actionLabel}
            </Link>
          </Button>
        ) : (
          <Button onClick={onAction} className="rounded-full min-h-[44px]">
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  )
}
