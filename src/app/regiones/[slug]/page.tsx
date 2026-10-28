import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CafeCard } from "@/components/cafe-card";
import { getRegionBySlug } from "@/lib/data";
import { formatoMsnm } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/regiones/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) return { title: "Región no encontrada" };

  return {
    title: `Región ${region.nombre}`,
    description: region.descripcion,
  };
}

export default async function RegionPage({ params }: PageProps<"/regiones/[slug]">) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const resumen = { slug: region.slug, nombre: region.nombre, color: region.color };
  const datos = [
    { etiqueta: "Departamentos", valor: region.departamentos },
    {
      etiqueta: "Altitud",
      valor: `${formatoMsnm(region.altitud_min)} – ${formatoMsnm(region.altitud_max)}`,
    },
    { etiqueta: "Lotes en catálogo", valor: String(region.cafes.length) },
  ];

  return (
    <>
      <section
        className="text-crema"
        style={{ background: `linear-gradient(135deg, ${region.color}, #2a1a12 80%)` }}
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-crema/70">
            <Link href="/regiones" className="hover:text-crema">
              Regiones
            </Link>
            <span className="mx-2">/</span>
            <span className="text-crema">{region.nombre}</span>
          </nav>
          <h1 className="font-display text-4xl font-semibold sm:text-6xl">{region.nombre}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-crema/80">
            {region.descripcion}
          </p>
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {datos.map((dato) => (
              <div key={dato.etiqueta} className="rounded-2xl bg-crema/10 p-4 ring-1 ring-crema/15">
                <dt className="text-xs uppercase tracking-widest text-crema/60">{dato.etiqueta}</dt>
                <dd className="mt-1 font-medium">{dato.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="mb-12 rounded-3xl bg-arena p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cereza">
            Perfil en taza
          </p>
          <p className="mt-2 font-display text-xl sm:text-2xl">{region.perfil}</p>
        </div>

        <h2 className="mb-8 font-display text-2xl font-semibold">Cafés de esta región</h2>
        {region.cafes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {region.cafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={{ ...cafe, region: resumen }} />
            ))}
          </div>
        ) : (
          <p className="text-espresso/70">Aún no hay lotes de esta región en el catálogo.</p>
        )}
      </div>
    </>
  );
}
