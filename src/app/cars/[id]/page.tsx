/**
 * Car Detail Page Route
 * 
 * Shows detailed information about a specific car.
 * Features: Image gallery, specs, features, reviews, booking sidebar.
 * 
 * Component: src/components/pages/CarDetailPage.tsx
 */

import { use } from 'react'
import { CarDetailPage } from '@/components/pages/CarDetailPage'

export default function CarDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <CarDetailPage carId={id} />
}
