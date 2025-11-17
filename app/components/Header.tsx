"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const HEADER_HEIGHT = 76;

const adineue = localFont({
  src: "../fonts/adineue-PRO-Bold.ttf",
  display: "swap",
  variable: "--font-adineue",
});

export default function Header() {
  const router = useRouter();

  const [userName, setUserName] = useState<string>("Ospite");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;

      if (!user) { setUserName("Ospite"); setAvatarUrl(null); return; }

      const { data } = await supabase
        .from("profiles")
        .select("first_name,last_name,avatar_url,email")
        .eq("id", user.id)
        .single();

      if (data) {
        const full = (data.first_name || "") + (data.last_name ? ` ${data.last_name}` : "");
        setUserName(full || data.email || "Utente");
        setAvatarUrl(data.avatar_url || null);
      } else {
        const name =
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          user.email ||
          "Utente";
        setUserName(name);
        setAvatarUrl(null);
      }
    }

    loadUser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => loadUser());
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const avatarLetter = (userName || "•").slice(0, 1).toUpperCase();

  async function logout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.replace("/");
  }

  return (
    <header
      className={adineue.variable}
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        height: HEADER_HEIGHT,
        background: "linear-gradient(180deg, #0B2A4A 0%, #0E3A65 100%)",
        color: "#E6F0FA",
        zIndex: 5000,
        boxShadow: "0 2px 18px rgba(0,0,0,.22)",
      }}
    >
      <div
        style={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 12px",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" style={{
            fontFamily: "var(--font-adineue), system-ui, -apple-system, Segoe UI",
            fontWeight: 800, fontSize: 44, letterSpacing: 0.3, lineHeight: 1,
            color: "#E8F1FF", textDecoration: "none",
          }}>
            diveplunge
          </Link>
        </div>

        <div style={{
          justifySelf: "center", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          fontWeight: 500, fontSize: 26, color: "#ffffff", letterSpacing: 1.1, whiteSpace: "nowrap", userSelect: "none",
        }}>
          Breath. Jump. Live.
        </div>

        <div ref={menuRef} style={{ justifySelf: "end", position: "relative" }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#D6E8FF", padding: "6px 12px", borderRadius: 999, cursor: "pointer",
            }}
            aria-haspopup="menu" aria-expanded={menuOpen}
          >
            <span aria-hidden style={{
              width: 36, height: 36, borderRadius: "50%", background: "#164d7b",
              display: "grid", placeItems: "center", fontWeight: 800, color: "#fff", fontSize: 18, overflow: "hidden",
            }} title={userName}>
              {avatarUrl ? (
                <Image src={avatarUrl} alt="avatar" width={36} height={36} style={{ objectFit: "cover" }} />
              ) : (
                avatarLetter
              )}
            </span>
            <span style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userName}
            </span>
          </button>

          {menuOpen && (
            <div role="menu" style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)", width: 240,
              background: "#0e2540", color: "#e8f1ff", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12, boxShadow: "0 16px 44px rgba(0,0,0,.35)", overflow: "hidden", zIndex: 10,
            }}>
              <MenuItem onClick={() => (location.href = "/create")}>➕ Crea spot</MenuItem>
              <MenuItem onClick={() => (location.href = "/favorites")}>⭐ Preferiti</MenuItem>
              <MenuItem onClick={() => (location.href = "/account")}>👤 Account</MenuItem>
              <MenuItem onClick={() => (location.href = "/settings")}>⚙️ Impostazioni</MenuItem>
              <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
              <MenuItem onClick={logout}>🚪 Esci</MenuItem>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, color: "inherit", padding: "10px 12px", cursor: "pointer" }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}
