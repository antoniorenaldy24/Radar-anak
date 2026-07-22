import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Service role client is only for server environments (Route Handlers, Server Actions, Middleware)
 * to bypass RLS for administrative actions like signup flows and webhooks.
 */
export const getSupabaseServiceRoleClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  
  if (typeof window !== "undefined") {
    throw new Error("Service role client cannot be initialized on the client side.");
  }
  
  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
