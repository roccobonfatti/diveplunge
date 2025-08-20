"use client";

import Link from "next/link";
import type React from "react";

/** altezza barra */
export const HEADER_HEIGHT = 88;

export default function Header() {
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
    marginTop: 6,
    fontSize: 22, // un livello sotto al titolo
    opacity: 0.95,
  };

  const rightLink: React.CSSProperties = {
    color: "#D6E8FF",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    padding: "6px 10px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  return (
    <header style={wrap}>
      <div style={inner}>
        <div style={brandLeft}>diveplunge</div>

        <div style={centerBox}>
          <div style={title}>diveplunge</div>
          <div style={slogan}>Breath. Jump. Live.</div>
        </div>

        <Link href="#" style={rightLink}>
          Profile
        </Link>
      </div>
    </header>
  );
}
