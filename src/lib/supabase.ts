import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug logging in development

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
🚨 Supabase configuration missing!

Please create a .env.local file with your Supabase credentials:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

Get these values from your Supabase dashboard:
- Project URL: Settings > General > Project URL
- API Keys: Settings > API > Project API keys

See SUPABASE_SETUP.md for detailed instructions.
  `);
  throw new Error('Supabase configuration is missing. Please check your environment variables.');
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key - only available on server)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
