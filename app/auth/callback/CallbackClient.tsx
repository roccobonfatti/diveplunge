// app/auth/callback/CallbackClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackClient() {
  const search = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("Verifico…");

  useEffect(() => {
    (async () => {
      const code = search.get("code");
      const token_hash = search.get("token_hash");
      const type = search.get("type");

      try {
        if (code) {
          // ✅ compatibile con la tua versione di supabase-js
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // dopo il login, se mancano nome/cognome → vai all’onboarding
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const meta = user.user_metadata || {};
            const hasName = meta.first_name || meta.last_name;
            if (!hasName) return router.replace("/onboarding");
          }

          setMsg("Accesso completato. Reindirizzo…");
          router.replace("/");
          return;
        }

        if (token_hash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: (type as any) || "email",
          });
          if (error) throw error;

          setMsg("Email verificata. Reindirizzo…");
          router.replace("/onboarding");
          return;
        }

        // se non ci sono parametri riconosciuti → home
        router.replace("/");
      } catch (e: any) {
        setMsg("Errore: " + e.message);
      }
    })();
  }, [search, router]);

  return (
    <main className="min-h-[60vh] grid place-items-center p-6">
      <p className="text-white text-lg">{msg}</p>
    </main>
  );
}
