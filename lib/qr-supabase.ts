import { createClient } from "@supabase/supabase-js";

const url = process.env.QR_SUPABASE_URL;
const serviceRoleKey = process.env.QR_SUPABASE_SERVICE_ROLE_KEY;

/**
 * Supabase admin client voor het aparte QR-tracker project.
 * Alleen server-side gebruiken.
 */
export function createQrAdminClient() {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "QR Supabase is not configured. Set QR_SUPABASE_URL and QR_SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
