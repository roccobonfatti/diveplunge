"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type FormState = {
  name: string;
  waterType: "sea" | "river" | "lake";
  difficulty: number;
  rating: number;
  heightM?: number | "";
  season?: string;
  warnings?: string;
  notes?: string;
  lat: string;   // testo poi cast a number
  lon: string;   // testo poi cast a number
};

export default function CreateSpotPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    waterType: "sea",
    difficulty: 3,
    rating: 3.5,
    heightM: "",
    season: "",
    warnings: "",
    notes: "",
    lat: "",
    lon: "",
  });

  // Se non loggato → vai a /login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) router.replace("/login");
    });
  }, [router]);

  function onChange<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    try {
      setBusy(true);

      // 1) Upload immagine (opzionale)
      let image_url: string | null = null;
      const file = fileRef.current?.files?.[0] ?? null;

      if (file) {
        const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
        const up = await supabase.storage.from("spot-covers").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (up.error) throw up.error;
        const { data } = supabase.storage.from("spot-covers").getPublicUrl(path);
        image_url = data.publicUrl;
      }

      // 2) Insert riga
      const { error } = await supabase.from("spots").insert({
        name: form.name.trim(),
        water_type: form.waterType,
        difficulty: Number(form.difficulty),
        rating: Number(form.rating),
        height_m: form.heightM === "" ? null : Number(form.heightM),
        season: form.season || null,
        warnings: form.warnings || null,
        notes: form.notes || null,
        lat: Number(form.lat),
        lon: Number(form.lon),
        image_url,
      });
      if (error) throw error;

      alert("Spot creato! 🎉");
      router.push("/"); // torna alla home
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Errore durante la creazione dello spot.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{maxWidth: 760, margin: "80px auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto"}}>
      <h1 style={{fontSize:28, fontWeight:800, marginBottom:8}}>Crea un nuovo spot</h1>
      <p style={{opacity:.8, marginBottom:20}}>Carica una foto di copertina e compila i dettagli.</p>

      <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <section style={row}>
          <label style={label}>Nome</label>
          <input required value={form.name} onChange={e=>onChange("name", e.target.value)} style={input}/>
        </section>

        <section style={row}>
          <label style={label}>Tipo acqua</label>
          <select value={form.waterType} onChange={e=>onChange("waterType", e.target.value as any)} style={input}>
            <option value="sea">Sea</option>
            <option value="river">River</option>
            <option value="lake">Lake</option>
          </select>
        </section>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
          <section style={row}>
            <label style={label}>Difficoltà (1-5)</label>
            <input type="number" min={1} max={5} value={form.difficulty}
                   onChange={e=>onChange("difficulty", Number(e.target.value))} style={input}/>
          </section>
          <section style={row}>
            <label style={label}>Rating (1-5)</label>
            <input type="number" min={1} max={5} step="0.1" value={form.rating}
                   onChange={e=>onChange("rating", Number(e.target.value))} style={input}/>
          </section>
          <section style={row}>
            <label style={label}>Altezza m</label>
            <input type="number" min={0} value={form.heightM ?? ""}
                   onChange={e=>onChange("heightM", e.target.value === "" ? "" : Number(e.target.value))} style={input}/>
          </section>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <section style={row}>
            <label style={label}>Stagione</label>
            <input value={form.season ?? ""} onChange={e=>onChange("season", e.target.value)} style={input}/>
          </section>
          <section style={row}>
            <label style={label}>Foto di copertina</label>
            <input type="file" accept="image/*" ref={fileRef} style={input}/>
          </section>
        </div>

        <section style={row}>
          <label style={label}>Avvertenze</label>
          <textarea value={form.warnings ?? ""} onChange={e=>onChange("warnings", e.target.value)} style={textarea}/>
        </section>
        <section style={row}>
          <label style={label}>Note</label>
          <textarea value={form.notes ?? ""} onChange={e=>onChange("notes", e.target.value)} style={textarea}/>
        </section>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <section style={row}>
            <label style={label}>Lat</label>
            <input required value={form.lat} onChange={e=>onChange("lat", e.target.value)} style={input}/>
          </section>
          <section style={row}>
            <label style={label}>Lon</label>
            <input required value={form.lon} onChange={e=>onChange("lon", e.target.value)} style={input}/>
          </section>
        </div>

        <div style={{display:"flex", gap:12, marginTop:8}}>
          <button disabled={busy} style={primaryBtn}>{busy ? "Salvataggio..." : "Salva spot"}</button>
          <button type="button" onClick={()=>history.back()} style={ghostBtn}>Annulla</button>
        </div>
      </form>
    </main>
  );
}

const row: React.CSSProperties = { display:"grid", gap:6 };
const label: React.CSSProperties = { fontSize:13, fontWeight:600, opacity:.8 };
const input: React.CSSProperties = { padding:"10px 12px", border:"1px solid #ccd3da", borderRadius:8 };
const textarea: React.CSSProperties = { ...input, minHeight:90 };
const primaryBtn: React.CSSProperties = { padding:"10px 14px", borderRadius:8, background:"#0e3a65", color:"#fff", border:0 };
const ghostBtn: React.CSSProperties = { padding:"10px 14px", borderRadius:8, background:"#f1f4f7", border:"1px solid #d0d6dd" };
