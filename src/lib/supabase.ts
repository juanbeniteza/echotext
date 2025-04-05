import { createClient } from '@supabase/supabase-js';

// Flag to enable/disable real Supabase connectivity
const USE_REAL_SUPABASE = false;

// These environment variables will need to be set in a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a mock supabase client for local testing without credentials
const createMockClient = () => {
  // In-memory storage for links
  const links = new Map();
  
  return {
    from: (table: string) => ({
      insert: async (data: any) => {
        links.set(data.id, data);
        return { error: null };
      },
      select: (columns: string) => ({
        eq: (column: string, value: string) => ({
          single: async () => {
            const data = links.get(value);
            if (!data) {
              return { data: null, error: null };
            }
            return { data, error: null };
          }
        })
      }),
      update: (data: any) => ({
        eq: async (column: string, value: string) => {
          if (links.has(value)) {
            const existingData = links.get(value);
            links.set(value, { ...existingData, ...data });
          }
          return { error: null };
        }
      })
    }),
  };
};

// Warning message only if we're using real Supabase but missing credentials
if (USE_REAL_SUPABASE && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    'Supabase URL or anonymous key missing. Make sure you have a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

// Create either a real or mock supabase client
export const supabase = USE_REAL_SUPABASE 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Log which mode we're in
console.log(`Using ${USE_REAL_SUPABASE ? 'REAL' : 'MOCK'} Supabase client`); 