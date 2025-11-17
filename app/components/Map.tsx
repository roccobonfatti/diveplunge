// app/components/Map.tsx
"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Spot } from "../types";

/* ---------- helpers coord ---------- */
function num(v: any): number | null {
  if (v == null) return null;
  const n = typeof v === "string" ? Number(v.trim()) : Number(v);
  return Number.isFinite(n) ? n : null;
}
function pick(obj: any, keys: string[]) {
  for (const k of keys) if (obj?.[k] != null) return obj[k];
  return undefined;
}
function getCoords(s: any): [number, number] | null {
  const arr = (s.position ?? s.coords ?? s.location) as any;
  if (Array.isArray(arr) && arr.length >= 2) {
    const lat = num(arr[0]);
    const lon = num(arr[1]);
    if (lat != null && lon != null) return [lat, lon];
  }
  const src =
    (typeof (s.position ?? s.coords ?? s.location) === "object" &&
      (s.position ?? s.coords ?? s.location)) ||
    s;
  const lat = num(pick(src, ["lat", "latitude", "Lat", "y", "Y"]));
  const lon = num(pick(src, ["lon", "lng", "long", "longitude", "x", "X"]));
  if (lat != null && lon != null) return [lat, lon];
  return null;
}

/* ---------- pin ---------- */
function waterColor(t?: string) {
  switch ((t || "").toLowerCase()) {
    case "sea":
      return "#1e88e5";
    case "river":
      return "#00b8a9";
    case "lake":
      return "#2e7d32";
    default:
      return "#4f46e5";
  }
}
function makePin(color: string, size = 28): L.DivIcon {
  const r = Math.round(size * 0.28);
  const svg = `
    <svg width="${size}" height="${size * 1.35}" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"
      style="display:block; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35));">
      <path d="M12 0C6.48 0 2 4.48 2 10c0 7.14 9.12 21.5 9.12 21.5s.3.5.88.5.88-.5.88-.5S22 17.14 22 10C22 4.48 17.52 0 12 0z"
            fill="${color}" stroke="white" stroke-width="1.2" />
      <circle cx="12" cy="10" r="${r}" fill="white" opacity="0.9"/>
    </svg>
  `.trim();

  return L.divIcon({
    className: "dp-pin",
    html: svg,
    iconSize: [size, size * 1.35],
    iconAnchor: [size / 2, size * 1.35],
    popupAnchor: [0, -size * 1.0],
  });
}

/* ---------- right click catcher ---------- */
function RightClickCatcher({
  onRequestCreate,
}: {
  onRequestCreate?: (lat: number, lon: number) => void;
}) {
  useMapEvent("contextmenu", (e) => {
    onRequestCreate?.(e.latlng.lat, e.latlng.lng);
  });
  return null;
}

