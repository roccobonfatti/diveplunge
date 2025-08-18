"use client";

export default function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 5000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.9)",
          padding: "8px 12px",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            height: 36,
            width: 36,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          DP
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 600 }}>diveplunge</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Breath. Live. Jump.</div>
        </div>
      </div>
    </header>
  );
}
