import Link from "next/link";
import { Suspense } from "react";
import { CafeCard } from "@/components/cafe-card";
import { RegionCard } from "@/components/region-card";
import { SectionHeading } from "@/components/section-heading";
import { GridSkeleton } from "@/components/skeletons";
import { BeanIcon } from "@/components/bean-icon";
import { getCafes, getRegiones } from "@/lib/data";

const datos = [
  { valor: "6", texto: "regiones cafetaleras con denominación propia" },
  { valor: "Pacamara", texto: "variedad creada en El Salvador, hoy famosa en el mundo" },
  { valor: "+2,000", texto: "metros sobre el nivel del mar en las fincas más altas" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-espresso text-crema">
        <BeanIcon className="pointer-events-none absolute -right-24 -top-16 size-[28rem] rotate-12 text-crema/5" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cereza">
              Café de especialidad · El Salvador
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
              Del volcán a tu taza, un origen a la vez.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-crema/75">
              Explora los lotes de las seis regiones cafetaleras salvadoreñas: su
              altitud, variedad, proceso y las notas que los hacen únicos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cafes"
                className="rounded-full bg-cereza px-6 py-3 font-medium text-crema transition hover:bg-cereza/85"
              >
                Ver cafés
              </Link>
              <Link
                href="/regiones"
                className="rounded-full px-6 py-3 font-medium ring-1 ring-crema/30 transition hover:bg-crema/10"
              >
                Conocer las regiones
              </Link>
            </div>
          </div>
          <dl className="grid gap-4">
            {datos.map((dato) => (
              <div key={dato.valor} className="rounded-2xl bg-crema/5 p-5 ring-1 ring-crema/10">
                <dt className="font-display text-3xl font-semibold text-arena">{dato.valor}</dt>
                <dd className="mt-1 text-sm text-crema/70">{dato.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeading
          eyebrow="Selección del tostador"
          title="Cafés destacados"
          description="Lotes de alta puntuación elegidos por su perfil en taza."
        />
        <Suspense fallback={<GridSkeleton cantidad={3} />}>
          <CafesDestacados />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeading
          eyebrow="Terroir"
          title="Seis regiones, seis personalidades"
          description="Cada zona volcánica aporta un clima, un suelo y una altitud distintos que se notan en la taza."
        />
        <Suspense fallback={<GridSkeleton tipo="region" />}>
          <ListaRegiones />
        </Suspense>
      </section>
    </>
  );
}

async function CafesDestacados() {
  const cafes = (await getCafes()).filter((cafe) => cafe.destacado).slice(0, 3);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cafes.map((cafe) => (
        <CafeCard key={cafe.id} cafe={cafe} />
      ))}
    </div>
  );
}

async function ListaRegiones() {
  const regiones = await getRegiones();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {regiones.map((region) => (
        <RegionCard key={region.id} region={region} />
      ))}
    </div>
  );
}
