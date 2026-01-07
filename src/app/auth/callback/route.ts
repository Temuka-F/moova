import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { syncUser } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Sync user to Prisma database after successful authentication
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        try {
          await syncUser({
            id: authUser.id,
            email: authUser.email!,
            user_metadata: authUser.user_metadata as {
              first_name?: string
              last_name?: string
              avatar_url?: string
              phone?: string
            },
          })
        } catch (syncError) {
          console.error('Error syncing user to database:', syncError)
          // Continue with redirect even if sync fails - user can be synced later via /api/me
        }
      }
      
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
