// app/components/SpotPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string | null;
};

type Props = {
  spot: any | null;
  onClose: () => void;
  onImageChanged?: (url: string) => void;
};

export default function SpotPanel({ spot, onClose, onImageChanged }: Props) {
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // carica commenti quando cambia spot
  useEffect(() => {
    (async () => {
      if (!spot?.id) {
        setComments([]);
        return;
      }
      const { data, error } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id")
        .eq("spot_id", spot.id)
        .order("created_at", { ascending: true });
      if (!error && data) setComments(data);
    })();
  }, [spot?.id]);

  if (!spot) return null;

  const img = spot.image_url || spot.image || null;

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const u = (await supabase.auth.getUser()).data.user;
    if (!u) {
      alert("Devi accedere per caricare immagini.");
      return;
    }

    const path = `${u.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("spot-covers").upload(path, file, { upsert: true });
    if (error) {
      alert(error.message);
      return;
    }
    const { data: pub } = supabase.storage.from("spot-covers").getPublicUrl(path);

    if (spot.id) {
      await supabase.from("spots").update({ image_url: pub.publicUrl }).eq("id", spot.id);
    }
    onImageChanged?.(pub.publicUrl);
  }

  async function addComment() {
    if (!newComment.trim()) return;
    const u = (await supabase.auth.getUser()).data.user;
    if (!u) {
      alert("Devi accedere per commentare.");
      return;
    }
    const payload = { spot_id: spot.id, user_id: u.id, content: newComment.trim() };
    const { data, error } = await supabase.from("comments").insert(payload).select("id, content, created_at, user_id").single();
    if (error) {
      alert(error.message);
      return;
    }
    setComments((prev) => [...prev, data as Comment]);
    setNewComment("");
  }

  const line: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 };

  return (
    <aside
      style={{
        position: "fixed",
        top: 100,
        right: 20,
        width: 360,
        zIndex: 6000,
        background: "white",
        borderRadius: 16,
        boxShadow: "0 12px 40px rgba(0,0,0,.25)",
        overflow: "hidden",
        maxHeight: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {img ? (
        <img src={img} alt={spot.name ?? "spot"} style={{ width: "100%", height: 180, objectFit: "cover" }} />
      ) : (
        <div
          style={{
            width: "100%",
            height: 180,
            background: "linear-gradient(135deg,#dbeafe,#e5e7eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "#0B2A4A",
          }}
        >
          Nessuna immagine
        </div>
      )}

      <div style={{ padding: 16, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800 }}>{spot.name ?? "Spot"}</h3>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "white",
              borderRadius: 10,
              padding: "6px 10px",
              fontWeight: 700,
            }}
          >
            Chiudi
          </button>
        </div>

        <div style={line}>
          <div className="text-sm opacity-60">Posizione</div>
          <div className="text-sm">
            {Number(spot.lat).toFixed?.(6) ?? spot.lat}, {Number(spot.lon ?? spot.lng).toFixed?.(6) ?? spot.lon}
          </div>
        </div>

        <div style={line}>
          <div className="text-sm opacity-60">Tipo acqua</div>
          <div className="text-sm">{spot.waterType ?? spot.water_type ?? "-"}</div>
        </div>

        <div style={line}>
          <div className="text-sm opacity-60">Difficoltà</div>
          <div className="text-sm">{spot.difficulty ?? "-"}</div>
        </div>

        <div style={line}>
          <div className="text-sm opacity-60">Rating</div>
          <div className="text-sm">{spot.rating ?? "-"}</div>
        </div>

        {spot.warnings ? (
          <div style={line}>
            <div className="text-sm opacity-60">Avvertenze</div>
            <div className="text-sm">{spot.warnings}</div>
          </div>
        ) : null}

        {spot.notes ? (
          <div style={line}>
            <div className="text-sm opacity-60">Note</div>
            <div className="text-sm">{spot.notes}</div>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <label
            style={{
              border: "1px solid rgba(14,58,101,.2)",
              background: "#0E3A65",
              color: "white",
              fontWeight: 700,
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Carica foto
            <input type="file" accept="image/*" onChange={uploadCover} style={{ display: "none" }} />
          </label>
        </div>

        {/* Commenti */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Commenti</div>
          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            {comments.length === 0 ? (
              <div style={{ fontSize: 13, opacity: 0.7 }}>Ancora nessun commento.</div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: "1px solid #eef2f7",
                    borderRadius: 10,
                    padding: "8px 10px",
                    background: "#fafbfc",
                  }}
                >
                  <div style={{ fontSize: 13 }}>{c.content}</div>
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* form nuovo commento */}
          <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Aggiungi un commento (max 1000 caratteri)"
              maxLength={1000}
              rows={3}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
            />
            <button
              onClick={addComment}
              style={{
                border: "1px solid rgba(14,58,101,.2)",
                background: "#0E3A65",
                color: "white",
                fontWeight: 800,
                borderRadius: 10,
                padding: "8px 12px",
                justifySelf: "end",
              }}
            >
              Pubblica
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
