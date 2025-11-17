"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Gender = "male" | "female" | "nonbinary" | "other" | "prefer_not_to_say";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const first_name = String(form.get("first_name") || "").trim();
    const last_name = String(form.get("last_name") || "").trim();
    const gender = (String(form.get("gender") || "") || "prefer_not_to_say") as Gender;
    const dob = String(form.get("dob") || "").trim();

    if (!email || !first_name || !last_name) {
      setMsg("Compila almeno email, nome e cognome.");
      setLoading(false);
      return;
    }

    const password = crypto.randomUUID();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name, gender, dob },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) setMsg("Errore iscrizione: " + error.message);
    else {
      setMsg("Controlla la tua email per confermare l'iscrizione.");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, #174a7e60, transparent), linear-gradient(180deg, #0b2138 0%, #0e1a2b 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl px-6 py-14">
        <div className="w-full flex flex-col items-center mb-8">
          <Image
            src="/brand/diveplunge-logo-white.png"
            alt="diveplunge"
            width={180}
            height={180}
            priority
          />
        </div>

        <h1 className="text-center text-3xl font-bold">Crea il tuo account</h1>
        <p className="text-center mt-2 text-white/75">
          Compila i dati: riceverai una mail con il link di conferma.
        </p>

        <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl grid gap-4">
          <input name="email" type="email" placeholder="Email" required
                 className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 placeholder-white/60" />
          <div className="flex gap-3">
            <input name="first_name" placeholder="Nome" required
                   className="flex-1 rounded-lg border border-white/15 bg-white/10 px-4 py-3 placeholder-white/60" />
            <input name="last_name" placeholder="Cognome" required
                   className="flex-1 rounded-lg border border-white/15 bg-white/10 px-4 py-3 placeholder-white/60" />
          </div>
          <div className="flex gap-3">
            <select name="gender"
                    className="flex-1 rounded-lg border border-white/15 bg-white/10 px-4 py-3">
              <option value="prefer_not_to_say">Preferisco non dirlo</option>
              <option value="male">Maschio</option>
              <option value="female">Femmina</option>
              <option value="nonbinary">Non binario</option>
              <option value="other">Altro</option>
            </select>
            <input name="dob" type="date"
                   className="flex-1 rounded-lg border border-white/15 bg-white/10 px-4 py-3" />
          </div>

          <button disabled={loading}
                  className="mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-3 font-semibold shadow-lg shadow-blue-900/30">
            {loading ? "Invio…" : "Registrati"}
          </button>
        </form>

        {msg && <p className="text-center mt-5 text-sm">{msg}</p>}
      </div>
    </main>
  );
}
