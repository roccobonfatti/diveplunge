// app/create/page.tsx
import { Suspense } from "react";
import CreateClient from "./CreateClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "calc(var(--header-h) + 24px)", color:"#fff" }}>Caricamento…</div>}>
      <CreateClient />
    </Suspense>
  );
}
