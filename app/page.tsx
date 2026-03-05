// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import type { Spot } from "./types";
import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";
import SpotPanel from "./components/SpotPanel";
import LanguageSwitcher from "./components/LanguageSwitcher";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

type Suggestion = { label: string; lat: number; lon: number };

export default function Home() {
  const router = useRouter();

  /* --------------------------- AUTH --------------------------- */
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) =>
      setUserId(sess?.user?.id ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  /* --------------------------- MAP STATE --------------------------- */
  const [center, setCenter] = useState<[number, number]>([41.9, 12.5]);
  const [zoom, setZoom] = useState<number>(5);
  const [selected, setSelected] = useState<Spot | null>(null);

  /* --------------------------- LOAD SPOTS FROM SUPABASE --------------------------- */
  const [allSpots, setAllSpots] = useState<Spot[]>([]);
  const [loadingSpots, setLoadingSpots] = useState(true);

  useEffect(() => {
    async function fetchSpots() {
      setLoadingSpots(true);
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .order("name");
      if (!error && data) {
        const mapped: Spot[] = data.map((row: any) => ({
          id: row.slug || row.id,
          name: row.name,
          country: row.country,
          lat: row.lat,
          lon: row.lon,
          rating: row.rating ? Number(row.rating) : undefined,
          difficulty: row.difficulty,
          waterType: row.water_type,
          water_type: row.water_type,
          heightMeters: row.height_m,
          season: row.season,
          warnings: row.warnings,
          notes: row.notes,
          image_url: row.image_url,
          region: row.region,
          city: row.city,
          depthMeters: row.depth_m,
          directions: row.directions,
          subType: row.sub_type,
          photoSearchTerm: row.photo_search_term,
        }));
        setAllSpots(mapped);
      }
      setLoadingSpots(false);
    }
    fetchSpots();
  }, []);

  /* --------------------------- DATASET / FILTRI --------------------------- */
  const [filterWater, setFilterWater] =
    useState<"all" | "sea" | "lake" | "river">("all");
  const [filterActivity, setFilterActivity] =
    useState<"all" | "tuffo" | "immersione" | "snorkeling">("all");

  const TUFFO_TYPES = ["cliff_jumping", "cliff_diving", "bridge_jump", "waterfall_jump", "tombstoning", "coasteering", "deep_water_solo"];
  const IMMERSIONE_TYPES = ["scuba", "diving", "freediving", "cenote", "blue_hole"];
  const SNORKELING_TYPES = ["wild_swimming", "snorkeling"];

  const spots = useMemo(() => {
    let filtered = allSpots;
    if (filterWater !== "all") {
      filtered = filtered.filter(
        (s) => (s.waterType ?? s.water_type ?? "").toLowerCase() === filterWater
      );
    }
    if (filterActivity !== "all") {
      const allowed =
        filterActivity === "tuffo" ? TUFFO_TYPES :
        filterActivity === "immersione" ? IMMERSIONE_TYPES :
        SNORKELING_TYPES;
      filtered = filtered.filter((s) =>
        allowed.includes((s.subType ?? "").toLowerCase())
      );
    }
    return filtered;
  }, [filterWater, filterActivity, allSpots]);

  /* --------------------------- HANDLERS --------------------------- */
  const handleSpotClick = useCallback(
    (s: Spot) => {
      if (!userId) {
        router.push(`/auth?next=/`);
        return;
      }
      setSelected(s);
    },
    [router, userId]
  );

  const handleRequestCreate = useCallback(
    (lat: number, lon: number) => {
      if (!userId) {
        router.push(`/auth?next=/`);
        return;
      }
      router.push(`/create?lat=${lat}&lon=${lon}`);
    },
    [router, userId]
  );

  /* --------------------------- AUTOCOMPLETE --------------------------- */
  const [q, setQ] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) {
      setItems([]);
      setActive(-1);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(
          q.trim()
        )}`;
        const res = await fetch(url, {
          signal: ctrl.signal,
          headers: {
            "Accept-Language": "it",
            "User-Agent": "diveplunge/1.0 (+admin@diveplunge.com)",
          },
        });
        const data = await res.json();
        const list: Suggestion[] = Array.isArray(data)
          ? data.map((d: any) => ({
              label: d.display_name as string,
              lat: parseFloat(d.lat),
              lon: parseFloat(d.lon),
            }))
          : [];
        setItems(list);
        setActive(list.length ? 0 : -1);
      } catch {
        /* ignore */
      } finally {
        setLoadingSearch(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const selectItem = (s: Suggestion) => {
    setQ(s.label);
    setItems([]);
    setActive(-1);
    setCenter([s.lat, s.lon]);
    setZoom(11);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const i = active >= 0 ? active : 0;
      items[i] && selectItem(items[i]);
    } else if (e.key === "Escape") {
      setItems([]);
      setActive(-1);
    }
  };

  /* --------------------------- RENDER --------------------------- */
  return (
    <>
      <Header />

      <main className="app-main">
        {/* Finder centrato e visibile sopra la mappa */}
        <div
          className="finder-wrap"
          style={{
            position: "fixed",
            top: 84, // subito sotto l'header
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3000,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              placeholder="Cerca città o luogo (es. Cagliari)…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              type="text"
            />

            <select
              value={filterWater}
              onChange={(e) => setFilterWater(e.target.value as any)}
              style={{
                border: "1px solid #d7e2f3",
                borderRadius: 10,
                padding: "10px 12px",
                background: "#fff",
              }}
              aria-label="Filtra per tipo acqua"
            >
              <option value="all">Tutte le acque</option>
              <option value="sea">Mare</option>
              <option value="lake">Lago</option>
              <option value="river">Fiume</option>
            </select>

            <select
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value as any)}
              style={{
                border: "1px solid #d7e2f3",
                borderRadius: 10,
                padding: "10px 12px",
                background: "#fff",
              }}
              aria-label="Filtra per attività"
            >
              <option value="all">Tutte le attività</option>
              <option value="tuffo">Tuffo</option>
              <option value="immersione">Immersione</option>
              <option value="snorkeling">Snorkeling</option>
            </select>

            <button
              onClick={() => items[0] && selectItem(items[0])}
              disabled={!q.trim()}
            >
              {loadingSearch ? "Cerco…" : "Cerca"}
            </button>

            {/* Dropdown risultati */}
            {items.length > 0 && (
              <div
                className="finder-results"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "calc(100% + 6px)",
                  background: "#fff",
                  border: "1px solid #e8eef9",
                  borderRadius: 10,
                  boxShadow: "0 12px 32px rgba(13,25,51,.18)",
                  maxHeight: 320,
                  overflow: "auto",
                  zIndex: 3010,
                }}
              >
                {items.map((s, i) => (
                  <div
                    key={`${s.lat}-${s.lon}-${i}`}
                    className={`finder-item ${i === active ? "active" : ""}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectItem(s);
                    }}
                    style={{
                      padding: "8px 10px",
                      background: i === active ? "#eef5ff" : "transparent",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={s.label}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mappa */}
        <Map
          center={center}
          zoom={zoom as any}
          spots={spots}
          onSpotClick={handleSpotClick}
          onRequestCreate={handleRequestCreate}
        />

        {/* Badge con logo-mark dentro al quadrato (logo più grande) */}
        <div
          className="dp-badge"
          style={{
            position: "fixed",
            bottom: 16,
            left: 16, // se lo vuoi a destra: rimuovi left e metti right: 16
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 10px 26px rgba(0,0,0,.18)",
            display: "grid",
            placeItems: "center",
            zIndex: 2500,
          }}
        >
          <img
            src="/logo-mark.svg"
            alt="diveplunge"
            style={{
              width: 56, // riempie di più il quadrato
              height: 56,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* Pannello spot */}
        <SpotPanel spot={selected} onClose={() => setSelected(null)} />

        {/* Lingue (cerchio invariato, emoji più grande viene dal file del componente) */}
        <LanguageSwitcher />
      </main>
    </>
  );
}
