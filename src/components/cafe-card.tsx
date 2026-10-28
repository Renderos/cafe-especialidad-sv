import Link from "next/link";
import type { CafeConRegion } from "@/lib/types";
import { BeanIcon } from "./bean-icon";
import { formatoPrecio } from "@/lib/format";

export function CafeCard({ cafe }: { cafe: CafeConRegion }) {
  return (
    <Link
      href={`/cafes/${cafe.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-espresso/5 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="relative flex h-44 items-end justify-between p-5 text-crema"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${cafe.region.color}cc, ${cafe.region.color} 45%, #2a1a12)`,
        }}
      >
        <BeanIcon className="absolute -right-6 -top-6 size-36 rotate-12 text-crema/10 transition-transform duration-500 group-hover:rotate-45" />
        <span className="rounded-full bg-crema/15 px-3 py-1 text-xs font-medium backdrop-blur">
          {cafe.region.nombre}
        </span>
        <span className="font-display text-3xl font-semibold">{cafe.puntaje}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl font-semibold">{cafe.nombre}</h3>
          <p className="text-sm text-espresso/60">{cafe.finca}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {cafe.notas.map((nota) => (
            <li key={nota} className="rounded-full bg-arena px-2.5 py-0.5 text-xs">
              {nota}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-espresso/60">
            {cafe.variedad} · {cafe.proceso}
          </span>
          <span className="font-semibold">{formatoPrecio(cafe.precio_usd)}</span>
        </div>
      </div>
    </Link>
  );
}
