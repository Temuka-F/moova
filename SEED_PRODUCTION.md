# Seeding Production Database

The production database needs to be seeded with dummy data for the application to work properly.

## To Seed Production Database:

1. Make sure you have the production environment variables set in your `.env.local` file (or use Vercel's environment variables)

2. Run the seed script:
```bash
npm run seed
```

This will create:
- 10 dummy users (owners and renters)
- 15 cars (all approved and active)
- 5 sample bookings
- Sample reviews

## To Check if Seed Data Exists:

```bash
npx tsx scripts/check-and-seed.ts
```

## To Clean Up Seed Data (before go-live):

```bash
npm run seed:cleanup
```

**Note:** The seed data is marked with `isSeedData: true` so it can be easily identified and deleted before going live.
