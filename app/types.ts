// app/types.ts
export type Spot = {
  id: string | number;
  name: string;
  country?: string;
  region?: string;
  city?: string;
  lat: number | string;
  lon?: number | string;
  lng?: number | string;
  rating?: number;
  difficulty?: number;
  waterType?: string;
  water_type?: string;
  heightMeters?: number;
  depthMeters?: number;
  season?: string;
  warnings?: string;
  notes?: string;
  directions?: string;
  subType?: string;
  image_url?: string;
  photoSearchTerm?: string;
  [k: string]: any;
};
