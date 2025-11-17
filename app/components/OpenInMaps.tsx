"use client";
import { googleMapsLink, appleMapsLink } from "@/lib/mapLinks";

export default function OpenInMaps({ lat, lon, label }: { lat: number; lon: number; label: string; }) {
  return (
    <div className="flex gap-2 mt-2">
      <a href={googleMapsLink(lat, lon, label)} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-white/10 border border-white/20 text-sm">Apri in Google Maps</a>
      <a href={appleMapsLink(lat, lon, label)} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-white/10 border border-white/20 text-sm">Apri in Apple Maps</a>
    </div>
  );
}
