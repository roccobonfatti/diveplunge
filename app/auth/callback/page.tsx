import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ color:"#fff", textAlign:"center", marginTop:40 }}>Caricamento…</div>}>
      <CallbackClient />
    </Suspense>
  );
}
