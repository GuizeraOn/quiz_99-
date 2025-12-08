import { createClient } from '@supabase/supabase-js';

// Note: Ensure your environment variables are set in .env.local
// NEXT_PUBLIC_SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isValidUrl = (url: string | undefined) => {
    try {
        return url && new URL(url);
    } catch {
        return false;
    }
};

// Client for Server Actions
// If config is missing, we create a proxy that logs warnings instead of crashing
export const supabaseAdmin = (isValidUrl(supabaseUrl) && supabaseServiceKey)
    ? createClient(supabaseUrl!, supabaseServiceKey, {
        auth: {
            persistSession: false,
        },
    })
    : new Proxy({} as any, {
        get: () => () => {
            console.warn('Supabase not configured. Any database calls will fail silently.');
            return { data: null, error: 'Supabase URL or Key missing' };
        }
    });
