'use client';
import { createClient } from '@supabase/supabase-js';
// 🚨 Sostituisci questi due con i tuoi valori, oppure lasciali così e leggili da .env.local
const supabaseUrl   = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://luicvzznnziaxcywkylg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aWN2enpubnppYXhjeXdreWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MjM3NjUsImV4cCI6MjA3MTQ5OTc2NX0.My7D2U7npBwT71GT7LRn39CPQPq6VvYeui2DkBILPHg';

// Client pubblico (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
