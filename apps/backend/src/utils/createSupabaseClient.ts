// createSupabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(accessToken: string) {
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseAnonKey = process.env.SUPABASE_SERVICE_KEY as string;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}
