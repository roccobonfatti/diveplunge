"use client";

import React, { useRef, useState } from "react";

type Props = {
  setCenter: (c: [number, number]) => void;
};

export default function TopBar({ setCenter }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const handleSearch = async () => {
    const query = (q || inputRef.current?.value || "").trim();
    if (!query) return;
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`;
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "it",
          "User-Agent": "diveplunge/0.1 (admin@diveplunge.com)",
        },
      });
      const data: any[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        const lat = Number(first.lat);
        const lon = Number(first.lon);
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          setCenter([lat, lon]);
        }
      }
    } catch (e) {
      console.error("search failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={onKey}
        placeholder="Cerca luogo…"
        className="border rounded px-3 py-2 w-full max-w-md"
        type="text"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
      >
        {loading ? "Cerco…" : "Cerca"}
      </button>
    </div>
  );
}
