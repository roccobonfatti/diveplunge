'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), { ssr: false });

const MapWrapper = ({ center }) => {
  return <Map center={center} />;
};

export default MapWrapper;
