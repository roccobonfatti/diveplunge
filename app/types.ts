// app/types.ts
export type WaterType = "sea" | "lake" | "river";

export type Spot = {
  id: string | number;
  name: string;
  country?: string;
  lat: number | string;
  lon?: number | string;
  lng?: number | string;
  rating?: number;
  difficulty?: number;
  waterType?: string;
  water_type?: string;
  heightMeters?: number;
  season?: string;
  warnings?: string;
  notes?: string;
  [k: string]: any;
};
