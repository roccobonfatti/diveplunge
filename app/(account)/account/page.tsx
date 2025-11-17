"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AvatarUploader from "@/components/AvatarUploader";

type Profile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  phone: string | null;
  dob: string | null;
  avatar_url: string | null;
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data as Profile);
      setLoading(false);
    })();
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    setMsg(null);

    const form = new FormData(e.currentTarget);
    const update = {
      first_name: String(form.get("first_name") || ""),
      last_name: String(form.get("last_name") || ""),
      gender: String(form.get("gender") || ""),
      phone: String(form.get("phone") || ""),
      dob: String(form.get("dob") || "")
    };

    const { error } = await supabase.from("profiles").update(update).eq("id", profile.id);
    setMsg(error ? "Errore salvataggio: " + error.message : "Salvato!");
  }

  if (loading) return <p className="p-6">Caricamento…</p>;
  if (!profile) return <p className="p-6">Accedi per vedere il tuo profilo.</p>;

  const displayName = (profile.first_name || "") + (profile.last_name ? ` ${profile.last_name}` : "");

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Il tuo account</h1>

      <div className="flex items-center gap-4">
        <AvatarUploader
          initialUrl={profile.avatar_url || undefined}
          onUploaded={async (url) => {
            await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
            setProfile({ ...profile, avatar_url: url });
          }}
        />
        <div>
          <div className="text-lg font-medium">{displayName || "Utente"}</div>
          <div className="text-sm text-gray-500">{profile.email}</div>
        </div>
      </div>

      <form onSubmit={save} className="grid gap-3">
        <div className="flex gap-3">
          <input name="first_name" defaultValue={profile.first_name ?? ""} placeholder="Nome" className="flex-1 border p-2 rounded" />
          <input name="last_name" defaultValue={profile.last_name ?? ""} placeholder="Cognome" className="flex-1 border p-2 rounded" />
        </div>
        <div className="flex gap-3">
          <select name="gender" defaultValue={profile.gender ?? "prefer_not_to_say"} className="flex-1 border p-2 rounded">
            <option value="prefer_not_to_say">Preferisco non dirlo</option>
            <option value="male">Maschio</option>
            <option value="female">Femmina</option>
            <option value="nonbinary">Non binario</option>
            <option value="other">Altro</option>
          </select>
          <input name="phone" defaultValue={profile.phone ?? ""} placeholder="Telefono" className="flex-1 border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Data di nascita</label>
          <input name="dob" type="date" defaultValue={profile.dob ?? ""} className="border p-2 rounded w-full" />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-fit">Salva</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </main>
  );
}
