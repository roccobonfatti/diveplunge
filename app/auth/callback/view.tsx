'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function CallbackInner() {
  const sp = useSearchParams();
  const router = useRouter();
useEffect(() => {
    // Qui metti la tua logica di callback OAuth.
    // Per ora facciamo una semplice ridirezione "safe".
    const next = sp.get('next') || '/';
    router.replace(next);
  }, [sp, router]);
  return <p>Sto completando l’accesso…</p>;
}
