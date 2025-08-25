"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

function getOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || "https://diveplunge.vercel.app";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const origin = getOrigin();
  const callback = `${origin}/auth/callback`;

  async function loginWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callback },
      });
      if (error) throw error;
      setMsg("Ti abbiamo inviato un link di accesso. Controlla la casella email.");
    } catch (err: any) {
      setMsg(err.message || "Errore durante l'invio del link.");
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "apple") {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callback },
      });
      if (error) throw error;
      // verrai rediretto dal provider → callback
    } catch (err: any) {
      setMsg(err.message || "Errore durante l'accesso OAuth.");
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 480, margin: "88px auto 32px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Accedi a diveplunge</h1>

      <form onSubmit={loginWithEmail} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          required
          placeholder="la-tua-email@esempio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "12px 14px",
            border: "1px solid #d0d7e2",
            borderRadius: 10,
            fontSize: 16,
          }}
        />
        <button
          disabled={busy}
          type="submit"
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            background: "#0E3A65",
            color: "white",
            fontWeight: 700,
            border: "none",
          }}
        >
          {busy ? "Invio..." : "Invia link di accesso"}
        </button>
      </form>

      <div style={{ margin: "16px 0", textAlign: "center", opacity: 0.7 }}>oppure</div>

      <div style={{ display: "grid", gap: 10 }}>
        <button
          disabled={busy}
          onClick={() => oauth("google")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d0d7e2",
            background: "white",
            fontWeight: 600,
          }}
        >
          Continua con Google
        </button>
        {/* Apple è lì pronta, basta abilitarla in Supabase se/quando vorrai */}
        <button
          disabled={busy}
          onClick={() => oauth("apple")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d0d7e2",
            background: "white",
            fontWeight: 600,
          }}
        >
          Continua con Apple
        </button>
      </div>

      {msg && (
        <p style={{ marginTop: 14, color: "#0E3A65" }}>
          {msg}
        </p>
      )}

      <p style={{ marginTop: 18 }}>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          style={{ color: "#0E3A65" }}
        >
          Torna indietro
        </a>
      </p>
    </main>
  );
}
