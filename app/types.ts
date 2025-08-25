export type WaterType = "all" | "sea" | "river" | "lake";

export type Spot = {
  id?: string | number;
  name?: string;
  waterType?: string;
  lat?: number | string;
  lon?: number | string;
  lng?: number | string;
  long?: number | string;
  rating?: number;
  difficulty?: number;
  [k: string]: any;
};
