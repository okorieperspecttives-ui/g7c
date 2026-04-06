import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isValidUrl = (url: string | undefined) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseUrl === 'your-project-url') {
    console.warn('Supabase environment variables are missing or invalid. Authentication will not work.');
  }

  try {
    return createBrowserClient(
      isValidUrl(supabaseUrl) ? supabaseUrl! : 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder'
    );
  } catch (error) {
    console.error('Supabase initialization failed:', error);
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder'
    );
  }
};
