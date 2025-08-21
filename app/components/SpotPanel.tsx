"use client";

import React from "react";
import type { Spot } from "../types";

type Props = {
  spot: Spot | null;
  onClose: () => void;
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
    heightMeters,
  } = spot;

  const wrap: React.CSSProperties = {
    position: "fixed",
    top: 100, // sotto l’header
    right: 16,
    width: 360,
    maxWidth: "calc(100% - 32px)",
    zIndex: 4000,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 12px 28px rgba(0,0,0,.18)",
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,.06)",
  };

  const head: React.CSSProperties = {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(0,0,0,.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  };

  const title: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.2,
  };

  const closeBtn: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,.12)",
    background: "#f7f7f7",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  };

  const body: React.CSSProperties = {
    padding: 16,
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#667085",
  };

  const valueCss: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
  };

  const row: React.CSSProperties = { marginTop: 12 };

  const coordLine =
    (country ? `${country} – ` : "") +
    `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

  return (
    <aside style={wrap} aria-label="Spot details panel">
      <div style={head}>
        <div style={title}>{name}</div>
        <button type="button" onClick={onClose} style={closeBtn}>
          Chiudi
        </button>
      </div>

      <div style={body}>
        <div style={row}>
          <div style={label}>Posizione</div>
          <div style={valueCss} title={coordLine}>
            {coordLine}
          </div>
        </div>

        <div style={row}>
          <div style={label}>Tipo acqua</div>
          <div style={valueCss}>{waterType}</div>
        </div>

        {typeof difficulty === "number" && (
          <div style={row}>
            <div style={label}>Difficoltà</div>
            <div style={valueCss}>{difficulty}</div>
          </div>
        )}

        {typeof rating === "number" && (
          <div style={row}>
            <div style={label}>Rating</div>
            <div style={valueCss}>{rating}</div>
          </div>
        )}

        {typeof heightMeters === "number" && (
          <div style={row}>
            <div style={label}>Altezza (m)</div>
            <div style={valueCss}>{heightMeters}</div>
          </div>
        )}

        {season && (
          <div style={row}>
            <div style={label}>Stagione</div>
            <div style={valueCss}>{season}</div>
          </div>
        )}

        {warnings && (
          <div style={row}>
            <div style={label}>Avvertenze</div>
            <div style={valueCss} title={warnings}>
              {warnings}
            </div>
          </div>
        )}

        {notes && (
          <div style={row}>
            <div style={label}>Note</div>
            <div style={valueCss}>{notes}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
