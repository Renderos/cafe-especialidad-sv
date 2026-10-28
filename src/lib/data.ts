import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { getSupabase as getClient } from "./supabase";
import type {
  CafeConRegion,
  RegionConCafes,
  RegionConConteo,
} from "./types";

// Columnas de la región que se incrustan junto a cada café.
const CAFE_CON_REGION = "*, region:regiones(slug, nombre, color)";

// Los datos se leen en cada request (no en el build), así el catálogo siempre
// refleja lo que hay en Supabase y el build no necesita acceso a la base.
async function db() {
  await connection();
  return getClient();
}

function fallo(contexto: string, message: string): never {
  throw new Error(`No se pudo cargar ${contexto}: ${message}`);
}

export const getRegiones = cache(async (): Promise<RegionConConteo[]> => {
  const supabase = await db();
  const { data, error } = await supabase
    .from("regiones")
    .select("*, cafes(count)")
    .order("altitud_max", { ascending: false });

  if (error) fallo("las regiones", error.message);

  return data.map(({ cafes, ...region }) => ({
    ...region,
    total_cafes: cafes[0]?.count ?? 0,
  }));
});

export const getRegionBySlug = cache(
  async (slug: string): Promise<RegionConCafes | null> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("regiones")
      .select("*, cafes(*)")
      .eq("slug", slug)
      .order("puntaje", { referencedTable: "cafes", ascending: false })
      .maybeSingle();

    if (error) fallo("la región", error.message);
    return data;
  },
);

export const getCafes = cache(async (): Promise<CafeConRegion[]> => {
  const supabase = await db();
  const { data, error } = await supabase
    .from("cafes")
    .select(CAFE_CON_REGION)
    .order("puntaje", { ascending: false });

  if (error) fallo("los cafés", error.message);
  return data;
});

export const getCafeBySlug = cache(
  async (slug: string): Promise<CafeConRegion | null> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("cafes")
      .select(CAFE_CON_REGION)
      .eq("slug", slug)
      .maybeSingle();

    if (error) fallo("el café", error.message);
    return data;
  },
);

export const getCafesRelacionados = cache(
  async (regionId: number, excluirId: number): Promise<CafeConRegion[]> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("cafes")
      .select(CAFE_CON_REGION)
      .eq("region_id", regionId)
      .neq("id", excluirId)
      .order("puntaje", { ascending: false })
      .limit(3);

    if (error) fallo("los cafés relacionados", error.message);
    return data;
  },
);
