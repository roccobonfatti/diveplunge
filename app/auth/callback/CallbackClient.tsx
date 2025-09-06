// app/auth/callback/CallbackClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const [msg, setMsg] = useState("Attendere, completamento login…");

  useEffect(() => {
    (async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error) {
          setMsg(error.message);
        } else {
          router.replace(next);
        }
      } catch (e: any) {
        setMsg(e?.message || "Errore di autenticazione.");
      }
    })();
  }, [next, router]);

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        color: "#fff",
      }}
    >
      {msg}
    </div>
  );
}
