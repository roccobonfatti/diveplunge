"use client";
import { createBrowserClient } from "@supabase/ssr";

// ✅ Gestione sessione persistente tra pagine
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== "undefined" ? localStorage : undefined,
      storageKey: "diveplunge.auth",
    },
  }
);
