"use client";

import { useRef } from "react";
import type { WaterType } from "../types";

type Props = {
  onSearchPlace: (q: string) => void;
  onFilterType?: (t: WaterType) => void;
  onMinDiff?: (d: number) => void;
  onMinRating?: (r: number) => void;
};

export default function TopBar({
  onSearchPlace,
  onFilterType,
  onMinDiff,
  onMinRating,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 88 + 12, // sotto l’header
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 6000, // >>> alto
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          pointerEvents: "auto",
          background: "rgba(255,255,255,.92)",
          border: "1px solid rgba(0,0,0,.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,.12)",
          padding: 8,
          borderRadius: 12,
          backdropFilter: "saturate(1.2) blur(4px)",
        }}
      >
        <input
          ref={inputRef}
          placeholder="Cerca città o luogo (es. Cagliari)…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputRef.current) {
              onSearchPlace(inputRef.current.value);
            }
          }}
          style={{
            width: 480,
            padding: "10px 12px",
            border: "1px solid #d0d7e2",
            borderRadius: 10,
          }}
        />

        <select
          onChange={(e) => onFilterType?.(e.target.value as WaterType)}
          defaultValue={"all"}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #d0d7e2" }}
        >
          <option value="all">Tutte le acque</option>
          <option value="sea">Mare</option>
          <option value="river">Fiume</option>
          <option value="lake">Lago</option>
        </select>

        <select
          onChange={(e) => onMinDiff?.(parseInt(e.target.value, 10))}
          defaultValue={1}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #d0d7e2" }}
        >
          <option value="1">Diff ≥ 1</option>
          <option value="2">Diff ≥ 2</option>
          <option value="3">Diff ≥ 3</option>
          <option value="4">Diff ≥ 4</option>
          <option value="5">Diff ≥ 5</option>
        </select>

        <select
          onChange={(e) => onMinRating?.(parseInt(e.target.value, 10))}
          defaultValue={1}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #d0d7e2" }}
        >
          <option value="1">Rating ≥ 1</option>
          <option value="2">Rating ≥ 2</option>
          <option value="3">Rating ≥ 3</option>
          <option value="4">Rating ≥ 4</option>
          <option value="5">Rating ≥ 5</option>
        </select>

        <button
          onClick={() => inputRef.current && onSearchPlace(inputRef.current.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "#0E3A65",
            color: "white",
            fontWeight: 700,
            border: "none",
          }}
        >
          Cerca
        </button>
      </div>
    </div>
  );
}
