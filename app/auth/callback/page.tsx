"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState<string>("Sto completando l’accesso...");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          setMsg("Codice di autorizzazione mancante.");
          return;
        }

        // Forza la firma in modo agnostico (niente errori di tipi in build)
        const { error } = await (supabase.auth as any).exchangeCodeForSession(code);

        if (error) {
          setMsg(`Errore durante l’accesso: ${error.message ?? String(error)}`);
          return;
        }

        router.replace("/");
      } catch (e: any) {
        setMsg(`Errore inatteso: ${e?.message ?? String(e)}`);
      }
    };

    run();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          maxWidth: 520,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
          Accesso in corso…
        </div>
        <div style={{ color: "#4b5563" }}>{msg}</div>
      </div>
    </div>
  );
}
