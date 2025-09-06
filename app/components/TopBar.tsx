'use client';

import React, { useRef, useState } from 'react';

type Center = [number, number];
type Props = { setCenter: (c: Center) => void };

export default function TopBar({ setCenter }: Props) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch() {
    const query = q.trim();
    if (!query) {
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept-Language': 'it',
            'User-Agent': 'diveplunge/0.1 (admin@diveplunge.com)',
          },
        },
      );

      const data: Array<{ lat: string; lon: string }> = await res.json();
      if (Array.isArray(data) && data.length) {
        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          setCenter([lat, lon]);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Cerca luogo…"
        className="border rounded px-3 py-2 w-full max-w-md"
        type="text"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
      >
        {loading ? 'Cerco…' : 'Cerca'}
      </button>
    </div>
  );
}
