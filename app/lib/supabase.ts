// app/lib/supabase.ts
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
  console.error(
    "Supabase: variabili mancanti. Assicurati di avere NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// Evita di ricreare il client ad ogni HMR (hot reload) in sviluppo
declare global {
  interface Window {
    __supabase?: SupabaseClient;
  }
}

const _client =
  typeof window !== "undefined" && window.__supabase
    ? window.__supabase
    : createClient(url, anon, {
        auth: {
          persistSession: true,     // resta loggato tra i refresh
          autoRefreshToken: true,   // rinnova il token automaticamente
          detectSessionInUrl: true, // gestisce redirect OAuth/callback
        },
      });

if (typeof window !== "undefined") {
  window.__supabase = _client;
}

// Esporto sia nominativo sia default per compatibilità con gli import esistenti
export const supabase = _client;
export default _client;
