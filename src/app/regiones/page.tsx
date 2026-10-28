import type { Metadata } from "next";
import { RegionCard } from "@/components/region-card";
import { SectionHeading } from "@/components/section-heading";
import { getRegiones } from "@/lib/data";

export const metadata: Metadata = {
  title: "Regiones",
  description: "Las seis regiones cafetaleras de El Salvador y su perfil en taza.",
};

export default async function RegionesPage() {
  const regiones = await getRegiones();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Mapa cafetalero"
        title="Regiones de El Salvador"
        description="El café salvadoreño crece sobre cordilleras y volcanes. Estas son sus regiones, de la más alta a la más baja."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {regiones.map((region) => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
}
