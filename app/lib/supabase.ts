// app/lib/supabase.ts
"use client";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url || !anon) {
  console.error("Supabase: manca NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/** Client unico, esportato come named export */
export const supabase = createClient(url, anon, {
  auth: {
    persistSession: false, // lato client non salviamo in storage
  },
});
