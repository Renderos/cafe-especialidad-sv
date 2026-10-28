import Link from "next/link";
import type { RegionConConteo } from "@/lib/types";
import { formatoMsnm } from "@/lib/format";

export function RegionCard({ region }: { region: RegionConConteo }) {
  return (
    <Link
      href={`/regiones/${region.slug}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-espresso/5 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 transition-all group-hover:h-2.5"
        style={{ backgroundColor: region.color }}
      />
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-semibold">{region.nombre}</h3>
        <span className="shrink-0 rounded-full bg-arena px-2.5 py-0.5 text-xs font-medium">
          {region.total_cafes} {region.total_cafes === 1 ? "café" : "cafés"}
        </span>
      </div>
      <p className="text-sm text-espresso/60">{region.departamentos}</p>
      <p className="text-sm leading-relaxed">{region.perfil}</p>
      <p className="mt-auto pt-2 text-xs font-medium uppercase tracking-wider text-tostado">
        {formatoMsnm(region.altitud_min)} – {formatoMsnm(region.altitud_max)}
      </p>
    </Link>
  );
}
