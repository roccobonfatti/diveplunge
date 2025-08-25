"use client";

import { useEffect, useRef, useState } from "react";
// NOTE: se nel tuo progetto lib/supabase esporta default, questa import va bene.
// Se invece esporta { supabase } nominale, cambia in:  import { supabase } from "../lib/supabase";
import supabase from "../lib/supabase";

export const HEADER_HEIGHT = 88;

type Props = {
  onCreateSpot?: () => void;   // apre form "Crea spot" (la guardia login è in page.tsx)
  onLogin?: () => void;        // azione “Accedi / Registrati”
};

export default function Header({ onCreateSpot, onLogin }: Props) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ---- stato auth + nome visualizzato ----
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u) {
        setUserEmail(u.email ?? null);
        const nameFromMeta =
          (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || null;
        const nameFromEmail = u.email ? u.email.split("@")[0] : null;
        setDisplayName(nameFromMeta || nameFromEmail || "Utente");
      } else {
        setUserEmail(null);
        setDisplayName(null);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      if (u) {
        setUserEmail(u.email ?? null);
        const nameFromMeta =
          (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || null;
        const nameFromEmail = u.email ? u.email.split("@")[0] : null;
        setDisplayName(nameFromMeta || nameFromEmail || "Utente");
      } else {
        setUserEmail(null);
        setDisplayName(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // chiudi menu clic fuori
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const wrap: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    background: "linear-gradient(180deg, #0B2A4A 0%, #0E3A65 100%)",
    color: "#E6F0FA",
    zIndex: 5000,
    boxShadow: "0 2px 20px rgba(0,0,0,.25)",
  };

  const inner: React.CSSProperties = {
    position: "relative",
    height: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  };

  const brandLeft: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 26,
    letterSpacing: 0.2,
    color: "#E8F1FF",
    textTransform: "lowercase",
  };

  const centerBox: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "none",
  };

  const title: React.CSSProperties = {
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: 0.5,
    color: "#FFFFFF",
    lineHeight: 1,
    textTransform: "lowercase",
  };

  const slogan: React.CSSProperties = {
    marginTop: 4,
    fontSize: 18,
    opacity: 0.95,
  };

  const rightBtn: React.CSSProperties = {
    color: "#D6E8FF",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    padding: "8px 12px 8px 8px", // lasciamo spazio per l'avatar
    borderRadius: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const avatar: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(230,240,250,.9), rgba(255,255,255,.5))",
    color: "#0B2A4A",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontSize: 13,
    boxShadow: "0 1px 2px rgba(0,0,0,.25) inset",
  };

  const menu: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: HEADER_HEIGHT - 6,
    background: "white",
    color: "#0B2A4A",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    minWidth: 260,
    overflow: "hidden",
  };

  const item: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "1px solid #eef2f7",
    userSelect: "none",
  };

  const headerItem: React.CSSProperties = {
    padding: "12px 14px",
    borderBottom: "1px solid #eef2f7",
    background: "#f7fafc",
  };

  // iniziale nell'avatar
  const initial =
    (displayName && displayName[0]?.toUpperCase()) ||
    (userEmail && userEmail[0]?.toUpperCase()) ||
    "U";

  return (
    <header style={wrap}>
      <div style={inner}>
        <div style={brandLeft}>diveplunge</div>

        <div style={centerBox}>
          <div style={title}>diveplunge</div>
          <div style={slogan}>Breath. Jump. Live.</div>
        </div>

        <div ref={menuRef} style={{ position: "relative" }}>
          <button style={rightBtn} onClick={() => setOpen((v) => !v)}>
            {/* avatar a sinistra del testo "Profilo" (solo se loggato) */}
            {userEmail ? <div style={avatar}>{initial}</div> : null}
            <span>Profilo</span>
          </button>

          {open && (
            <div style={menu}>
              {!userEmail ? (
                // Non loggato: una sola voce per accedere/registrarsi
                <div
                  style={{ ...item, borderBottom: "none" }}
                  onClick={() => {
                    setOpen(false);
                    onLogin?.();
                  }}
                >
                  🔐 Accedi / Registrati
                </div>
              ) : (
                <>
                  {/* PRIMA RIGA: nome utente */}
                  <div style={headerItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ ...avatar, width: 36, height: 36, fontSize: 16 }}>
                        {initial}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>{displayName}</div>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>{userEmail}</div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={item}
                    onClick={() => {
                      setOpen(false);
                      onCreateSpot?.();
                    }}
                  >
                    ➕ Crea spot
                  </div>
                  <div style={item} onClick={() => alert("Preferiti in arrivo")}>
                    ⭐ Preferiti
                  </div>
                  <div style={item} onClick={() => alert("Impostazioni in arrivo")}>
                    ⚙️ Impostazioni
                  </div>
                  <div
                    style={{ ...item, borderBottom: "none", color: "#B00020" }}
                    onClick={async () => {
                      await logout();
                    }}
                  >
                    ⎋ Esci
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
