// app/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const HEADER_HEIGHT = 88;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<null | { email?: string }>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user ?? null;
      setUser(u as any);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser((s?.user as any) ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

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
  };

  const slogan: React.CSSProperties = {
    marginTop: 4,
    fontSize: 16, // un po' più grande
    opacity: 0.95,
  };

  const avatarBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#D6E8FF",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
  };

  const avatar: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#93c5fd",
    display: "grid",
    placeItems: "center",
    color: "#0B2A4A",
    fontWeight: 800,
  };

  return (
    <header style={wrap}>
      <div style={inner}>
        <div style={{ fontWeight: 700, fontSize: 26, color: "#E8F1FF" }}>
          diveplunge
        </div>

        <div style={centerBox}>
          <div style={title}>diveplunge</div>
          <div style={slogan}>Breath. Jump. Live.</div>
        </div>

        <div style={{ position: "relative" }}>
          <button
            style={avatarBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span style={avatar}>
              {user?.email ? user.email.substring(0, 1).toUpperCase() : "•"}
            </span>
            Profilo
          </button>

          {menuOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                right: 0,
                top: 44,
                minWidth: 220,
                background: "white",
                color: "#0B2A4A",
                borderRadius: 12,
                boxShadow: "0 12px 30px rgba(0,0,0,.18)",
                overflow: "hidden",
                zIndex: 9999,
              }}
            >
              <div style={{ padding: "10px 12px", fontWeight: 700 }}>
                {user?.email ?? "Ospite"}
              </div>
              <div style={{ height: 1, background: "#eef2f7" }} />
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={menuItem}
                >
                  Accedi / Registrati
                </Link>
              )}
              {user && (
                <>
                  <Link
                    href="/create"
                    onClick={() => setMenuOpen(false)}
                    style={menuItem}
                  >
                    Crea spot
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setMenuOpen(false)}
                    style={menuItem}
                  >
                    Preferiti
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    style={menuItem}
                  >
                    Impostazioni
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setMenuOpen(false);
                    }}
                    style={{ ...menuItem, width: "100%", textAlign: "left" }}
                  >
                    Esci
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const menuItem: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  textDecoration: "none",
  color: "#0B2A4A",
  fontWeight: 600,
};
