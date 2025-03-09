import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
export const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);