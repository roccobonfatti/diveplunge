"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AuthClient() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    setBusy(false);
    if (error) setMsg("Errore: " + error.message);
    else setMsg("Controlla la tua email per completare l’accesso.");
  }

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, #174a7e60, transparent), linear-gradient(180deg, #0b2138 0%, #0e1a2b 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* LOGO + wordmark */}
        <div className="w-full flex flex-col items-center mb-10">
          <Image
            src="/brand/diveplunge-logo-white.png"
            alt="diveplunge"
            width={220}
            height={220}
            priority
          />
        </div>

        {/* HERO COPY */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Breath. Jump. Live.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/85 leading-snug">
            Libera la tua voglia di <b>respirare</b>, <b>saltar&nbsp;e&nbsp;vivere</b>
            {" "}con la più grande community di <b>Diveplungers</b> al mondo.
          </p>
          <p className="mt-2 text-white/70">
            Per l’iscrizione gratuita inserisci il tuo indirizzo email.
          </p>
        </div>

        {/* FORM EMAIL */}
        <form
          onSubmit={sendMagicLink}
          className="mx-auto mt-6 max-w-xl flex gap-3"
        >
          <input
            type="email"
            required
            placeholder="email@esempio.com"
            className="flex-1 rounded-lg border border-white/15 bg-white/10 px-4 py-3
                       placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            disabled={busy}
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-3 font-semibold
                       shadow-lg shadow-blue-900/30 disabled:opacity-70"
          >
            {busy ? "Invio…" : "Invia link"}
          </button>
        </form>

        {/* ALTRO */}
        <div className="text-center mt-4 text-sm text-white/75">
          Vuoi creare un account con Nome/Cognome subito?{" "}
          <Link href="/auth/signup" className="underline">Registrati qui</Link>
        </div>

        {msg && (
          <p className="text-center mt-6 text-sm text-white/90">{msg}</p>
        )}
      </div>
    </main>
  );
}
