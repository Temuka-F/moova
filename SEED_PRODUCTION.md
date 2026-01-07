# Seeding Production Database

The production database needs to be seeded with dummy data for the application to work properly.

## Quick Start - Seed Production Database:

### Option 1: Using Production Seed Script (Recommended)

1. Pull production environment variables:
```bash
npx vercel env pull .env.production
```

2. Copy `DATABASE_URL` and `DIRECT_URL` from `.env.production` to `.env.local` (temporarily)

3. Run the production seed script:
```bash
npx tsx scripts/seed-production.ts
```

4. Restore your local `.env.local` file

### Option 2: Using Standard Seed Script

1. Set production `DATABASE_URL` and `DIRECT_URL` in `.env.local` (temporarily)

2. Run:
```bash
npm run seed
```

3. Restore your local environment variables

## What Gets Created:

- **10 dummy users** (owners and renters)
- **15 cars** (all approved and active, ready to browse)
- **5 sample bookings**
- **Sample reviews**

All seed data is marked with `isSeedData: true` for easy identification and cleanup.

## To Check if Seed Data Exists:

```bash
npx tsx scripts/check-and-seed.ts
```

## To Clean Up Seed Data (before go-live):

```bash
npm run seed:cleanup
```

**⚠️ Important:** The production database must be seeded for the application to work. Without seed data, you'll see "Car not found" errors and empty browse pages.
