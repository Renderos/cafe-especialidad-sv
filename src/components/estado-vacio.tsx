import Link from "next/link";
import type { ReactNode } from "react";
import { BeanIcon } from "./bean-icon";

export function EstadoVacio({
  titulo,
  mensaje,
  enlace,
  children,
}: {
  titulo: string;
  mensaje: string;
  enlace?: { href: string; texto: string };
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <BeanIcon className="mb-6 size-14 text-tostado/40" />
      <h1 className="font-display text-3xl font-semibold">{titulo}</h1>
      <p className="mt-3 text-espresso/70">{mensaje}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {children}
        {enlace && (
          <Link
            href={enlace.href}
            className="rounded-full bg-espresso px-6 py-3 font-medium text-crema transition hover:bg-tostado"
          >
            {enlace.texto}
          </Link>
        )}
      </div>
    </div>
  );
}
