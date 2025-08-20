"use client";

import React from "react";
import type { Spot } from "../types";

type Props = {
  spot: Spot | null;
  onClose: () => void;
};

const wrap: React.CSSProperties = {
  position: "fixed",
  top: 88, // sotto l'header
  right: 16,
  bottom: 16,
  width: 360,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,.18)",
  zIndex: 4000,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const headerImg: React.CSSProperties = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  display: "block",
  background: "#eaeaea",
};

const content: React.CSSProperties = {
  padding: 16,
  overflow: "auto",
  flex: 1,
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.2,
  marginBottom: 4,
};

const sub: React.CSSProperties = {
  fontSize: 12,
  color: "#667085",
};

const row: React.CSSProperties = {
  marginTop: 12,
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
};

const value: React.CSSProperties = {
  fontSize: 14,
  color: "#111827",
};

const footer: React.CSSProperties = {
  padding: 12,
  borderTop: "1px solid #eef2f7",
  display: "flex",
  gap: 8,
};

const btn: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 10,
  fontWeight: 600,
  border: "1px solid #d0d7e2",
  background: "#fff",
  cursor: "pointer",
};

export default function SpotPanel({ spot, onClose }: Props) {
  if (!spot) return null;

  const {
    name,
    country,
    lat,
    lon,
    waterType,
    difficulty,
    rating,
    season,
    warnings,
    notes,
    photo,
  } = spot as Spot;

  return (
    <aside style={wrap}>
      {/* immagine */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={name ?? "photo"}
        src={photo ?? "/vercel.svg"}
        style={headerImg}
      />

      <div style={content}>
        <div style={title}>{name ?? "Spot"}</div>
        <div style={sub}>
          {(country ?? "Italy") + " "}
          {lat != null && lon != null ? `• ${lat}, ${lon}` : ""}
        </div>

        <div style={row}>
          <div style={label}>Water</div>
          <div style={value}>{waterType ?? "—"}</div>
        </div>

        <div style={row}>
          <div style={label}>Difficulty</div>
          <div style={value}>{difficulty ?? "—"}</div>
        </div>

        <div style={row}>
          <div style={label}>Rating</div>
          <div style={value}>{rating ?? "—"}</div>
        </div>

        <div style={row}>
          <div style={label}>Season</div>
          <div style={value}>{season ?? "—"}</div>
        </div>

        <div style={row}>
          <div style={label}>Warnings</div>
          {/* QUI il fix: un solo style, unito */}
          <div style={{ ...value, fontWeight: 500 }} title={warnings ?? ""}>
            {warnings ?? "—"}
          </div>
        </div>

        <div style={row}>
          <div style={label}>Notes</div>
          <div style={value}>{notes ?? "—"}</div>
        </div>
      </div>

      <div style={footer}>
        <button style={btn} onClick={onClose}>
          Close
        </button>
        <button style={{ ...btn, background: "#0b2a4a", color: "#fff" }}>
          Add to My Visits
        </button>
      </div>
    </aside>
  );
}
