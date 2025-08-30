// app/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export const HEADER_HEIGHT = 88;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setEmail(sess?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const avatarLetter = useMemo(
    () => (email ? email[0].toUpperCase() : "•"),
    [email]
  );

  const wrap: React.CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0,
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

  const centerBox: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "none",
  };

  return (
    <header style={wrap}>
      <div style={inner}>
        <div style={{ fontWeight: 800, fontSize: 26, color: "#E8F1FF" }}>
          diveplunge
        </div>

        <div style={centerBox}>
          <div style={{ fontWeight: 900, fontSize: 32, color: "#fff", lineHeight: 1 }}>
            diveplunge
          </div>
          <div style={{ marginTop: 6, fontSize: 22, opacity: .95 }}>
            Breath. Jump. Live.
          </div>
        </div>

        {/* Avatar + Profilo */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#D6E8FF",
              padding: "6px 10px",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#164d7b",
                display: "grid", placeItems: "center",
                fontWeight: 800, color: "#fff",
              }}
              aria-hidden
            >
              {avatarLetter}
            </span>
            <span>Profilo</span>
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute", right: 0, marginTop: 8, zIndex: 6000,
                width: 230, background: "#fff", borderRadius: 12,
                boxShadow: "0 12px 32px rgba(0,0,0,.2)", color: "#0b1a2b",
                padding: 8
              }}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div style={{ padding: "10px 12px", fontWeight: 700 }}>
                {email ?? "Ospite"}
              </div>
              <div className="dp-divider" />
              {email ? (
                <>
                  <Link href="/create" className="menu-item" style={itemStyle}>Crea spot</Link>
                  <Link href="#" className="menu-item" style={itemStyle}>Preferiti</Link>
                  <Link href="#" className="menu-item" style={itemStyle}>Impostazioni</Link>
                  <div className="dp-divider" />
                  <button
                    onClick={async () => { await supabase.auth.signOut(); location.reload(); }}
                    style={{ ...itemStyle, width: "100%", textAlign: "left", background: "transparent", border: 0, cursor: "pointer" }}
                  >
                    Esci
                  </button>
                </>
              ) : (
                <Link href="/auth" className="menu-item" style={itemStyle}>Accedi / Registrati</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const itemStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: "#0b1a2b",
};
