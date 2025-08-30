'use client';
import { Suspense } from 'react';
import { CallbackInner } from './view';

export const dynamic = 'force-dynamic';        // evita il prerender bloccante
export default function Page() {
  return (
    <Suspense fallback={<p>Reindirizzamento…</p>}>
      <CallbackInner />
    </Suspense>
  );
}
