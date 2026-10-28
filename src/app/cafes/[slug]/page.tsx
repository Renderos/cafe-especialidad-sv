import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeanIcon } from "@/components/bean-icon";
import { CafeCard } from "@/components/cafe-card";
import { getCafeBySlug, getCafesRelacionados } from "@/lib/data";
import { formatoMsnm, formatoPrecio } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/cafes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) return { title: "Café no encontrado" };

  return {
    title: `${cafe.nombre} — ${cafe.finca}`,
    description: cafe.descripcion,
  };
}

export default async function CafePage({ params }: PageProps<"/cafes/[slug]">) {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) notFound();

  const relacionados = await getCafesRelacionados(cafe.region_id, cafe.id);

  const ficha = [
    { etiqueta: "Productor", valor: cafe.productor },
    { etiqueta: "Variedad", valor: cafe.variedad },
    { etiqueta: "Proceso", valor: cafe.proceso },
    { etiqueta: "Altitud", valor: formatoMsnm(cafe.altitud_msnm) },
    { etiqueta: "Presentación", valor: `${cafe.peso_g} g` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-espresso/60">
        <Link href="/cafes" className="hover:text-cereza">
          Cafés
        </Link>
        <span className="mx-2">/</span>
        <span className="text-espresso">{cafe.nombre}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Link
            href={`/regiones/${cafe.region.slug}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-crema"
            style={{ backgroundColor: cafe.region.color }}
          >
            Región {cafe.region.nombre}
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
            {cafe.nombre}
          </h1>
          <p className="mt-2 text-lg text-espresso/70">{cafe.finca}</p>

          <p className="mt-8 text-lg leading-relaxed">{cafe.descripcion}</p>

          <h2 className="mt-10 mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cereza">
            Notas de cata
          </h2>
          <ul className="flex flex-wrap gap-2">
            {cafe.notas.map((nota) => (
              <li key={nota} className="rounded-full bg-arena px-4 py-1.5 text-sm font-medium">
                {nota}
              </li>
            ))}
          </ul>
        </div>

        <aside
          className="relative self-start overflow-hidden rounded-3xl p-8 text-crema shadow-xl"
          style={{
            background: `linear-gradient(160deg, ${cafe.region.color}, #2a1a12 75%)`,
          }}
        >
          <BeanIcon className="absolute -right-10 -bottom-10 size-48 text-crema/10" />
          <div className="relative flex items-end justify-between border-b border-crema/20 pb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-crema/60">Puntaje SCA</p>
              <p className="font-display text-5xl font-semibold">{cafe.puntaje}</p>
            </div>
            <p className="font-display text-3xl">{formatoPrecio(cafe.precio_usd)}</p>
          </div>
          <dl className="relative mt-6 grid gap-4">
            {ficha.map((item) => (
              <div key={item.etiqueta} className="flex justify-between gap-4 text-sm">
                <dt className="text-crema/60">{item.etiqueta}</dt>
                <dd className="text-right font-medium">{item.valor}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-semibold">
            Más cafés de {cafe.region.nombre}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((relacionado) => (
              <CafeCard key={relacionado.id} cafe={relacionado} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
