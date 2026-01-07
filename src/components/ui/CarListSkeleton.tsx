'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface CarCardSkeletonProps {
  variant?: 'default' | 'compact' | 'horizontal' | 'sidebar'
}

export function CarCardSkeleton({ variant = 'default' }: CarCardSkeletonProps) {
  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 bg-white rounded-2xl p-3 border border-gray-100">
        <Skeleton className="w-32 h-24 md:w-40 md:h-28 rounded-xl shrink-0" />
        <div className="flex-1 py-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-16 mb-3" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <div className="text-right shrink-0">
          <Skeleton className="h-6 w-16 mb-1" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <Skeleton className="h-36 w-full" />
        <div className="p-3">
          <Skeleton className="h-5 w-28 mb-1.5" />
          <Skeleton className="h-4 w-20 mb-2" />
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-2.5">
          <Skeleton className="h-4 w-24 mb-1" />
          <div className="flex items-center justify-between mt-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    )
  }

  // Default card
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-6 w-36 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>
    </div>
  )
}

interface CarListSkeletonProps {
  count?: number
  variant?: 'default' | 'compact' | 'horizontal' | 'sidebar'
  className?: string
}

export function CarListSkeleton({ 
  count = 6, 
  variant = 'default',
  className = ''
}: CarListSkeletonProps) {
  if (variant === 'horizontal') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <CarCardSkeleton key={i} variant="horizontal" />
        ))}
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <CarCardSkeleton key={i} variant="sidebar" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  )
}

// Drawer skeleton for mobile
export function DrawerSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter chips skeleton */}
      <div className="flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
        ))}
      </div>
      
      {/* Car count */}
      <Skeleton className="h-4 w-32" />
      
      {/* Car cards */}
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <CarCardSkeleton key={i} variant="horizontal" />
        ))}
      </div>
    </div>
  )
}

// Top rated carousel skeleton
export function CarouselSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden pb-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden border border-gray-100">
          <Skeleton className="h-36 w-full" />
          <div className="p-3">
            <Skeleton className="h-5 w-28 mb-2" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
