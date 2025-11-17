"use client";

import { useEffect, useState } from "react";
import type { Spot } from "../types";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import OpenInMaps from "@/components/OpenInMaps";

type Props = { spot: Spot | null; onClose: () => void; };

type Comment = {
  id: string;
  spot_id: string | number;
  user_id: string;
  content: string;
  created_at: string;
};

export default function SpotPanel({ spot, onClose }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: s } = await supabase.auth.getUser();
      setMe(s.user?.id ?? null);
    };
    init();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!spot) return;
      const { data, error } = await supabase
        .from("spot_comments")
        .select("id, spot_id, user_id, content, created_at")
        .eq("spot_id", spot.id)
        .order("created_at", { ascending: false });
      if (!error && data) setComments(data as Comment[]);
    };
    load();
  }, [spot?.id]);

  const addComment = async () => {
    if (!spot || !text.trim()) return;
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { location.assign("/auth?next=/"); return; }
    const { error } = await supabase.from("spot_comments").insert({
      spot_id: spot.id,
      user_id: user.user.id,
      content: text.trim(),
    });
    if (!error) {
      setText("");
      const { data } = await supabase
        .from("spot_comments")
        .select("*")
        .eq("spot_id", spot.id)
        .order("created_at", { ascending: false });
      setComments((data as Comment[]) || []);
    }
  };

  if (!spot) return null;

  const lat = Number(spot.lat);
  const lon = Number(spot.lon ?? spot.lng);

  return (
    <aside
      style={{
        position: "fixed",
        right: 16, top: "calc(var(--header-h) + 16px)", bottom: 16,
        width: 360, background: "#fff", borderRadius: 16,
        boxShadow: "0 16px 42px rgba(0,0,0,.22)", zIndex: 6, overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ padding: 16, borderBottom: "1px solid #eef2fb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{spot.name}</div>
        <button onClick={onClose} style={{ border: 0, background: "transparent", cursor: "pointer", fontWeight: 700 }}>Chiudi</button>
      </div>

      <div style={{ padding: 16, overflow: "auto" }}>
        <DL label="Posizione" value={`${lat}, ${lon}`} />
        <DL label="Tipo acqua" value={spot.waterType ?? spot.water_type} />
        <DL label="Difficoltà" value={String(spot.difficulty ?? "-")} />
        <DL label="Rating" value={String(spot.rating ?? "-")} />
        <DL label="Altezza (m)" value={String(spot.heightMeters ?? "-")} />
        <DL label="Stagione" value={spot.season ?? "-"} />
        {spot.warnings && <DL label="Avvertenze" value={spot.warnings} />}
        {spot.notes && <DL label="Note" value={spot.notes} />}

        {Number.isFinite(lat) && Number.isFinite(lon) && (
          <OpenInMaps lat={lat} lon={lon} label={spot.name ?? "Spot"} />
        )}

        <div className="dp-divider" style={{ margin: "14px 0", height: 1, background: "#eef2fb" }} />

        <div style={{ fontWeight: 800, marginBottom: 8 }}>Commenti</div>

        {me ? (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Scrivi un commento…"
              style={{ flex: 1, border: "1px solid #d7e2f3", borderRadius: 10, padding: "8px 10px" }}
            />
            <button onClick={addComment} style={{ background: "#0E3A65", color: "#fff", border: 0, borderRadius: 10, padding: "8px 12px", cursor: "pointer" }}>
              Invia
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: 12 }}>
            <Link href="/auth">Accedi</Link> per commentare.
          </div>
        )}

        {comments.length === 0 ? (
          <div style={{ opacity: .7 }}>Ancora nessun commento.</div>
        ) : (
          comments.map((c) => (
            <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #eef2fb" }}>
              <div style={{ fontSize: 12, opacity: .6 }}>{new Date(c.created_at).toLocaleString()}</div>
              <div>{c.content}</div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function DL({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ margin: "8px 0" }}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: .3, opacity: .7 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value ?? "-"}</div>
    </div>
  );
}
