import Link from "next/link";
import { BeanIcon } from "./bean-icon";

const enlaces = [
  { href: "/cafes", label: "Cafés" },
  { href: "/regiones", label: "Regiones" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-espresso/10 bg-crema/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <BeanIcon className="size-6 text-cereza" />
          Origen Cuscatlán
        </Link>
        <ul className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          {enlaces.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className="rounded-full px-3 py-2 transition-colors hover:bg-arena"
              >
                {enlace.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
