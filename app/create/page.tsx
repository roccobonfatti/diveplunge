// app/create/page.tsx
import { Suspense } from "react";
import CreateClient from "./CreateClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CreatePage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff" }}>Caricamento…</div>}>
      <CreateClient />
    </Suspense>
  );
}
