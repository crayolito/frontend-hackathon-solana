/** Categorías alineadas con el POST/PATCH de `/businesses`. */
export const CATEGORIAS_NEGOCIO = [
  { valor: "retail", etiqueta: "Retail" },
  { valor: "food", etiqueta: "Comida y bebidas" },
  { valor: "services", etiqueta: "Servicios" },
  { valor: "ecommerce", etiqueta: "E-commerce" },
  { valor: "other", etiqueta: "Otro" },
] as const;

export function etiquetaCategoriaNegocio(valor: string | null | undefined): string {
  if (!valor) return "Sin categoría";
  const f = CATEGORIAS_NEGOCIO.find((c) => c.valor === valor);
  return f?.etiqueta ?? valor;
}
