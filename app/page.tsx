// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import Header, { HEADER_HEIGHT } from "./components/Header";
import { spots as STATIC_SPOTS } from "./data/spots";
import type { Spot } from "./types";
import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";
import SpotPanel from "./components/SpotPanel";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const router = useRouter();

  // auth
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setUserId(sess?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // stato UI
  const [center, setCenter] = useState<[number, number]>([41.9, 12.5]);
  const [selected, setSelected] = useState<Spot | null>(null);

  // dataset corrente (in questa fase: statico)
  const [filterType, setFilterType] = useState<"all" | "sea" | "lake" | "river">("all");
  const spots = useMemo(() => {
    const merged = STATIC_SPOTS;
    if (filterType === "all") return merged;
    return merged.filter(
      (s) => (s.waterType ?? s.water_type ?? "").toLowerCase() === filterType
    );
  }, [filterType]);

  // click su pin: se non loggato -> vai su /auth
  const handleSpotClick = useCallback((s: Spot) => {
    if (!userId) {
      router.push(`/auth?next=/`);
      return;
    }
    setSelected(s);
  }, [router, userId]);

  // tasto destro mappa -> crea spot
  const handleRequestCreate = useCallback((lat: number, lon: number) => {
    if (!userId) {
      router.push(`/auth?next=/`);
      return;
    }
    router.push(`/create?lat=${lat}&lon=${lon}`);
  }, [router, userId]);

  // finder: geocoding con Nominatim
  const [q, setQ] = useState("");
  const searchPlace = async () => {
    if (!q.trim()) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { "Accept-Language": "it" } });
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    }
  };

  return (
    <>
      <Header />

      <main className="app-main">
        {/* Finder + filtri */}
        <div className="finder-wrap">
          <input
            placeholder="Cerca città o luogo (es. Cagliari)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchPlace()}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{ border: "1px solid #d7e2f3", borderRadius: 10, padding: "10px 12px", background: "#fff" }}
          >
            <option value="all">Tutte le acque</option>
            <option value="sea">Mare</option>
            <option value="lake">Lago</option>
            <option value="river">Fiume</option>
          </select>
          <button onClick={searchPlace}>Cerca</button>
        </div>

        {/* Mappa */}
        <Map
          center={center}
          spots={spots}
          onSpotClick={handleSpotClick}
          onRequestCreate={handleRequestCreate}
        />

        {/* Slogan bottom-left */}
        <div className="dp-badge">
          <strong>diveplunge</strong> — Breath. Jump. Live.
        </div>

        {/* Pannello spot */}
        <SpotPanel spot={selected} onClose={() => setSelected(null)} />
      </main>
    </>
  );
}
