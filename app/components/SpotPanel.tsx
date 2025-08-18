"use client";

import type { Spot } from "../types";

type Props = {
  spot: Spot | null;
  onClose: () => void;
};

export default function SpotPanel({ spot, onClose }: Props) {
  if (!spot) return null;

  const maps = `https://www.google.com/maps?q=${spot.lat},${spot.lng}`;

  return (
    <aside
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 5000,
        width: 360,
        maxHeight: "calc(100vh - 2rem)",
        overflow: "auto",
        borderRadius: 16,
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: 16,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{spot.name}</div>
          <div style={{ fontSize: 12, opacity: 0.7, textTransform: "capitalize" }}>
            {spot.waterType}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Chiudi"
          style={{
            border: "none",
            background: "transparent",
            padding: "4px 6px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: 16, fontSize: 14 }}>
        <div style={{ marginBottom: 6 }}>
          <b>Altezza:</b> {spot.heightMeters} m
        </div>
        <div style={{ marginBottom: 6 }}>
          <b>Difficoltà:</b> {spot.difficulty}/5
        </div>
        <div style={{ marginBottom: 6 }}>
          <b>Rating:</b> {spot.rating.toFixed(1)}/5
        </div>
        <div style={{ marginBottom: 6 }}>
          <b>Stagione:</b> {spot.season}
        </div>
        {spot.warnings && (
          <div style={{ marginBottom: 6, color: "#92400e" }}>⚠️ {spot.warnings}</div>
        )}
        {spot.notes && <div style={{ opacity: 0.85 }}>{spot.notes}</div>}
      </div>

      <div style={{ padding: 16, borderTop: "1px solid #e5e7eb" }}>
        <a
          href={maps}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            background: "#2563eb",
            color: "#fff",
            padding: "10px 12px",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Apri in Google Maps
        </a>
      </div>
    </aside>
  );
}
