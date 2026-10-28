import type { Metadata } from "next";
import { CafeCard } from "@/components/cafe-card";
import { SectionHeading } from "@/components/section-heading";
import { getCafes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cafés",
  description: "Catálogo de cafés de especialidad salvadoreños ordenados por puntaje.",
};

export default async function CafesPage() {
  const cafes = await getCafes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Catálogo"
        title="Todos los cafés"
        description={`${cafes.length} lotes de especialidad, ordenados de mayor a menor puntaje SCA.`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.id} cafe={cafe} />
        ))}
      </div>
    </div>
  );
}
