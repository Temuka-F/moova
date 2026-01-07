'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { Car } from 'lucide-react'
import { cn } from '@/lib/utils'

// Default placeholder car image
const PLACEHOLDER_IMAGE = '/car-placeholder.svg'

interface CarImageProps extends Omit<ImageProps, 'onError'> {
  fallbackClassName?: string
}

export function CarImage({ 
  src, 
  alt, 
  className, 
  fallbackClassName,
  ...props 
}: CarImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // If no src or error, show placeholder
  if (!src || hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200",
          fallbackClassName || className
        )}
      >
        <Car className="w-12 h-12 text-gray-300" />
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse",
            className
          )}
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          className,
          isLoading ? 'opacity-0' : 'opacity-100',
          'transition-opacity duration-300'
        )}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </>
  )
}
