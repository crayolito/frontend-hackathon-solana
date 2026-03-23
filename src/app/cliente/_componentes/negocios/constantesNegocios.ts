/** Máximo de registros de negocio por cuenta merchant (sucursales, rubros o marcas en la app). */
export const MAX_NEGOCIOS_POR_COMERCIO = 4;

/** Foto genérica de comercio (Unsplash) cuando no hay logo; si falla la red, usar `onError` con SVG local. */
export const URL_IMAGEN_NEGOCIO_DEFECTO =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=640&q=80&auto=format&fit=crop";

export const URL_IMAGEN_NEGOCIO_FALLBACK_LOCAL = "/imagenes/negocio-default.svg";

export function urlVisualNegocio(logoUrl: string | null | undefined): string {
  const u = logoUrl?.trim();
  return u && u.length > 0 ? u : URL_IMAGEN_NEGOCIO_DEFECTO;
}
