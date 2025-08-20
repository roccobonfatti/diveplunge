"use client";

import type { Spot } from "../types";

type Props = {
  spot: Spot | null;
  onClose: () => void;
};

export default function SpotPanel({ spot, onClose }: Props) {
  if (!spot) return null;

  // uso "any" per essere flessibili con i campi presenti nel tuo Spot reale
  const s: any = spot;

  const name: string =
    s.name || s.title || s.spotName || "Spot senza nome";

  const country: string =
    s.country || s.nation || s.state || "";

  const lat: number | undefined = s.lat ?? s.latitude;
  const lon: number | undefined = s.lon ?? s.longitude;

  const waterType: string = s.waterType || s.type || "-";
  const difficulty: string =
    s.difficulty?.toString?.() || s.diff?.toString?.() || "-";
  const rating: string =
    s.rating?.toString?.() || s.stars?.toString?.() || "-";
  const height: string =
    (s.height && `${s.height} m`) || (s.drop && `${s.drop} m`) || "-";
  const season: string = s.season || s.bestSeason || "-";
  const danger: string =
    typeof s.danger === "boolean"
      ? s.danger ? "Yes" : "None"
      : s.danger || "None";
  const warnings: string = s.warnings || s.notesWarn || "-";
  const notes: string = s.notes || s.description || "-";

  const imgUrl: string =
    s.imageUrl ||
    s.photo ||
    s.img ||
    // placeholder carino se manca l'immagine
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1600&auto=format&fit=crop";

  function openMaps() {
    if (typeof lat === "number" && typeof lon === "number") {
      window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
    }
  }

  const wrap: React.CSSProperties = {
    position: "fixed",
    top: 88, // sotto l'header
    right: 16,
    bottom: 16,
    width: 380,
    maxWidth: "calc(100% - 32px)",
    zIndex: 3000,
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,.18)",
  };

  const headerImg: React.CSSProperties = {
    width: "100%",
    height: 200,
    objectFit: "cover",
  };

  const body: React.CSSProperties = {
    padding: 16,
    overflow: "auto",
  };

  const title: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    margin: "6px 0 4px",
  };

  const subtitle: React.CSSProperties = {
    color: "#4a5568",
    fontSize: 13,
    marginBottom: 12,
  };

  const row: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 10,
  };

  const label: React.CSSProperties = {
    color: "#718096",
    fontSize: 12,
    marginBottom: 4,
  };

  const value: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
  };

  const btnRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    marginTop: 16,
  };

  const btnPrimary: React.CSSProperties = {
    flex: 1,
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(9,60,120,0.15)",
    background: "linear-gradient(180deg, #0E66C2, #0A53A1)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  };

  const btnGhost: React.CSSProperties = {
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    color: "#1a202c",
    padding: "0 14px",
    fontWeight: 600,
    cursor: "pointer",
  };

  const closeX: React.CSSProperties = {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    cursor: "pointer",
    fontWeight: 800,
  };

  return (
    <aside style={wrap}>
      <button style={closeX} onClick={onClose} aria-label="Chiudi">
        ×
      </button>

      <img src={imgUrl} alt={name} style={headerImg} />

      <div style={body}>
        <div style={title}>{name}</div>
        <div style={subtitle}>
          {country && `${country} • `}
          {typeof lat === "number" && typeof lon === "number"
            ? `${lat.toFixed(5)}, ${lon.toFixed(5)}`
            : "coordinate n/d"}
        </div>

        {/* blocco 1 */}
        <div style={row}>
          <div>
            <div style={label}>Difficulty</div>
            <div style={value}>{difficulty}</div>
          </div>
          <div>
            <div style={label}>Danger</div>
            <div style={value}>{danger}</div>
          </div>
        </div>

        {/* blocco 2 */}
        <div style={row}>
          <div>
            <div style={label}>Season</div>
            <div style={value}>{season}</div>
          </div>
          <div>
            <div style={label}>Height</div>
            <div style={value}>{height}</div>
          </div>
        </div>

        {/* blocco 3 */}
        <div style={{ marginTop: 12 }}>
          <div style={label}>Warnings</div>
          <div style={value} title={warnings} style={{...value, fontWeight:500}}>
            {warnings}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={label}>Notes</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            {notes}
          </div>
        </div>

        <div style={btnRow}>
          <button style={btnPrimary} onClick={openMaps}>
            Apri in Google Maps
          </button>
          <button
            style={btnGhost}
            onClick={() => alert("Upload: da collegare allo storage")}
          >
            Upload
          </button>
        </div>
      </div>
    </aside>
  );
}
