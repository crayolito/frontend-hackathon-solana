/**
 * Utilidades para distinguir móvil/tablet del escritorio y armar enlaces oficiales de Phantom.
 * En escritorio buscamos la extensión; en móvil la app o el protocolo Mobile Wallet Adapter (Android).
 */

// Indica si el cliente parece teléfono o tablet (Safari iOS, Chrome Android, iPadOS moderno).
export function esClienteTelefonoOTablet(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  // iPadOS 13+ a veces se identifica como Macintosh pero con multitáctil.
  if (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua)) {
    return true;
  }
  return false;
}

// URL de tienda según sistema; si no se puede inferir, landing genérica de Phantom.
export function enlaceTiendaPhantomSegunDispositivo(): string {
  if (typeof navigator === "undefined") return "https://phantom.app/download";
  const ua = navigator.userAgent;
  const pareceIos =
    /iPhone|iPad|iPod/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  if (pareceIos) {
    return "https://apps.apple.com/app/phantom-crypto-wallet/id1598432977";
  }
  if (/Android/i.test(ua)) {
    return "https://play.google.com/store/apps/details?id=app.phantom";
  }
  return "https://phantom.app/download";
}

// Abre la URL actual dentro del navegador integrado de Phantom (misma experiencia que “extensión” en móvil).
export function enlaceAbrirSitioEnNavegadorPhantom(): string | null {
  if (typeof window === "undefined") return null;
  const href = window.location.href;
  const ref = window.location.origin;
  return `https://phantom.app/ul/browse/${encodeURIComponent(href)}?ref=${encodeURIComponent(ref)}`;
}
