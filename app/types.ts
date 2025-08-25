export type Spot = {
  id?: string | number;
  name?: string;

  // camelCase (statici) e snake_case (DB)
  waterType?: string;
  water_type?: string;

  // coordinate (supporto a più nomi, verranno lette in mappa)
  lat?: number | string;
  lon?: number | string;
  lng?: number | string;
  long?: number | string;

  difficulty?: number;
  rating?: number;

  // altri campi eventuali (immagini, descrizioni, ecc.)
  [k: string]: any;
};
