// La hendidura del grano se recorta con una máscara para que siempre deje ver
// el fondo, sin importar el color u opacidad con que se pinte el ícono.
// Todas las instancias comparten la misma máscara, así que el id fijo es seguro.
const MASK_ID = "bean-icon-crease";

export function BeanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <mask id={MASK_ID}>
        <rect width="24" height="24" fill="white" />
        <path
          d="M8.2 18.2c2.6-1.6 2.2-4.4 3.6-6.4 1.4-2 3.7-2.3 4.4-5.3"
          stroke="black"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </mask>
      <ellipse
        cx="12"
        cy="12"
        rx="7"
        ry="9.5"
        transform="rotate(35 12 12)"
        fill="currentColor"
        mask={`url(#${MASK_ID})`}
      />
    </svg>
  );
}
