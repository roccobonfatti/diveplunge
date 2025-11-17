"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AvatarUploader({
  initialUrl,
  onUploaded,
  size = 72,
}: {
  initialUrl?: string;
  onUploaded: (publicUrl: string) => void;
  size?: number;
}) {
  const [url, setUrl] = useState<string | undefined>(initialUrl);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non autenticato");

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        cacheControl: "3600",
      });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = data.publicUrl;
      setUrl(publicUrl);
      onUploaded(publicUrl);
    } catch (e: any) {
      alert("Errore upload: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="relative rounded-full overflow-hidden border"
        style={{ width: size, height: size }}
        onClick={() => inputRef.current?.click()}
        title={busy ? "Carico…" : "Cambia foto"}
        disabled={busy}
      >
        {url ? (
          <Image src={url} alt="avatar" fill sizes={`${size}px`} className="object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center bg-gray-100 text-gray-500">
            {busy ? "..." : "📷"}
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
