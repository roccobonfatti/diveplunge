"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }
      setEmail(user.email ?? null);
      setLoading(false);
    })();
  }, [router]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const first_name = String(fd.get("first_name") || "");
    const last_name  = String(fd.get("last_name") || "");
    const gender     = String(fd.get("gender") || "prefer_not_to_say");
    const dob        = String(fd.get("dob") || "");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/auth"); return; }

    // aggiorna tabella profiles
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      first_name, last_name, gender, dob,
      updated_at: new Date().toISOString(),
    });

    // aggiorna anche user_metadata (utile lato client)
    await supabase.auth.updateUser({ data: { first_name, last_name, gender, dob } });

    router.replace("/");
  }

  if (loading) return <main className="p-6">Caricamento…</main>;

  return (
    <main className="min-h-screen text-white"
      style={{ background: "linear-gradient(180deg, #0b2138 0%, #0e1a2b 100%)" }}>
      <div className="mx-auto max-w-xl px-6 py-14">
        <h1 className="text-2xl font-bold mb-3">Benvenuto su diveplunge</h1>
        <p className="text-white/80 mb-6">
          Completa il tuo profilo per personalizzare l’esperienza.
        </p>

        <form onSubmit={save} className="grid gap-3">
          <input name="first_name" placeholder="Nome" required
                 className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 placeholder-white/60" />
          <input name="last_name" placeholder="Cognome" required
                 className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 placeholder-white/60" />
          <input disabled value={email ?? ""} className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 opacity-70" />

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

          <button className="mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-3 font-semibold">
            Salva e continua
          </button>
        </form>
      </div>
    </main>
  );
}
