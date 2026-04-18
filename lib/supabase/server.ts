import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '../types/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!profile) return null

  // Ensure type casting to match Database['public']['Tables']['users']['Row']
  const p = profile as Database['public']['Tables']['users']['Row'];

  return {
    id: p.id,
    full_name: p.full_name,
    email: authUser.email ?? null,
    role: p.role,
    avatar_url: p.avatar_url,
    phone: p.phone,
    whatsapp_number: p.whatsapp_number,
    address: p.address,
    city: p.city,
    state: p.state,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }
}

