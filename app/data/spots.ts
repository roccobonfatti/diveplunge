// app/data/spots.ts
import type { Spot } from "../types";

export const spots: Spot[] = [
  {
    id: "ledro",
    name: "Lago di Ledro",
    lat: 45.885,
    lon: 10.736,
    waterType: "lake",
    difficulty: 2,
    rating: 4.2,
    heightMeters: 5,
    season: "summer",
    warnings: "Acqua fredda.",
    notes: "Ottimo in estate.",
  },
  {
    id: "gola-gorropu",
    name: "Gola Gorropu",
    lat: 40.118,
    lon: 9.689,
    waterType: "river",
    difficulty: 3,
    rating: 4.8,
    heightMeters: 8,
    season: "summer",
    warnings: "Area protetta, accesso a piedi.",
    notes: "Acqua cristallina, scogli a riva.",
  },
  {
    id: "porticciolo",
    name: "Cala Porticciolo",
    lat: 41.016,
    lon: 9.531,
    waterType: "sea",
    difficulty: 3,
    rating: 4.4,
    heightMeters: 7,
    season: "summer",
    warnings: "Attenzione alle barche.",
    notes: "Mare quasi sempre calmo.",
  },
];
