# Moova - Setup Documentation

This document contains all connection credentials and setup information for the Moova car rental platform.

## 🔐 Environment Variables

All environment variables are stored in `.env.local` for local development and in Vercel for production deployments.

### Supabase Configuration

- **Project URL:** `https://zcghrknxvrieugneysbf.supabase.co`
- **Project Reference:** `zcghrknxvrieugneysbf`
- **Region:** `eu-central-1` (Frankfurt)

### Database Credentials

- **Connection Pooling (DATABASE_URL):** For regular queries with pgbouncer
  ```
  postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

- **Direct Connection (DIRECT_URL):** For migrations and schema changes
  ```
  postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
  ```

- **Database Password:** `N&s8zdNSpu#++ij` (URL encoded in connection strings)

### API Keys

- **Anon Key (Public):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2hya254dnJpZXVnbmV5c2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzI3ODAsImV4cCI6MjA4MzM0ODc4MH0.swaIObL0ia84yg5pUovCRnN1VhkldGstuAOU3oD6pBY`

- **Service Role Key (Private - Server-side only):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2hya254dnJpZXVnbmV5c2JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc3Mjc4MCwiZXhwIjoyMDgzMzQ4NzgwfQ.c4NG6hb0l1-Hos2wUg-DfpcOsmEFJ-sGADaW21baDwk`

## 🔗 Service Connections

### GitHub
- **Repository:** `https://github.com/Temuka-F/moova.git`
- **Status:** ✅ Connected
- **Remote:** `origin`

### Vercel
- **Project:** `moova`
- **Team:** `temos-projects-635ec2aa`
- **Status:** ✅ Linked
- **Project ID:** `prj_r4NjTQ5jeh04vXGe6i4aNxsJMAlK`

To link again: `npx vercel link`

## 📋 Required Environment Variables

### Local Development (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zcghrknxvrieugneysbf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres.zcghrknxvrieugneysbf:...@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.zcghrknxvrieugneysbf:...@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel (Production/Preview/Development)

All the same variables need to be added to Vercel dashboard:
1. Go to: https://vercel.com/temos-projects-635ec2aa/moova/settings/environment-variables
2. Add each variable for all environments (Production, Preview, Development)

Or use the CLI script:
```bash
powershell ./scripts/setup-vercel-env.ps1
```

## 🚀 Setup Steps (For New Developer/Environment)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Temuka-F/moova.git
   cd moova
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   - Copy the variables from this document
   - Or restore from secure storage

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Push database schema (if needed):**
   ```bash
   npx prisma db push
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

## 📊 Database Status

- **Schema:** ✅ Already in sync
- **Migrations:** Located in `prisma/migrations/`
- **Connection:** ✅ Configured

## 🔧 Troubleshooting

### Prisma Client Generation Error (EPERM)
If you see `EPERM: operation not permitted` when running `prisma generate`:
- Close any running dev servers
- Close VS Code/editor
- Try again

### Environment Variables Not Loading
- Make sure `.env.local` exists in the project root
- Restart your dev server after changing `.env.local`
- For Vercel: Check environment variables in dashboard

### Database Connection Issues
- Verify credentials in Supabase dashboard
- Check if IP is whitelisted (for direct connections)
- Use connection pooling URL for regular queries

## 📝 Notes

- Never commit `.env.local` to Git (already in `.gitignore`)
- Service role key should NEVER be exposed to client-side code
- Database password is URL-encoded in connection strings
- Vercel environment variables are automatically synced from `.vercel` folder

---

**Last Updated:** 2024-02-07
**Setup By:** Auto Setup Script
