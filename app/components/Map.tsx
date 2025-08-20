"use client";

import { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** --------------------- helpers coordinate robuste --------------------- */
function num(v: any): number | null {
  if (v == null) return null;
  const n = typeof v === "string" ? Number(v.trim()) : Number(v);
  return Number.isFinite(n) ? n : null;
}

function pick(obj: any, candidates: string[]): any {
  for (const k of candidates) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) {
      return obj[k];
    }
  }
  return undefined;
}

function getCoords(s: any): [number, number] | null {
  if (!s) return null;

  // 1) Array tipo [lat, lon]
  const arr = (s.position ?? s.coords ?? s.location) as any;
  if (Array.isArray(arr) && arr.length >= 2) {
    const lat = num(arr[0]);
    const lon = num(arr[1]);
    if (lat != null && lon != null) return [lat, lon];
  }

  // 2) Oggetto annidato con lat/lon(lng/long/longitude)
  const obj =
    (typeof (s.position ?? s.coords ?? s.location) === "object" &&
      (s.position ?? s.coords ?? s.location)) ||
    s;

  const latRaw =
    pick(obj, ["lat", "latitude", "Lat", "LAT", "y", "Y"]) ??
    pick(s, ["lat", "latitude"]);
  const lonRaw =
    pick(obj, ["lon", "lng", "long", "longitude", "Lon", "LON", "x", "X"]) ??
    pick(s, ["lon", "lng", "long", "longitude"]);

  const lat = num(latRaw);
  const lon = num(lonRaw);

  if (lat != null && lon != null) return [lat, lon];

  return null;
}

/** ------------------------- stile icona pin ---------------------------- */
function waterColor(type: string): string {
  switch ((type || "").toLowerCase()) {
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

/** ------------------------------ props -------------------------------- */
type Spot = {
  id?: string | number;
  name?: string;
  waterType?: string;
  lat?: number | string;
  lon?: number | string;
  lng?: number | string;
  long?: number | string;
  rating?: number;
  difficulty?: number;
  // …qualsiasi altro campo
  [k: string]: any;
};

type Props = {
  center: [number, number];
  spots: Spot[];
  onSpotClick?: (s: Spot) => void;
};

/** ---------------------------- componente ------------------------------ */
export default function Map({ center, spots, onSpotClick }: Props) {
  // Log di controllo per capire se arrivano spot e quali sono rotti
  useEffect(() => {
    if (!Array.isArray(spots)) {
      console.error("Map: 'spots' non è un array:", spots);
      return;
    }
    const invalid = spots.filter((s) => !getCoords(s));
    if (invalid.length) {
      console.warn(
        `Map: ${invalid.length} spot con coordinate non valide (verranno ignorati):`,
        invalid.slice(0, 5) // mostra i primi 5
      );
    }
  }, [spots]);

  const markers = useMemo(() => {
    if (!Array.isArray(spots)) return [];
    return spots
      .map((s) => {
        const coords = getCoords(s);
        if (!coords) return null;

        const base = 28;
        const add =
          (typeof s.rating === "number" ? Math.min(Math.max(s.rating, 1), 5) - 3 : 0) * 2 +
          (typeof s.difficulty === "number" ? (s.difficulty - 3) * 1 : 0);
        const size = Math.max(22, Math.min(base + add, 36));

        return {
          s,
          coords,
          icon: makePin(waterColor(s.waterType ?? ""), size),
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
      zoom={5}
      minZoom={2}
      className="w-screen h-screen"
      style={{ background: "#cfe8ff" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((m) => (
        <Marker
          key={(m.s.id as string) ?? `${m.coords[0]}-${m.coords[1]}-${m.s.name ?? "spot"}`}
          position={m.coords}
          icon={m.icon}
          eventHandlers={{ click: () => onSpotClick?.(m.s) }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{m.s.name ?? "Spot"}</div>
              <div className="opacity-70 capitalize">{m.s.waterType ?? "any"}</div>
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
