# Moova - Project Documentation

Comprehensive documentation of architectural decisions, features, UI/UX choices, and technical implementation details.

## 📋 Table of Contents

1. [Architecture Decisions](#architecture-decisions)
2. [Feature Implementation](#feature-implementation)
3. [UI/UX Design Decisions](#uiux-design-decisions)
4. [Technical Implementation](#technical-implementation)
5. [Database Schema](#database-schema)
6. [API Design](#api-design)
7. [Security Considerations](#security-considerations)
8. [Performance Optimizations](#performance-optimizations)
9. [Known Issues & Future Improvements](#known-issues--future-improvements)

---

## 🏗 Architecture Decisions

### 1. Next.js App Router

**Decision:** Use Next.js 16 App Router instead of Pages Router

**Rationale:**
- Modern React Server Components support
- Better performance with server-side rendering
- Improved code organization with route groups
- Built-in layouts and loading states
- Better TypeScript support

**Implementation:**
- Route groups: `(auth)`, `(main)`, `(map)` for logical organization
- Server components where possible, client components only when needed
- API routes in `app/api/` directory

### 2. Hybrid Data Strategy

**Decision:** Implement hybrid data fetching with database-first, mock-fallback approach

**Rationale:**
- Ensures app never appears empty during development
- Allows development without database connection
- Smooth transition from mock to real data
- Better developer experience

**Implementation:**
- `src/lib/car-data.ts` - Fetches from API, falls back to `map-cars.ts` mock data
- `fetchCarsWithFallback()` function handles the logic
- Mock data in `src/lib/map-cars.ts` for 15+ sample cars

### 3. Prisma ORM

**Decision:** Use Prisma instead of raw SQL or other ORMs

**Rationale:**
- Type-safe database access
- Excellent developer experience
- Automatic migrations
- Great TypeScript integration
- Built-in connection pooling

**Implementation:**
- Schema in `prisma/schema.prisma`
- Single Prisma client instance in `src/lib/prisma.ts`
- Connection pooling via Supabase connection strings

### 4. Supabase Integration

**Decision:** Use Supabase for auth, database, and storage

**Rationale:**
- Unified platform for backend services
- Built-in authentication
- PostgreSQL database with connection pooling
- File storage for car images
- Row-level security capabilities

**Implementation:**
- Supabase clients in `src/lib/supabase/`
- Auth middleware in `src/middleware.ts`
- Storage for car image uploads

### 5. Component Architecture

**Decision:** Organize components by feature/domain

**Rationale:**
- Clear separation of concerns
- Easy to locate components
- Scalable structure
- Reusable UI components

**Structure:**
```
components/
├── ui/           # Reusable UI primitives (buttons, cards, etc.)
├── cars/         # Car-specific components
├── dashboard/    # Dashboard components
├── map/          # Map-related components
├── pages/        # Page-level components
└── layout/       # Layout components
```

### 6. Map-First Interface

**Decision:** Make map the primary interface for car discovery

**Rationale:**
- Intuitive for location-based search
- Visual representation of car availability
- Mobile-friendly interaction
- Differentiates from list-based competitors

**Implementation:**
- Mapbox GL JS for map rendering
- Custom markers with price indicators
- Interactive popups and drawers
- Real-time filtering on map

---

## ✨ Feature Implementation

### Core Features

#### 1. User Authentication

**Implementation:**
- Supabase Auth with email/password
- Google OAuth support (configured)
- Session management via middleware
- Role-based access control (RENTER, OWNER, ADMIN)

**Files:**
- `src/lib/auth.ts` - Auth utilities
- `src/lib/supabase/` - Supabase client setup
- `src/middleware.ts` - Route protection
- `src/hooks/useAuth.ts` - React auth hook

#### 2. Car Listing & Discovery

**Features:**
- Map-based discovery
- Advanced filtering (city, price, category, features)
- Search functionality
- Car detail pages
- Image galleries

**Implementation:**
- `src/components/pages/MapHomePage.tsx` - Main map interface
- `src/components/pages/CarListingPage.tsx` - List view
- `src/components/pages/CarDetailPage.tsx` - Detail view
- `src/app/api/cars/route.ts` - Car API endpoints

#### 3. Booking System

**Features:**
- Date selection
- Booking creation
- Status management (PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED)
- Booking history
- Owner approval workflow

**Implementation:**
- `src/app/api/bookings/route.ts` - Booking CRUD
- `src/app/dashboard/bookings/` - Booking management UI
- Booking status workflow in database schema

#### 4. Payment Integration

**Features:**
- Flitt payment gateway integration
- Service fee calculation
- Security deposit handling
- Payment status tracking

**Implementation:**
- `src/lib/flitt.ts` - Payment utilities
- Payment records in database
- Payment status in booking model

#### 5. User Profiles

**Features:**
- User profiles with verification
- Owner profiles with response rates
- Review and rating system
- Profile editing

**Implementation:**
- User model with verification fields
- Profile pages in dashboard
- Review system linked to bookings

#### 6. Messaging System

**Features:**
- In-app messaging
- Booking-linked conversations
- Message read status
- Image sharing support

**Implementation:**
- Message model in database
- `src/app/api/messages/route.ts` - Message API
- `src/app/dashboard/messages/page.tsx` - Messaging UI

#### 7. Admin Dashboard

**Features:**
- User management
- Car approval workflow
- Booking oversight
- Platform analytics
- Admin action logging

**Implementation:**
- `src/app/admin/` - Admin routes
- Admin-only API endpoints
- Admin log tracking

### Advanced Features

#### 8. Favorites System

**Implementation:**
- Favorite model in database
- `src/app/api/favorites/route.ts` - Favorites API
- Favorite button on car cards

#### 9. Reviews & Ratings

**Implementation:**
- Review model linked to bookings
- Car and user reviews
- Rating aggregation
- Review display on car pages

#### 10. Image Management

**Implementation:**
- Supabase Storage for images
- Multiple images per car
- Primary image selection
- Image upload API

---

## 🎨 UI/UX Design Decisions

### 1. Dual Design Strategy

**Decision:** Implement distinct, optimized layouts for Desktop and Mobile

**Rationale:**
- **Contextual Usage:** Desktop users often perform deeper research/management, while mobile users need quick access and touch-friendly controls.
- **Screen Real Estate:** Desktop offers ample space for persistent sidebars and floating elements; mobile requires efficient stacking and drawer usage.
- **No Compromises:** Avoids the "stretched mobile app" feel on desktop and the "cramped desktop site" feel on mobile.

**Implementation:**
- **Desktop Layout:** 
  - Floating `TopNav` and `DesktopSidebar` overlaying the map.
  - Persistent visibility of key filters and controls.
- **Mobile Layout:** 
  - `MobileBottomNav` for primary navigation.
  - `MobileCarSheet` (Drawer) for car details and listings.
  - Stacked `ControlBar` and hidden map/list toggles.
- **Responsive Logic:** Conditionals based on viewport breakpoints (Tailwind `md:`, `lg:`) and custom hooks to swap entire layout components.

### 2. Map-First Interface

**Decision:** Map as primary discovery method

**Rationale:**
- Location is key for car rental
- Visual and intuitive
- Differentiates from competitors

**Implementation:**
- Full-screen map on homepage
- Car markers with price badges
- Interactive popups
- Bottom drawer on mobile

### 3. Component Library

**Decision:** Build custom component library on Radix UI

**Rationale:**
- Accessible by default
- Unstyled primitives
- Full customization control
- Consistent design system

**Components:**
- Buttons, Cards, Dialogs, Dropdowns
- Forms, Inputs, Selects
- Calendar, Popover, Tabs
- All in `src/components/ui/`

### 4. Color Scheme

**Decision:** Neutral base with accent colors

**Implementation:**
- Gray scale for backgrounds
- Black for primary actions
- Teal/blue for accents
- Status colors (green, red, yellow)

### 5. Typography

**Decision:** System font stack for performance

**Implementation:**
- Sans-serif system fonts
- Clear hierarchy
- Readable sizes
- Proper line heights

### 6. Loading States

**Decision:** Skeleton loaders for better UX

**Implementation:**
- Skeleton components
- Loading states in API calls
- Progressive loading
- Error states with retry

### 7. Animations

**Decision:** Subtle animations for feedback

**Implementation:**
- Framer Motion for transitions
- Hover states
- Loading spinners
- Page transitions

---

## 🔧 Technical Implementation

### 1. Type Safety

**Approach:** Full TypeScript coverage

**Implementation:**
- Strict TypeScript config
- Type definitions in `src/types/`
- Prisma-generated types
- API response types

### 2. Error Handling

**Approach:** Centralized error handling

**Implementation:**
- `src/lib/error-utils.ts` - Error utilities
- Try-catch in API routes
- Error boundaries (where needed)
- User-friendly error messages

### 3. Form Validation

**Approach:** Zod schema validation

**Implementation:**
- Zod schemas for all forms
- React Hook Form integration
- Server-side validation
- Client-side validation

### 4. State Management

**Approach:** React state + Zustand for global state

**Implementation:**
- Local state with useState
- Zustand for global state (if needed)
- React Query for server state
- URL state for filters

### 5. API Design

**Approach:** RESTful API with Next.js API routes

**Pattern:**
- `/api/resource` - List/Create
- `/api/resource/[id]` - Get/Update/Delete
- Consistent error responses
- Type-safe request/response

### 6. Database Seeding

**Approach:** Comprehensive seed scripts

**Implementation:**
- `prisma/seed.ts` - Development seeding
- `scripts/seed-production.ts` - Production seeding
- `scripts/fix-bookings.ts` - Utility scripts
- Proper linking of relationships

### 7. Environment Management

**Approach:** Environment-specific configs

**Implementation:**
- `.env.local` for local development
- Vercel environment variables
- Different configs for dev/prod
- Secure credential storage

---

## 🗄 Database Schema

### Key Models

#### User
- Authentication via Supabase
- Role-based access (RENTER, OWNER, ADMIN)
- Verification status
- Profile information

#### Car
- Owner relationship
- Location (lat/lng)
- Pricing and features
- Status workflow (PENDING → APPROVED)
- Images relationship

#### Booking
- Car and renter relationships
- Date range
- Status workflow
- Payment tracking
- Review relationship

#### Review
- Linked to booking (one-to-one)
- Car and user reviews
- Rating breakdown
- Comments

#### Message
- Booking-linked conversations
- Sender/receiver relationships
- Read status
- Image support

### Relationships

- User → Cars (one-to-many)
- User → Bookings (as renter, one-to-many)
- Car → Bookings (one-to-many)
- Booking → Review (one-to-one)
- Booking → Messages (one-to-many)

---

## 🔌 API Design

### Endpoints

#### Cars
- `GET /api/cars` - List cars with filters
- `GET /api/cars/[id]` - Get car details
- `POST /api/cars` - Create car (owner)
- `PATCH /api/cars/[id]` - Update car
- `DELETE /api/cars/[id]` - Delete car

#### Bookings
- `GET /api/bookings` - List user bookings
- `GET /api/bookings/[id]` - Get booking details
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/[id]` - Update booking

#### Users
- `GET /api/me` - Get current user
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update user

#### Admin
- `GET /api/admin/cars` - Admin car management
- `GET /api/admin/stats` - Platform statistics

### Response Format

```typescript
// Success
{
  data: T,
  // or
  cars: Car[],
  total: number,
  page: number
}

// Error
{
  error: string,
  message?: string
}
```

---

## 🔒 Security Considerations

### 1. Authentication

- Supabase Auth handles security
- JWT tokens for sessions
- Middleware protects routes
- Role-based access control

### 2. Authorization

- API routes check user roles
- Owners can only edit their cars
- Admins have elevated permissions
- Row-level checks in queries

### 3. Data Validation

- Zod schemas validate input
- Server-side validation
- SQL injection prevented by Prisma
- XSS protection via React

### 4. Environment Variables

- Secrets in environment variables
- Never committed to git
- Vercel secure storage
- Service role key server-only

---

## ⚡ Performance Optimizations

### 1. Image Optimization

- Next.js Image component
- Lazy loading
- Responsive images
- CDN via Supabase

### 2. Code Splitting

- Dynamic imports for maps
- Route-based splitting
- Component lazy loading

### 3. Caching

- React Query caching
- API response caching
- Static page generation where possible

### 4. Database Optimization

- Indexed fields in Prisma schema
- Efficient queries
- Connection pooling
- Pagination for lists

---

## 🐛 Known Issues & Future Improvements

### Known Issues

1. **Map Loading:** Mapbox requires client-side rendering (handled with dynamic imports)
2. **Image Upload:** Large images may need compression
3. **Booking Conflicts:** Need to add availability checking

### Future Improvements

1. **Real-time Updates:** WebSocket for live booking updates
2. **Advanced Search:** Full-text search, saved searches
3. **Notifications:** Push notifications for bookings
4. **Analytics:** User behavior tracking
5. **Mobile App:** React Native app
6. **Internationalization:** Multi-language support
7. **Advanced Filters:** More filter options
8. **Booking Calendar:** Visual calendar for availability
9. **Payout System:** Automated payouts to owners
10. **Insurance Integration:** Third-party insurance API

---

## 📝 Development Notes

### Important Decisions Made

1. **Map-First UI:** Chosen for better UX, requires Mapbox integration
2. **Hybrid Data:** Mock fallback ensures dev never breaks
3. **Prisma:** Type safety worth the learning curve
4. **Supabase:** All-in-one solution simplifies infrastructure
5. **Next.js App Router:** Future-proof choice despite learning curve

### Code Conventions

- TypeScript strict mode
- Functional components with hooks
- Async/await for async operations
- Error handling in all API routes
- Type definitions for all data structures

### Testing Strategy

- Manual testing during development
- Debug tools for database state
- API endpoint testing
- Browser DevTools for frontend

---

**Last Updated:** January 2025  
**Documentation Version:** 1.0.0
