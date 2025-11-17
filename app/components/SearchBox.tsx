// app/components/SearchBox.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Suggest = {
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  onPick: (center: [number, number]) => void;
  filterType: "all" | "sea" | "lake" | "river";
  onChangeFilter: (v: "all" | "sea" | "lake" | "river") => void;
};

export default function SearchBox({ onPick, filterType, onChangeFilter }: Props) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Suggest[]>([]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const tRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!q.trim()) { setItems([]); setOpen(false); return; }
    clearTimeout(tRef.current);
    tRef.current = window.setTimeout(async () => {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&addressdetails=1&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "it",
          "User-Agent": "diveplunge/1.0 (+admin@diveplunge.com)",
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
        setOpen(true);
        setIdx(-1);
      }
    }, 250);
  }, [q]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const pick = (s: Suggest) => {
    const lat = parseFloat(s.lat), lon = parseFloat(s.lon);
    onPick([lat, lon]);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, items.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && idx >= 0) { e.preventDefault(); pick(items[idx]); }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={boxRef} className="finder-wrap">
      <input
        placeholder="Cerca città o luogo (es. Cagliari)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => items.length && setOpen(true)}
        onKeyDown={onKeyDown}
        type="text"
      />

      <select
        value={filterType}
        onChange={(e) => onChangeFilter(e.target.value as any)}
        className="finder-select"
      >
        <option value="all">Tutte le acque</option>
        <option value="sea">Mare</option>
        <option value="lake">Lago</option>
        <option value="river">Fiume</option>
      </select>

      <button
        onClick={() => { if (items[0]) pick(items[0]); }}
      >
        Cerca
      </button>

      {open && items.length > 0 && (
        <ul className="search-list">
          {items.map((s, i) => (
            <li
              key={`${s.lat}-${s.lon}-${i}`}
              className={i === idx ? "active" : ""}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(s)}
              title={s.display_name}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
