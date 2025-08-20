"use client";

import { useRef } from "react";
import type { WaterType } from "../types";

type Props = {
  onSearchPlace: (q: string) => void;
  waterType: WaterType | "all";
  onWaterTypeChange: (v: WaterType | "all") => void;
  minDifficulty: number;
  onMinDifficultyChange: (v: number) => void;
  minRating: number;
  onMinRatingChange: (v: number) => void;
};

export default function TopBar({
  onSearchPlace,
  waterType,
  onWaterTypeChange,
  minDifficulty,
  onMinDifficultyChange,
  minRating,
  onMinRatingChange,
}: Props) {
  const qRef = useRef<HTMLInputElement>(null);

  // wrapper “pill” flottante, sotto l’header
  const wrap: React.CSSProperties = {
    position: "fixed",
    top: 100, // header è ~88px, così c’è aria
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 4000,
    pointerEvents: "none", // non blocca la mappa
    width: "min(960px, calc(100% - 32px))",
  };

  const inner: React.CSSProperties = {
    pointerEvents: "auto", // elementi cliccabili
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,.12)",
  };

  const input: React.CSSProperties = {
    flex: 1,
    height: 38,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    fontSize: 14,
  };

  const select: React.CSSProperties = {
    height: 38,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    padding: "0 10px",
    fontSize: 14,
  };

  const btn: React.CSSProperties = {
    height: 38,
    borderRadius: 10,
    border: "1px solid rgba(9,60,120,0.15)",
    background: "linear-gradient(180deg, #0E66C2, #0A53A1)",
    color: "#fff",
    padding: "0 14px",
    fontWeight: 600,
    cursor: "pointer",
  };

  function handleSearch() {
    const q = qRef.current?.value?.trim() || "";
    if (q) onSearchPlace(q);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div style={wrap}>
      <div style={inner}>
        {/* Ricerca */}
        <input
          ref={qRef}
          style={input}
          placeholder="Cerca città o luogo (es. Cagliari)…"
          onKeyDown={handleEnter}
        />

        {/* Tipo acqua */}
        <select
          style={select}
          value={waterType}
          onChange={(e) => onWaterTypeChange(e.target.value as WaterType | "all")}
          title="Tipo d'acqua"
        >
          <option value="all">Tutte le acque</option>
          <option value="sea">Sea</option>
          <option value="river">River</option>
          <option value="lake">Lake</option>
        </select>

        {/* Min difficoltà */}
        <select
          style={select}
          value={minDifficulty}
          onChange={(e) => onMinDifficultyChange(parseInt(e.target.value, 10))}
          title="Difficoltà minima"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              Diff ≥ {n}
            </option>
          ))}
        </select>

        {/* Min rating */}
        <select
          style={select}
          value={minRating}
          onChange={(e) => onMinRatingChange(parseInt(e.target.value, 10))}
          title="Rating minimo"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              Rating ≥ {n}
            </option>
          ))}
        </select>

        {/* Cerca */}
        <button style={btn} onClick={handleSearch}>
          Cerca
        </button>
      </div>
    </div>
  );
}
