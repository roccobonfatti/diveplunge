// app/lib/supabase.ts
"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
  // Solo in dev: utile per capire subito se mancano le env
  // eslint-disable-next-line no-console
  console.error("Supabase env mancanti. Controlla .env.local / Vercel Env.");
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: false, // lato client: niente sessione persistita
  },
});

// URL del sito (prod o preview) usato per i redirect dei magic link
export function getSiteURL() {
  // 1) forziamo con variabile esplicita (consigliato su Vercel)
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  // 2) fallback Vercel
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  // 3) dev
  return "http://localhost:3000";
}

// Redirect comune per email / OAuth
export function authRedirectTo() {
  return `${getSiteURL()}/auth/callback`;
}
