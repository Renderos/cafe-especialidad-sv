import { EstadoVacio } from "@/components/estado-vacio";

export default function NotFound() {
  return (
    <EstadoVacio
      titulo="Este café no está en nuestro catálogo"
      mensaje="Puede que el lote se haya agotado o que el enlace esté mal escrito."
      enlace={{ href: "/cafes", texto: "Ver todos los cafés" }}
    />
  );
}
