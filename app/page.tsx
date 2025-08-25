"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Header, { HEADER_HEIGHT } from "./components/Header";
import SpotPanel from "./components/SpotPanel";
import { spots as ALL_SPOTS } from "./data/spots";
import type { Spot } from "./types";
import { supabase } from "./lib/supabase";

// Mappa caricata lato client
const Map = dynamic(() => import("./components/Map"), { ssr: false });

/** ------------------------------------------------------------------ */
/** Helper: normalizza il tipo d’acqua indipendentemente dal nome campo */
function getWaterType(s: Spot): string {
  const v = (s.waterType ?? s.water_type ?? "").toString().toLowerCase();
  return v;
}
/** ------------------------------------------------------------------ */

export default function Home() {
  // Centro iniziale: Italia
  const [center] = useState<[number, number]>([41.9, 12.5]);

  // Stato pannello spot (aperto solo se loggati)
  const [selected, setSelected] = useState<Spot | null>(null);

  // Sessione utente (null se non loggato)
  const [session, setSession] = useState<any>(null);

  // Spot caricati dal DB
  const [dbSpots, setDbSpots] = useState<Spot[]>([]);

  // UI filtro tipo acqua (se vuoi collegarlo ai tuoi controlli)
  const [filterType, setFilterType] = useState<string>("all");

  const router = useRouter();

  // Recupero sessione e listener auth
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      if (isMounted) setSession(sess);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Carico gli spot dal DB (colonne minime utili)
  useEffect(() => {
    let ignore = false;

    (async () => {
      const { data, error } = await supabase
        .from("spots")
        .select(
          "id,name,water_type,waterType,lat,lon,lng,long,difficulty,rating"
        );

      if (!ignore) {
        if (error) {
          console.error("Errore caricamento spots DB:", error);
        } else {
          setDbSpots((data ?? []) as Spot[]);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // Merge statici + DB (puoi fare dedup se necessario)
  const merged: Spot[] = useMemo(() => {
    return [...ALL_SPOTS, ...dbSpots];
  }, [dbSpots]);

  // Applica filtro per tipo acqua con helper normalizzato
  const visibleSpots = useMemo(() => {
    if (filterType === "all") return merged;
    return merged.filter((s) => getWaterType(s) === filterType);
  }, [merged, filterType]);

  // Click su spot: se non loggato → login; altrimenti apri pannello
  const handleSpotClick = async (s: Spot) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push(`/login?next=/`);
      return;
    }
    setSelected(s);
  };

  return (
    <>
      {/* Barra blu */}
      <Header />

      {/* Area mappa */}
      <main
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Mappa con spot filtrati */}
        <Map center={center} spots={visibleSpots} onSpotClick={handleSpotClick} />

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

        {/* Pannello spot (si apre solo se loggati via handleSpotClick) */}
        <SpotPanel spot={selected} onClose={() => setSelected(null)} />
      </main>
    </>
  );
}
