// app/types.ts

// Usato dalla TopBar per il filtro. Includo sia "all" sia "any"
// così copriamo entrambi i casi che potresti avere in codice/UI.
export type WaterType = "sea" | "river" | "lake" | "all" | "any";

// Tipo base dello spot (accettiamo sia camelCase che snake_case)
export type Spot = {
  id?: string | number;
  name?: string;

  // tipo acqua da statico (camel) o DB (snake)
  waterType?: string;
  water_type?: string;

  // coordinate (vari alias supportati)
  lat?: number | string;
  lon?: number | string;
  lng?: number | string;
  long?: number | string;

  difficulty?: number;
  rating?: number;

  // altri campi liberi
  [k: string]: any;
};

// Helper opzionale: normalizza il tipo acqua in lowercase
export function getWaterTypeValue(s: Spot): string {
  return (s.waterType ?? s.water_type ?? "").toString().toLowerCase();
}
