# Moova - Car Sharing Platform

A modern, full-featured car rental platform built for the Georgian market. Moova connects car owners with renters through an intuitive map-first interface, comprehensive booking system, and robust payment integration.

## 🚀 Live Application

**Production URL:** https://moova-lilac.vercel.app

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Documentation](#documentation)

## 🎯 Overview

Moova is a peer-to-peer car sharing platform that enables car owners to list their vehicles and renters to discover and book cars across Georgia. The platform features a map-first interface optimized for mobile and desktop, comprehensive booking management, payment processing, and admin tools.

### Core Value Proposition

- **For Renters:** Easy discovery of cars via interactive map, instant booking, secure payments, and comprehensive insurance
- **For Owners:** Simple listing process, automated booking management, secure payments, and earnings tracking
- **For Platform:** Scalable architecture, real-time data, comprehensive admin tools

## ✨ Key Features

### User Features

- **Map-First Discovery:** Interactive map interface showing available cars with real-time filtering
- **Advanced Search:** Filter by city, price range, category, features, transmission, fuel type
- **Booking System:** Complete booking lifecycle from search to completion
- **Payment Integration:** Secure payment processing via Flitt payment gateway
- **User Profiles:** Comprehensive profiles with verification, reviews, and ratings
- **Messaging:** In-app messaging between renters and owners
- **Favorites:** Save favorite cars for quick access
- **Reviews & Ratings:** Post-booking reviews for cars and users

### Owner Features

- **Car Listing:** Multi-step form for listing cars with images, features, and pricing
- **Dashboard:** Earnings tracking, booking management, car fleet overview
- **Booking Management:** Accept, reject, and manage bookings
- **Earnings Analytics:** Detailed earnings breakdown and payout tracking
- **Profile Management:** Owner profile with response rates and verification

### Admin Features

- **User Management:** User verification, role management, ban/unban functionality
- **Car Approval:** Approve, reject, or suspend car listings
- **Booking Oversight:** View and manage all bookings
- **Analytics Dashboard:** Platform-wide statistics and insights
- **Admin Logs:** Comprehensive audit trail of admin actions

### 🛡️ Role-Based Access Control
- **Strict Role Enforcement:** Dashboard views and navigation are guarded based on active profile mode (Renter vs Owner).
- **Separated Statistics:** Dashboard metrics (earnings, bookings, trips) are strictly separated by role to prevent data mixing.
- **Smart Redirects:** Automatic redirection to the correct dashboard view when switching roles.
- **Protected Routes:** Server-side and client-side guards prevent unauthorized access to role-specific pages.

### 👤 Dual Profile Experience
- **Distinct Views:** Specialized profile pages for Renters (Trip stats, License verification) and Owners (Business stats, Identity verification).
- **Context-Aware Actions:** "Find a Car" for renters vs "List Your Car" for owners.
- **Unified Settings:** Seamless access to account settings from both profile views.

### 🧭 Enhanced Navigation
- **Consistent Access:** Profile and Settings accessible from every view (Home Map, Dashboard Sidebar, Header).
- **Intuitive Linking:** Direct profile access via avatar clicks across the platform.
- **Mobile-Ready:** Fully functional hamburger menus and bottom navigation for mobile users.

### 📱 Unified Mobile-First Interface

Moova features a single, unified responsive architecture designed with a "Mobile-First, Desktop-Friendly" philosophy:

- **Mobile First Core:** All features function identically on mobile and desktop, sharing the same codebase (Map, Search, Details).
- **Desktop Friendly Adaptations:** Mobile components intelligently adapt to larger screens:
    - **Navigation:** Bottom bar morphs into a floating "Dock".
    - **Details:** Bottom sheets transform into floating Side Panels.
    - **Modals:** Full-screen views become centered focus modals.
- **Benefits:** Seamless feature parity, consistent design language, and easier maintenance.

## 🛠 Tech Stack

### Frontend

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19.2.3
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI primitives with custom styling
- **Maps:** Mapbox GL JS & React Map GL
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)

### Backend

- **Runtime:** Node.js (via Next.js API Routes)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 6.19.1
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage (for car images)
- **Payment Gateway:** Flitt integration

### Infrastructure

- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Version Control:** GitHub
- **CI/CD:** Vercel automatic deployments

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (Frontend +    │
│   API Routes)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│Supabase│ │  Flitt │
│  Auth  │ │Payment │
└───┬───┘ └─────────┘
    │
┌───▼──────────┐
│  Supabase    │
│  PostgreSQL  │
│  Database    │
└──────────────┘
```

### Key Architectural Decisions

1. **Next.js App Router:** Modern routing with server components for optimal performance
2. **API Routes:** Serverless functions for backend logic, keeping everything in one codebase
3. **Prisma ORM:** Type-safe database access with excellent developer experience
4. **Supabase:** Complete backend-as-a-service for auth, database, and storage
5. **Hybrid Data Strategy:** Real database data with mock data fallback for development
6. **Map-First UI:** Primary interface is map-based for intuitive car discovery
7. **Component-Based Architecture:** Reusable UI components with clear separation of concerns

### Data Flow

1. **User Actions** → React Components
2. **API Calls** → Next.js API Routes
3. **Database Queries** → Prisma Client
4. **Data Transformation** → Type-safe responses
5. **UI Updates** → React state management

## 🚦 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Supabase account
- Flitt payment account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Temuka-F/moova.git
   cd moova
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required variables (see [SETUP.md](./SETUP.md) for details)

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database** (optional, for development)
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
moova/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Development seed script
│   └── cleanup-seed.ts        # Cleanup script for seed data
├── scripts/
│   ├── seed-production.ts     # Production database seeding
│   ├── fix-bookings.ts        # Utility to fix booking links
│   └── check-and-seed.ts      # Check database state
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   ├── (main)/            # Main public routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   └── debug/             # Debug tools
│   ├── components/            # React components
│   │   ├── cars/              # Car-related components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── home/              # Home page components
│   │   ├── layout/            # Layout components
│   │   ├── map/               # Map components
│   │   ├── pages/             # Page-level components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── supabase/          # Supabase client setup
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── prisma.ts          # Prisma client
│   │   ├── car-data.ts        # Car data fetching
│   │   └── map-cars.ts        # Map car data (mock fallback)
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── .env.local                 # Local environment variables (gitignored)
├── README.md                  # This file
├── SETUP.md                   # Setup and deployment guide
└── package.json               # Dependencies and scripts
```

## 🔄 Development Workflow

### Daily Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Make changes** to code

3. **Test locally** at http://localhost:3000

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: description"
   git push
   ```

### Database Changes

1. **Update schema** in `prisma/schema.prisma`
2. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```
3. **Push to database**
   ```bash
   npx prisma db push
   ```
4. **Update seed scripts** if needed

### Testing

- Use the debug page at `/debug` to monitor database state
- Check API endpoints at `/api/debug?check=all`
- Use Prisma Studio: `npx prisma studio`

## 🚢 Deployment

### Automatic Deployment

The project is configured for automatic deployment via Vercel:

1. **Push to GitHub** → Triggers Vercel build
2. **Vercel builds** → Runs `npm run build`
3. **Deploys** → Live at https://moova-lilac.vercel.app

### Manual Deployment

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup, deployment, and configuration guide
- **[SEED_PRODUCTION.md](./SEED_PRODUCTION.md)** - Production database seeding guide
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Architecture, features, and technical decisions

## 🤝 Contributing

This is a private project. For questions or issues, contact the project maintainer.

## 📝 License

Private - All rights reserved

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production
