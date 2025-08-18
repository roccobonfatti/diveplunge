"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Spot } from "../types";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Props = {
  center: [number, number];
  zoom?: number;
  spots: Spot[];
  onSpotClick: (spot: Spot) => void;
};

export default function Map({ center, zoom = 6, spots, onSpotClick }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
      className="relative z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={defaultIcon}
          eventHandlers={{ click: () => onSpotClick(s) }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-medium">{s.name}</div>
              <div className="opacity-70 capitalize">{s.waterType}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
