"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Header from "./components/Header";
import TopBar from "./components/TopBar";
import SpotPanel from "./components/SpotPanel";
import { spots as ALL_SPOTS } from "./data/spots";
import type { Spot, WaterType } from "./types";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [center, setCenter] = useState<[number, number]>([41.9, 12.5]); // Italia
  const [waterType, setWaterType] = useState<WaterType | "all">("all");
  const [minDiff, setMinDiff] = useState(1);
  const [minRating, setMinRating] = useState(1);
  const [selected, setSelected] = useState<Spot | null>(null);

  const spots = useMemo(() => {
    return ALL_SPOTS.filter(
      (s) =>
        (waterType === "all" || s.waterType === waterType) &&
        s.difficulty >= minDiff &&
        s.rating >= minRating
    );
  }, [waterType, minDiff, minRating]);

  async function searchPlace(q: string) {
    if (!q.trim()) return;
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", q);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "1");
      const res = await fetch(url.toString(), { headers: { "Accept-Language": "it" } });
      const data = await res.json();
      if (data?.[0]) {
        setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert("Nessun risultato trovato.");
      }
    } catch {
      alert("Errore di ricerca. Riprova tra poco.");
    }
  }

  return (
    <main className="relative w-screen h-screen">
      {/* Mappa pieno schermo */}
      <Map center={center} spots={spots} onSpotClick={setSelected} />

      {/* Overlay UI */}
      <Header />
      <TopBar
        onSearchPlace={searchPlace}
        waterType={waterType}
        onWaterTypeChange={setWaterType}
        minDifficulty={minDiff}
        onMinDifficultyChange={setMinDiff}
        minRating={minRating}
        onMinRatingChange={setMinRating}
      />
      <SpotPanel spot={selected} onClose={() => setSelected(null)} />

      {/* Slogan in basso a sinistra */}
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
        <span style={{ fontWeight: 600 }}>DivePlunge</span> — Breath. Live. Jump.
      </div>
    </main>
  );
}
