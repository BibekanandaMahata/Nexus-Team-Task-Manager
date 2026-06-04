import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Supabase server client (service role — bypasses RLS) ──────────────────
// Use ONLY in API route handlers / server-side code.
// Never expose the service role key to the client.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DB = SupabaseClient<any>;

export function getSupabase(): DB {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
    );
  }

  return createClient(url, key, {
    auth: {
      // We manage our own session — disable Supabase's built-in auth persistence
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
