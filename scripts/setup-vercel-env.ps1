# Script to add environment variables to Vercel
# Run this script to set up all required environment variables

$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://zcghrknxvrieugneysbf.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2hya254dnJpZXVnbmV5c2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzI3ODAsImV4cCI6MjA4MzM0ODc4MH0.swaIObL0ia84yg5pUovCRnN1VhkldGstuAOU3oD6pBY"
    "SUPABASE_SERVICE_ROLE_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2hya254dnJpZXVnbmV5c2JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc3Mjc4MCwiZXhwIjoyMDgzMzQ4NzgwfQ.c4NG6hb0l1-Hos2wUg-DfpcOsmEFJ-sGADaW21baDwk"
    "DATABASE_URL" = "postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    "DIRECT_URL" = "postgresql://postgres.zcghrknxvrieugneysbf:N%26s8zdNSpu%23%2B%2Bij@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
}

$environments = @("production", "preview", "development")

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green
Write-Host "You'll need to confirm each variable. Mark sensitive values (SUPABASE_SERVICE_ROLE_KEY) as 'y' and others as 'n'" -ForegroundColor Yellow
Write-Host ""

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    $isSensitive = ($key -eq "SUPABASE_SERVICE_ROLE_KEY" -or $key -eq "DATABASE_URL" -or $key -eq "DIRECT_URL")
    
    foreach ($env in $environments) {
        Write-Host "Adding $key to $env..." -ForegroundColor Cyan
        $sensitiveFlag = if ($isSensitive) { "y" } else { "n" }
        echo "$sensitiveFlag`n$value" | npx vercel env add $key $env
    }
}

Write-Host ""
Write-Host "Done! Environment variables added to Vercel." -ForegroundColor Green
