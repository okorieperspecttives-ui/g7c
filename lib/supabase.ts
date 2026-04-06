import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;   // ← Must match .env.local

  console.log('Supabase URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
  console.log('Supabase Anon Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};