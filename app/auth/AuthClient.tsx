// app/auth/AuthClient.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(next);
    });
  }, [next, router]);

  const signWithProvider = async (provider: "google" | "facebook" | "apple" | "linkedin_oidc") => {
    const redirectTo = `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) setMsg(error.message);
  };

  const magicLink = async () => {
    setMsg(null);
    const redirectTo = `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    if (error) setMsg(error.message); else setMsg("Ti abbiamo inviato un'email con il link di accesso.");
  };

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "#0b1a2b" }}>
      <div style={{ width: 420, background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Accedi / Registrati</div>
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <button onClick={() => signWithProvider("google")} className="btn">Continua con Google</button>
          <button onClick={() => signWithProvider("facebook")} className="btn">Continua con Facebook</button>
          <button onClick={() => signWithProvider("apple")} className="btn">Continua con Apple</button>
          <button onClick={() => signWithProvider("linkedin_oidc")} className="btn">Continua con LinkedIn</button>
        </div>
        <div className="dp-divider" />
        <div style={{ display: "grid", gap: 8 }}>
          <input type="email" placeholder="la-tua@email.com" value={email} onChange={(e)=>setEmail(e.target.value)}
                 style={{ border: "1px solid #d7e2f3", borderRadius: 10, padding: "10px 12px" }} />
          <button onClick={magicLink} className="btn" style={{ background: "#0E3A65", color: "#fff" }}>Invia link via email</button>
        </div>
        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </div>
      <style jsx>{`.btn{border:0;border-radius:10px;padding:10px 12px;cursor:pointer;background:#eef3ff;}`}</style>
    </div>
  );
}
