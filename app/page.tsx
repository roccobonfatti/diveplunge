// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header, { HEADER_HEIGHT } from "./components/Header";
import TopBar from "./components/TopBar";
import { spots as ALL_SPOTS } from "./data/spots";
import type { Spot } from "./types";

// Leaflet SSR-safe
const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
  const [center] = useState<[number, number]>([41.9, 12.5]);
  const [selected, setSelected] = useState<Spot | null>(null);

  return (
    <>
      <Header />

      <TopBar
        onSearchPlace={(q) => {
          // TODO: integrare pan della mappa
          // per ora lasciamo il finder come UI; la mappa rimane invariata
          console.log("search:", q);
        }}
      />

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
          spots={ALL_SPOTS}
          onSpotClick={(s) => {
            // se non loggato, il Map attiverà la guard (mostri /login)
            setSelected(s);
          }}
        />
      </main>
    </>
  );
}
