// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [msg, setMsg] = useState("Completamento accesso…");

  useEffect(() => {
    async function run() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          // Scambia il code per la sessione
          const { error } = await supabase.auth.exchangeCodeForSession({ code });
          if (error) {
            setMsg(error.message);
            return;
          }
        }

        // Se sei loggato vai in home
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          router.replace("/");
        } else {
          setMsg("Accesso non riuscito. Riprova.");
        }
      } catch (e: any) {
        setMsg(e.message ?? "Errore inatteso.");
      }
    }
    run();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "#0E3A65",
        color: "white",
        fontWeight: 700,
        fontSize: 20,
      }}
    >
      {msg}
    </div>
  );
}
