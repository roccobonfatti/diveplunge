// app/auth/page.tsx
import { Suspense } from "react";
import AuthClient from "./AuthClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff" }}>Caricamento…</div>}>
      <AuthClient />
    </Suspense>
  );
}
