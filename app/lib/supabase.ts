// app/lib/supabase.ts
"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url || !anon) {
  console.error(
    "Supabase: manca NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

/**
 * Client unico, solo lato browser, con sessione persistente.
 * Nessun import da '@supabase/ssr'.
 */
export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,        // resta loggato
    autoRefreshToken: true,      // refresh automatico
    detectSessionInUrl: true,
    storageKey: "diveplunge.auth", // chiave isolata per diveplunge
  },
});
