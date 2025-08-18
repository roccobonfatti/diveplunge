"use client";

import { useState } from "react";
import type { WaterType } from "../types";

type Props = {
  onSearchPlace: (q: string) => void;
  waterType: WaterType | "all";
  onWaterTypeChange: (t: WaterType | "all") => void;
  minDifficulty: number;
  onMinDifficultyChange: (n: number) => void;
  minRating: number;
  onMinRatingChange: (n: number) => void;
};

export default function TopBar(p: Props) {
  const [q, setQ] = useState("");

  const wrap: React.CSSProperties = {
    position: "fixed",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 5000,
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  };

  const box: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 16,
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  };

  const input: React.CSSProperties = {
    width: 360,
    maxWidth: "60vw",
    fontSize: 14,
    padding: "6px 8px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    outline: "none",
    background: "#fff",
  };

  const select: React.CSSProperties = {
    fontSize: 14,
    padding: "6px 8px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
  };

  const btn: React.CSSProperties = {
    fontSize: 14,
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    background: "#2563eb",
    cursor: "pointer",
  };

  // --- HANDLER TIPIZZATO: niente `any`
  const handleWaterTypeChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value as "all" | WaterType;
    p.onWaterTypeChange(value);
  };

  return (
    <div style={wrap}>
      <div style={box}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && p.onSearchPlace(q)}
          placeholder="Cerca città o luogo (es. Cagliari)…"
          style={input}
        />

        <select
          value={p.waterType}
          onChange={handleWaterTypeChange}
          style={select}
          aria-label="Tipo di acqua"
        >
          <option value="all">Tutte le acque</option>
          <option value="sea">Mare</option>
          <option value="river">Fiume</option>
          <option value="lake">Lago</option>
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          Diff. ≥
          <select
            value={p.minDifficulty}
            onChange={(e) => p.onMinDifficultyChange(Number(e.target.value))}
            style={select}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          Rating ≥
          <select
            value={p.minRating}
            onChange={(e) => p.onMinRatingChange(Number(e.target.value))}
            style={select}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button onClick={() => p.onSearchPlace(q)} style={btn}>
          Cerca
        </button>
      </div>
    </div>
  );
}