/* ---------- follow center/zoom ---------- */
function FollowCenter({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    const z = typeof zoom === "number" ? zoom : map.getZoom();
    map.flyTo(center, z, { duration: 0.6 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

/* ---------- controlli bottom-center (nascosti su mobile) ---------- */
function PanZoomControls() {
  const map = useMap();
  const step = 150; // pixel di pan

  return (
    <>
      <div className="dp-ctrls hidden md:block" aria-label="Controlli mappa">
        {/* riga TOP */}
        <div className="dp-ctrls-row top center">
          <button
            className="dp-arrow"
            onClick={() => map.panBy([0, -step])}
            aria-label="Su"
            title="Su"
          >
            ↑
          </button>
        </div>

        {/* riga centrale */}
        <div className="dp-ctrls-row mid">
          <button
            className="dp-arrow"
            onClick={() => map.panBy([-step, 0])}
            aria-label="Sinistra"
            title="Sinistra"
          >
            ←
          </button>

          {/* Ovale zoom */}
          <div className="dp-zoom-oval" aria-hidden="true">
            <svg viewBox="0 0 100 68" width="100%" height="100%">
              <defs>
                <filter id="dpShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(13,25,51,0.26)" />
                </filter>
              </defs>
              <ellipse
                cx="50" cy="34" rx="49" ry="32"
                fill="rgba(14,58,101,0.58)"
                stroke="rgba(0,0,0,0.55)"
                strokeWidth="2"
                filter="url(#dpShadow)"
              />
              <line x1="12" x2="88" y1="34" y2="34" stroke="black" strokeOpacity="0.7" strokeWidth="2" />
              <text x="50" y="19" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="900" fill="#fff">+</text>
              <text x="50" y="49" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="900" fill="#fff">−</text>
            </svg>

            {/* aree cliccabili */}
            <button className="hit top" aria-label="Zoom in" title="Zoom in" onClick={() => map.setZoom(map.getZoom() + 1)} />
            <button className="hit bottom" aria-label="Zoom out" title="Zoom out" onClick={() => map.setZoom(map.getZoom() - 1)} />
          </div>

          <button
            className="dp-arrow"
            onClick={() => map.panBy([step, 0])}
            aria-label="Destra"
            title="Destra"
          >
            →
          </button>
        </div>

        {/* riga BOTTOM */}
        <div className="dp-ctrls-row bottom center">
          <button
            className="dp-arrow"
            onClick={() => map.panBy([0, step])}
            aria-label="Giù"
            title="Giù"
          >
            ↓
          </button>
        </div>
      </div>

      {/* --- STILI --- */}
      <style jsx>{`
        .dp-ctrls {
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          z-index: 4000;
          user-select: none;
        }
        .dp-ctrls-row { display: flex; align-items: center; justify-content: center; }
        .dp-ctrls-row.mid { gap: 4px; }
        .dp-ctrls-row.top { margin: 0 0 4px 0; }
        .dp-ctrls-row.bottom { margin: 4px 0 0 0; }

        .dp-arrow {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: rgba(14, 58, 101, 0.92);
          color: #fff;
          border: 1px solid rgba(0, 0, 0, 0.25);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
          font-size: 16px;
          font-weight: 900;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .dp-arrow:active { transform: translateY(1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); }

        .dp-zoom-oval { position: relative; width: 84px; height: 58px; }
        .dp-zoom-oval svg { display: block; }
        .dp-zoom-oval .hit {
          position: absolute; left: 0; right: 0; height: 50%;
          background: transparent; border: 0; cursor: pointer;
        }
        .dp-zoom-oval .hit.top { top: 0; }
        .dp-zoom-oval .hit.bottom { bottom: 0; }
      `}</style>
    </>
  );
}

/* ---------- props ---------- */
type Props = {
  center: [number, number];
  zoom?: number;
  spots: Spot[];
  onSpotClick?: (s: Spot) => void;
  onRequestCreate?: (lat: number, lon: number) => void;
};

export default function Map({
  center,
  zoom,
  spots,
  onSpotClick,
  onRequestCreate,
}: Props) {
  const markers = useMemo(() => {
    return (spots || [])
      .map((s) => {
        const coords = getCoords(s);
        if (!coords) return null;
        const base = 28;
        const add =
          (typeof s.rating === "number"
            ? Math.min(Math.max(s.rating, 1), 5) - 3
            : 0) *
            2 +
          (typeof s.difficulty === "number" ? (s.difficulty - 3) * 1 : 0);
        const size = Math.max(22, Math.min(base + add, 36));
        return {
          s,
          coords,
          icon: makePin(waterColor(s.waterType ?? s.water_type), size),
        };
      })
      .filter(Boolean) as Array<{
      s: Spot;
      coords: [number, number];
      icon: L.DivIcon;
    }>;
  }, [spots]);

  return (
    <MapContainer
      center={center}
      zoom={typeof zoom === "number" ? zoom : 5}
      minZoom={2}
      style={{ width: "100%", height: "100%", background: "#cfe8ff" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FollowCenter center={center} zoom={zoom} />
      <RightClickCatcher onRequestCreate={onRequestCreate} />
      <PanZoomControls />

      {markers.map((m) => (
        <Marker
          key={
            (m.s.id as string) ??
            `${m.coords[0]}-${m.coords[1]}-${m.s.name ?? "spot"}`
          }
          position={m.coords}
          icon={m.icon}
          eventHandlers={{ click: () => onSpotClick?.(m.s) }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{m.s.name ?? "Spot"}</div>
              <div className="opacity-70 capitalize">
                {m.s.waterType ?? m.s.water_type ?? "any"}
              </div>
              <div className="opacity-60 text-xs">
                {m.coords[0].toFixed(5)}, {m.coords[1].toFixed(5)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
