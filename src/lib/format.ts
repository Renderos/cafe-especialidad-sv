const precio = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
});

const entero = new Intl.NumberFormat("es-SV");

export const formatoPrecio = (valor: number) => precio.format(valor);

export const formatoMsnm = (valor: number) => `${entero.format(valor)} msnm`;
