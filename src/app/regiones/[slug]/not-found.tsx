import { EstadoVacio } from "@/components/estado-vacio";

export default function NotFound() {
  return (
    <EstadoVacio
      titulo="No encontramos esa región"
      mensaje="El Salvador tiene seis regiones cafetaleras. Revisa la lista completa."
      enlace={{ href: "/regiones", texto: "Ver regiones" }}
    />
  );
}
