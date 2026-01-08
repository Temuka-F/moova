/**
 * Home Page Route - Map-First Interface
 * 
 * Landing page for Moova car sharing platform.
 * Features: Full-screen map with car markers, bottom drawer, winter mode toggle.
 * 
 * Component: src/components/pages/MapHomePage.tsx
 */

import { Suspense } from 'react'
import { MapHomePage } from '@/components/pages/MapHomePage'

function HomeLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 font-medium">Loading Moova...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <MapHomePage />
    </Suspense>
  )
}
