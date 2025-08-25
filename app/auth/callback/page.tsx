"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState<string>("Sto completando l’accesso...");

  useEffect(() => {
    const doExchange = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          setMsg("Codice di autorizzazione mancante.");
          return;
        }

        // Alcune versioni accettano un oggetto { code }, altre una stringa semplice.
        // Usiamo un wrapper compatibile, e ignoriamo i tipi per evitare il blocco in build.
        let error: any | null = null;

        try {
          // @ts-expect-error: firma compatibile in runtime anche se i tipi differiscono
          const res1 = await (supabase.auth as any).exchangeCodeForSession({ code });
          error = res1?.error ?? null;
        } catch {
          // Fallback per versioni che accettano la stringa semplice
          // @ts-expect-error: firma alternativa
          const res2 = await (supabase.auth as any).exchangeCodeForSession(code);
          error = res2?.error ?? null;
        }

        if (error) {
          setMsg(`Errore durante l’accesso: ${error.message ?? String(error)}`);
          return;
        }

        // Tutto ok → porta l’utente alla home
        router.replace("/");
      } catch (e: any) {
        setMsg(`Errore inatteso: ${e?.message ?? String(e)}`);
      }
    };

    doExchange();
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
