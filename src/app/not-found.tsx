import { EstadoVacio } from "@/components/estado-vacio";

export default function NotFound() {
  return (
    <EstadoVacio
      titulo="Página no encontrada"
      mensaje="La página que buscas no existe o fue movida."
      enlace={{ href: "/", texto: "Volver al inicio" }}
    />
  );
}
