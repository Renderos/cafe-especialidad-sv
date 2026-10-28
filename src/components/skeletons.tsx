function Bloque({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-arena ${className}`} />;
}

export function CafeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-espresso/5">
      <Bloque className="h-44 rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Bloque className="h-6 w-2/3" />
        <Bloque className="h-4 w-1/3" />
        <Bloque className="h-5 w-full" />
      </div>
    </div>
  );
}

export function RegionCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 ring-1 ring-espresso/5">
      <Bloque className="h-6 w-1/2" />
      <Bloque className="h-4 w-2/3" />
      <Bloque className="h-12 w-full" />
    </div>
  );
}

export function GridSkeleton({
  cantidad = 6,
  tipo = "cafe",
}: {
  cantidad?: number;
  tipo?: "cafe" | "region";
}) {
  const Card = tipo === "cafe" ? CafeCardSkeleton : RegionCardSkeleton;
  return (
    <div
      role="status"
      aria-label="Cargando contenido"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: cantidad }, (_, i) => (
        <Card key={i} />
      ))}
    </div>
  );
}

export function DetalleSkeleton() {
  return (
    <div role="status" aria-label="Cargando contenido" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Bloque className="mb-6 h-4 w-40" />
      <Bloque className="mb-4 h-12 w-2/3" />
      <Bloque className="mb-10 h-5 w-1/2" />
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Bloque className="h-64" />
        <Bloque className="h-64" />
      </div>
    </div>
  );
}
