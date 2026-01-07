# Moova - Setup & Deployment Documentation

This document contains all connection credentials, setup information, and deployment procedures for the Moova car rental platform.

---

## 🚀 DEPLOYMENT CHECKLIST (For Every Change)

**ALWAYS deploy to all 3 platforms after making changes:**

### 1. GitHub (Code Repository)
```bash
cd C:\Users\temuk\moova
git add -A
git commit -m "feat: description of changes"
git push origin master
```

### 2. Vercel (Hosting)
```bash
cd C:\Users\temuk\moova
npx vercel --prod --yes
```

### 3. Supabase (Database)
Only if schema changes were made:
```powershell
cd C:\Users\temuk\moova
$env:DATABASE_URL = "postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL = "postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
npx prisma db push
```

---

## 🔐 Environment Variables

### Supabase Configuration
- **Project URL:** `https://zcghrknxvrieugneysbf.supabase.co`
- **Project Reference:** `zcghrknxvrieugneysbf`
- **Region:** `eu-central-1` (Frankfurt)
- **Dashboard:** https://supabase.com/dashboard/project/zcghrknxvrieugneysbf

### Database Connection Strings

**CONNECTION POOLING (DATABASE_URL)** - For regular queries:
```
postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**DIRECT CONNECTION (DIRECT_URL)** - For migrations:
```
postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

**Database Password:** `N&s8zdNSpu#++ij` (URL encoded in connection strings)

### API Keys

**Anon Key (Public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2hya254dnJpZXVnbmV5c2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzI3ODAsImV4cCI6MjA4MzM0ODc4MH0.swaIObL0ia84yg5pUovCRnN1VhkldGstuAOU3oD6pBY
```

**Service Role Key (Private - Server-side only):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2hya254dnJpZXVnbmV5c2JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc3Mjc4MCwiZXhwIjoyMDgzMzQ4NzgwfQ.c4NG6hb0l1-Hos2wUg-DfpcOsmEFJ-sGADaW21baDwk
```

---

## 🔗 Service Connections

### GitHub
- **Repository:** https://github.com/Temuka-F/moova.git
- **Branch:** `master`
- **Status:** ✅ Connected

### Vercel
- **Project:** `moova`
- **Team:** `temos-projects-635ec2aa`
- **Live URL:** https://moova-lilac.vercel.app
- **Dashboard:** https://vercel.com/temos-projects-635ec2aa/moova
- **Project ID:** `prj_r4NjTQ5jeh04vXGe6i4aNxsJMAlK`

### Supabase
- **Project:** `zcghrknxvrieugneysbf`
- **Dashboard:** https://supabase.com/dashboard/project/zcghrknxvrieugneysbf
- **Status:** ✅ Connected

---

## 📋 Full Environment Variables List

All these are configured in Vercel for Production, Preview, and Development:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zcghrknxvrieugneysbf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (see above) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (see above) |
| `NEXT_PUBLIC_APP_URL` | Production: `https://moova-lilac.vercel.app`, Dev: `http://localhost:3000` |

---

## 🛠️ Quick Commands Reference

### Development
```bash
# Start dev server
npm run dev

# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### Deployment (Full Process)
```bash
# 1. Commit and push to GitHub
git add -A && git commit -m "description" && git push origin master

# 2. Deploy to Vercel
npx vercel --prod --yes

# 3. If schema changed, push to Supabase (PowerShell)
$env:DATABASE_URL = "postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL = "postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
npx prisma db push
```

### Vercel Environment Management
```bash
# List all env vars
npx vercel env ls

# Pull env vars to local .env.local
npx vercel env pull .env.local

# Add new env var
echo "value" | npx vercel env add VAR_NAME production
echo "value" | npx vercel env add VAR_NAME preview
echo "value" | npx vercel env add VAR_NAME development
```

---

## 📁 Project Structure

```
moova/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js pages & API routes
│   ├── components/        # React components
│   ├── lib/               # Utilities (prisma, supabase, auth)
│   └── types/             # TypeScript types
├── .env.local             # Local environment variables (gitignored)
├── SETUP.md               # This file
└── package.json
```

---

## 🔧 Troubleshooting

### Prisma EPERM Error
If you see `EPERM: operation not permitted` when running `prisma generate`:
- Close any running dev servers
- Close VS Code/editor
- Try again

### Environment Variables Not Loading
- Make sure `.env.local` exists in project root
- Restart dev server after changing `.env.local`
- Run `npx vercel env pull .env.local` to sync from Vercel

### Database Connection Issues
- Verify credentials in Supabase dashboard
- Use connection pooling URL (`DATABASE_URL`) for regular queries
- Use direct URL (`DIRECT_URL`) for migrations only

### Vercel Deployment Fails
- Check build logs: `npx vercel logs`
- Verify all env vars are set: `npx vercel env ls`
- Redeploy: `npx vercel --prod --yes`

---

## 📝 Notes

- Never commit `.env.local` to Git (already in `.gitignore`)
- Service role key should NEVER be exposed to client-side code
- Database password is URL-encoded in connection strings
- Always deploy to all 3 platforms after changes

---

**Live URL:** https://moova-lilac.vercel.app
**Last Updated:** 2025-01-07
