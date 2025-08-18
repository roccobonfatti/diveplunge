export type WaterType = "sea" | "river" | "lake";

export type Spot = {
  id: string;
  name: string;
  waterType: WaterType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  heightMeters: number;
  rating: number; // 1..5
  season: "all" | "spring" | "summer" | "autumn" | "winter";
  warnings?: string;
  notes?: string;
  lat: number;
  lng: number;
};
