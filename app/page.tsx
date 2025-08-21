"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header, { HEADER_HEIGHT } from "./components/Header";
import SpotPanel from "./components/SpotPanel";
import { spots as ALL_SPOTS } from "./data/spots";
import type { Spot } from "./types";

// Import mappa in dinamico (Leaflet non va in SSR)
const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  // Centro iniziale: Italia
  const [center] = useState<[number, number]>([41.9, 12.5]);
  const [selected, setSelected] = useState<Spot | null>(null);

  return (
    <>
      {/* Barra blu in alto */}
      <Header />

      {/* Area mappa: occupa tutto lo spazio sotto l'header */}
      <main
        style={{
          position: "fixed",
          top: HEADER_HEIGHT, // es. 88px
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Map
          center={center}
          spots={ALL_SPOTS}
          // Cast a Spot del nostro types, per allineare i tipi
          onSpotClick={(s) => setSelected(s as Spot)}
        />

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
          <span style={{ fontWeight: 600 }}>diveplunge</span> — Breath. Jump.
          Live.
        </div>

        {/* Pannello spot a destra (selezionato) */}
        <SpotPanel spot={selected} onClose={() => setSelected(null)} />
      </main>
    </>
  );
}
