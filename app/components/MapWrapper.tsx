'use client';

import React from 'react';
import dynamic from 'next/dynamic';

type Center = [number, number];
type Props = { center: Center };

const Map = dynamic(() => import('./Map'), { ssr: false });

export default function MapWrapper({ center }: Props) {
  return <Map center={center} />;
}
