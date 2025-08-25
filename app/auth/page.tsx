// app/auth/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

function Btn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid #d0d7de",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 600,
        marginTop: 10,
      }}
    >
      {children}
    </button>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const baseRedirect = () =>
    `${window.location.origin}/auth/callback`; // pagina di callback qui sotto

  async function oauth(provider: "google" | "apple" | "facebook" | "linkedin") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: baseRedirect() },
    });
    if (error) alert(error.message);
  }

  async function emailMagic() {
    if (!email) return alert("Inserisci una email");
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: baseRedirect(),
      },
    });
    setSending(false);
    if (error) alert(error.message);
    else alert("Ti abbiamo inviato un link di accesso via email ✅");
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(180deg, #0B2A4A 0%, #0E3A65 50%, #0b2a4a 100%)",
      }}
    >
      <div
        style={{
          width: 380,
          maxWidth: "90vw",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
          padding: 22,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Accedi</h1>
        <p style={{ marginTop: 6, color: "#667085" }}>
          Scegli un provider o usa il link via email.
        </p>

        {/* OAuth providers */}
        <Btn onClick={() => oauth("google")}>Continua con Google</Btn>
        <Btn onClick={() => oauth("apple")}>Continua con Apple</Btn>
        <Btn onClick={() => oauth("facebook")}>Continua con Facebook</Btn>
        <Btn onClick={() => oauth("linkedin")}>Continua con LinkedIn</Btn>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "14px 0",
            color: "#98A2B3",
            fontSize: 12,
          }}
        >
          <div style={{ height: 1, background: "#eef2f6", flex: 1 }} />
          oppure
          <div style={{ height: 1, background: "#eef2f6", flex: 1 }} />
        </div>

        {/* Email magic link */}
        <div style={{ display: "grid", gap: 8 }}>
          <input
            type="email"
            placeholder="tua@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px 14px",
              border: "1px solid #d0d7de",
              borderRadius: 10,
              outline: "none",
            }}
          />
          <button
            onClick={emailMagic}
            disabled={sending}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "none",
              background: "#0E3A65",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {sending ? "Invio in corso…" : "Mandami il link via email"}
          </button>
        </div>

        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: 14,
            width: "100%",
            background: "transparent",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
            color: "#0E3A65",
          }}
        >
          Torna alla mappa
        </button>
      </div>
    </div>
  );
}
