import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { loadEnvConfig } from '@next/env'

/**
 * Creates a server-only Supabase client using the Service Role Key.
 */
export const createAdminClient = () => {
  // Force reload environment variables from the project root
  loadEnvConfig(process.cwd())

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY is missing. 
      Available keys: ${Object.keys(process.env).filter(k => k.includes('SUPABASE')).join(', ')}
      Please ensure it is in .env.local and you have RESTARTED your server.`
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};