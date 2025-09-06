// app/create/CreateClient.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function CreateClient() {
  const sp = useSearchParams();
  const lat = sp.get("lat");
  const lon = sp.get("lon");

  return (
    <div
      style={{
        paddingTop: "calc(var(--header-h) + 24px)",
        maxWidth: 900,
        margin: "0 auto",
        color: "#0b1a2b",
      }}
    >
      <h1>Crea un nuovo spot</h1>
      <p>(Form basilare da completare in una fase successiva)</p>
      <p>
        Coordinate suggerite dal click destro: <b>{lat ?? "-"}</b>,{" "}
        <b>{lon ?? "-"}</b>
      </p>
      {/* TODO: campi form, upload foto, salvataggio su Supabase */}
    </div>
  );
}
