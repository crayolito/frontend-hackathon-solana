/**
 * Detecta teléfono o tablet para acortar textos del botón Phantom y el aviso al conectar sin app.
 */

export function esClienteTelefonoOTablet(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  if (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua)) {
    return true;
  }
  return false;
}
