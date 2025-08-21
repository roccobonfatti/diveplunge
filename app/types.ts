export type WaterType = "sea" | "river" | "lake";

export type Spot = {
  id: string;
  name: string;
  lat: number;      // coord numeriche
  lon: number;      // coord numeriche
  waterType: WaterType;

  // opzionali
  country?: string;
  difficulty?: number;
  rating?: number;
  season?: string;
  warnings?: string;
  notes?: string;
  heightMeters?: number;
};
