// app/auth/callback/page.tsx
import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CallbackPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff" }}>Caricamento…</div>}>
      <CallbackClient />
    </Suspense>
  );
}
