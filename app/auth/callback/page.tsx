"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AuthCallback() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("Sto completando l'accesso...");

  useEffect(() => {
    async function run() {
      const codeParam = sp.get("code");
      const code = Array.isArray(codeParam) ? codeParam[0] : codeParam || "";

      if (!code) {
        setMsg("Codice mancante. Riprova ad accedere.");
        return;
      }

      try {
        // Prova firma nuova: { code }
        const anyAuth = supabase.auth as any;
        if (typeof anyAuth.exchangeCodeForSession === "function") {
          let res = await anyAuth.exchangeCodeForSession({ code });
          if (res?.error) {
            // fallback firma vecchia: (code)
            res = await anyAuth.exchangeCodeForSession(code);
            if (res?.error) throw res.error;
          }
          setMsg("Accesso completato, reindirizzamento...");
          router.replace("/");
          return;
        }
        setMsg("SDK auth non disponibile. Riprova.");
      } catch (err: any) {
        setMsg(err?.message || "Errore durante l'accesso.");
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 480, margin: "88px auto 32px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>diveplunge</h1>
      <p>{msg}</p>
    </main>
  );
}
