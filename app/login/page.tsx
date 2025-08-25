"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    try {
      setBusy(true);
      setMsg(null);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/create`,
        },
      });
      if (error) throw error;
      setMsg("Ti abbiamo inviato un link di accesso via email. Controlla la posta.");
    } catch (err: any) {
      setMsg(err?.message ?? "Errore di login.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWith(provider: "google" | "facebook" | "apple" | "linkedin_oidc") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/create`,
      },
    });
    if (error) alert(error.message);
  }

  return (
    <main style={{maxWidth: 460, margin: "80px auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto"}}>
      <h1 style={{fontSize: 28, fontWeight: 800, marginBottom: 12}}>Accedi a diveplunge</h1>

      <form onSubmit={signInWithEmail} style={{display: "grid", gap: 10, marginBottom: 20}}>
        <input
          type="email"
          required
          placeholder="tua@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8}}
        />
        <button disabled={busy} style={{padding: "10px 12px", borderRadius: 8, background:"#0e3a65", color:"#fff", border:0}}>
          {busy ? "Invio..." : "Entra con link via email"}
        </button>
      </form>

      <div style={{display:"grid", gap:8}}>
        <button onClick={() => signInWith("google")}  style={btn}>Continua con Google</button>
        <button onClick={() => signInWith("apple")}   style={btn}>Continua con Apple</button>
        <button onClick={() => signInWith("facebook")}style={btn}>Continua con Facebook</button>
        <button onClick={() => signInWith("linkedin_oidc")} style={btn}>Continua con LinkedIn</button>
      </div>

      {msg && <p style={{marginTop:14, color:"#0e3a65"}}>{msg}</p>}

      <p style={{marginTop:24, fontSize:13, opacity:.7}}>
        Dopo l’accesso verrai portato alla pagina “Crea spot”.
      </p>
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  background: "#f0f2f5",
  border: "1px solid #d0d6dd",
  textAlign: "left"
};
