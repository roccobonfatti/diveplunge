// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import Header, { HEADER_HEIGHT } from "./components/Header";
import supabase from "./lib/supabase";
import { spots as ALL_SEED_SPOTS } from "./data/spots";
import SpotPanel from "./components/SpotPanel";
import type L from "leaflet";

// mappa client-side
const Map = dynamic(() => import("./components/Map"), { ssr: false });

type UISpot = any;

function randId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Home() {
  const [center] = useState<[number, number]>([41.9, 12.5]);

  const [dbSpots, setDbSpots] = useState<UISpot[]>([]);
  const [selected, setSelected] = useState<UISpot | null>(null);

  // form crea spot
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    water_type: "sea",
    difficulty: 3,
    rating: 3.5,
    height_m: undefined as number | undefined,
    season: "",
    warnings: "",
    notes: "",
    lat: 41.9,
    lon: 12.5,
    file: null as File | null,
  });

  // riferimento alla mappa per il finder
  const mapRef = useRef<L.Map | null>(null);

  /** ---- LOGIN GUARD ----- */
  async function requireLogin(): Promise<boolean> {
    const { data } = await supabase.auth.getUser();
    if (data.user) return true;

    const email = window.prompt("Per procedere, accedi / registrati. Inserisci la tua email:");
    if (!email) return false;

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert(error.message);
      return false;
    }
    alert("Ti abbiamo inviato un link di accesso. Dopo il login, torna qui e riprova.");
    return false;
  }

  /** ---- CARICA SPOT DAL DB ----- */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setDbSpots(data);
    })();
  }, []);

  // Filtro per tipo acqua (all | sea | river | lake)
  const [filterType, setFilterType] = useState<"all" | "sea" | "river" | "lake">("all");

  // Merge DB + seed e applico filtro
  const allSpots: UISpot[] = useMemo(() => {
    const db = dbSpots.map((s) => ({
      id: s.id,
      name: s.name,
      waterType: s.water_type,
      difficulty: Number(s.difficulty) || 3,
      rating: Number(s.rating) || 3,
      height_m: s.height_m,
      season: s.season,
      warnings: s.warnings,
      notes: s.notes,
      lat: Number(s.lat),
      lon: Number(s.lon),
      image_url: s.image_url,
    }));
    const merged = [...db, ...ALL_SEED_SPOTS];
    if (filterType === "all") return merged;
    return merged.filter(
      (s) => (s.waterType ?? s.water_type ?? "").toLowerCase() === filterType
    );
  }, [dbSpots, filterType]);

  /** ---- HANDLER PROTETTI ----- */
  async function handleSpotClick(s: UISpot) {
    const ok = await requireLogin();
    if (!ok) return;
    setSelected(s);
  }

  async function openCreateBlankGuarded() {
    const ok = await requireLogin();
    if (!ok) return;
    setDraft((d) => ({ ...d, lat: 41.9, lon: 12.5 }));
    setCreateOpen(true);
  }

  async function openCreateAtGuarded(lat: number, lon: number) {
    const ok = await requireLogin();
    if (!ok) return;
    setDraft((d) => ({ ...d, lat, lon }));
    setCreateOpen(true);
  }

  async function openLogin() {
    await requireLogin();
  }

  /** ---- SALVATAGGIO NUOVO SPOT ----- */
  async function handleSaveSpot() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      alert("Devi accedere per creare uno spot.");
      return;
    }

    let image_url: string | undefined;

    if (draft.file) {
      const path = `${auth.user.id}/${randId()}-${draft.file.name}`;
      const { error: upErr } = await supabase.storage.from("spot-covers").upload(path, draft.file, { upsert: true });
      if (upErr) {
        alert("Errore upload immagine: " + upErr.message);
        return;
      }
      const { data: pub } = supabase.storage.from("spot-covers").getPublicUrl(path);
      image_url = pub.publicUrl;
    }

    const payload = {
      name: draft.name.trim(),
      water_type: draft.water_type,
      difficulty: draft.difficulty,
      rating: draft.rating,
      height_m: draft.height_m ?? null,
      season: draft.season || null,
      warnings: draft.warnings || null,
      notes: draft.notes || null,
      lat: draft.lat,
      lon: draft.lon,
      image_url: image_url ?? null,
    };

    const { data, error } = await supabase.from("spots").insert([payload]).select("*").single();
    if (error) {
      alert("Errore salvataggio: " + error.message);
      return;
    }
    setDbSpots((prev) => [data, ...prev]);
    setCreateOpen(false);
    setDraft((d) => ({ ...d, name: "", notes: "", warnings: "", height_m: undefined, file: null }));
  }

  /** ---- FINDER (ricerca luoghi via Nominatim) ----- */
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<
    { lat: number; lon: number; label: string }[]
  >([]);

  useEffect(() => {
    const ctrl = new AbortController();
    async function run() {
      const query = q.trim();
      if (!query) {
        setSuggestions([]);
        return;
      }
      // piccolo debounce
      await new Promise((r) => setTimeout(r, 250));
      if (ctrl.signal.aborted) return;

      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("q", query);
        url.searchParams.set("limit", "6");
        url.searchParams.set("accept-language", "it");

        const res = await fetch(url.toString(), {
          headers: { "User-Agent": "diveplunge.app (dev)" },
          signal: ctrl.signal,
        });
        const data = (await res.json()) as any[];
        setSuggestions(
          data.map((d) => ({
            lat: Number(d.lat),
            lon: Number(d.lon),
            label: d.display_name as string,
          }))
        );
      } catch {
        /* ignora */
      }
    }
    run();
    return () => ctrl.abort();
  }, [q]);

  function flyTo(lat: number, lon: number) {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], 10, { duration: 0.75 });
    }
  }

  return (
    <>
      <Header onCreateSpot={openCreateBlankGuarded} onLogin={openLogin} />

      <main
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Map
          center={center}
          spots={allSpots}
          onSpotClick={handleSpotClick}                         // protetto
          onRequestCreate={(lat, lon) => openCreateAtGuarded(lat, lon)} // protetto
          onMapReady={(m) => (mapRef.current = m)}              // per il finder
        />

        {/* Finder + filtro, centrati in alto */}
        <div
          style={{
            position: "fixed",
            top: HEADER_HEIGHT + 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 6000,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            width: 520,
            maxWidth: "92vw",
            gap: 8,
          }}
        >
          {/* barra di ricerca */}
          <div
            style={{
              background: "white",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,.18)",
              padding: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca città o luogo…"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: 16,
                padding: "8px 10px",
              }}
            />
            {suggestions.length > 0 && (
              <div
                style={{
                  background: "white",
                  border: "1px solid #eef2f7",
                  borderRadius: 10,
                  marginTop: 6,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setQ(s.label);
                      setSuggestions([]);
                      flyTo(s.lat, s.lon);
                    }}
                    style={{
                      padding: "8px 10px",
                      borderBottom: "1px solid #f1f5f9",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* filtro tipo acqua */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {(["all", "sea", "river", "lake"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #d0d7de",
                  background: filterType === t ? "#0E3A65" : "white",
                  color: filterType === t ? "white" : "#0B2A4A",
                  fontWeight: 700,
                }}
              >
                {t === "all" ? "Tutto" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* slogan in basso a sinistra */}
        <div
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            zIndex: 5000,
            pointerEvents: "none",
            borderRadius: 12,
            background: "rgba(255,255,255,0.85)",
            padding: "6px 10px",
            fontSize: 14,
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          <span style={{ fontWeight: 600, textTransform: "lowercase" }}>diveplunge</span> — Breath. Jump. Live.
        </div>

        {/* SpotPanel (aperto solo dopo login) */}
        <SpotPanel
          spot={selected}
          onClose={() => setSelected(null)}
          onImageChanged={(url) => {
            if (!selected) return;
            setSelected({ ...selected, image_url: url });
            if (selected.id) {
              setDbSpots((prev) =>
                prev.map((s) => (s.id === selected.id ? { ...s, image_url: url } : s))
              );
            }
          }}
        />

        {/* overlay: crea spot (protetto) */}
        {createOpen && (
          <div
            style={{
              position: "fixed",
              right: 20,
              top: HEADER_HEIGHT + 20,
              width: 340,
              zIndex: 6000,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,.25)",
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Crea spot</div>

            <label className="block">
              <div className="text-sm font-semibold">Nome</div>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Es. Cala Goloritzé"
                className="w-full"
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              <label>
                <div className="text-sm font-semibold">Tipo acqua</div>
                <select
                  value={draft.water_type}
                  onChange={(e) => setDraft({ ...draft, water_type: e.target.value })}
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
                >
                  <option value="sea">Sea</option>
                  <option value="river">River</option>
                  <option value="lake">Lake</option>
                </select>
              </label>
              <label>
                <div className="text-sm font-semibold">Altezza (m)</div>
                <input
                  type="number"
                  value={draft.height_m ?? ""}
                  onChange={(e) => setDraft({ ...draft, height_m: e.target.value ? Number(e.target.value) : undefined })}
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              <label>
                <div className="text-sm font-semibold">Difficoltà</div>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={draft.difficulty}
                  onChange={(e) => setDraft({ ...draft, difficulty: Number(e.target.value) })}
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
                />
              </label>
              <label>
                <div className="text-sm font-semibold">Rating</div>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={draft.rating}
                  onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              <label>
                <div className="text-sm font-semibold">Lat</div>
                <input
                  type="number"
                  value={draft.lat}
                  onChange={(e) => setDraft({ ...draft, lat: Number(e.target.value) })}
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
                />
              </label>
              <label>
                <div className="text-sm font-semibold">Lon</div>
                <input
                  type="number"
                  value={draft.lon}
                  onChange={(e) => setDraft({ ...draft, lon: Number(e.target.value) })}
                  style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
                />
              </label>
            </div>

            <label style={{ display: "block", marginTop: 8 }}>
              <div className="text-sm font-semibold">Stagione</div>
              <input
                value={draft.season}
                onChange={(e) => setDraft({ ...draft, season: e.target.value })}
                placeholder="es. summer"
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
              />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              <div className="text-sm font-semibold">Avvertenze</div>
              <input
                value={draft.warnings}
                onChange={(e) => setDraft({ ...draft, warnings: e.target.value })}
                placeholder="correnti forti, ecc."
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
              />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              <div className="text-sm font-semibold">Note</div>
              <textarea
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                rows={3}
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
              />
            </label>

            <label
              style={{
                display: "inline-block",
                marginTop: 12,
                border: "1px solid rgba(14,58,101,.2)",
                background: "#0E3A65",
                color: "white",
                fontWeight: 800,
                borderRadius: 10,
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Carica immagine
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDraft({ ...draft, file: e.target.files?.[0] ?? null })}
                style={{ display: "none" }}
              />
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={handleSaveSpot}
                style={{
                  border: "1px solid rgba(14,58,101,.2)",
                  background: "#0E3A65",
                  color: "white",
                  fontWeight: 800,
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                Salva
              </button>
              <button
                onClick={() => setCreateOpen(false)}
                style={{
                  border: "1px solid #e5e7eb",
                  background: "white",
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontWeight: 700,
                }}
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
