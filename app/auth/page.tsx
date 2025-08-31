// app/auth/page.tsx
import { Suspense } from "react";
import AuthClient from "./AuthClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ color:"#fff", textAlign:"center", marginTop:40 }}>Caricamento login…</div>}>
      <AuthClient />
    </Suspense>
  );
}
