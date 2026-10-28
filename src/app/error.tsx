"use client";

import { useEffect } from "react";
import { EstadoVacio } from "@/components/estado-vacio";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EstadoVacio
      titulo="Algo salió mal al preparar tu café"
      mensaje="No pudimos cargar la información en este momento. Intenta de nuevo en unos segundos."
      enlace={{ href: "/", texto: "Ir al inicio" }}
    >
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full bg-cereza px-6 py-3 font-medium text-crema transition hover:bg-cereza/85"
      >
        Reintentar
      </button>
    </EstadoVacio>
  );
}
