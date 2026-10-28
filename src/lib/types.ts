export type Region = {
  id: number;
  slug: string;
  nombre: string;
  departamentos: string;
  altitud_min: number;
  altitud_max: number;
  perfil: string;
  descripcion: string;
  color: string;
};

export type RegionResumen = Pick<Region, "slug" | "nombre" | "color">;

export type Cafe = {
  id: number;
  slug: string;
  nombre: string;
  finca: string;
  productor: string;
  region_id: number;
  variedad: string;
  proceso: string;
  altitud_msnm: number;
  puntaje: number;
  notas: string[];
  descripcion: string;
  precio_usd: number;
  peso_g: number;
  destacado: boolean;
};

export type CafeConRegion = Cafe & { region: RegionResumen };

export type RegionConConteo = Region & { total_cafes: number };

export type RegionConCafes = Region & { cafes: Cafe[] };
