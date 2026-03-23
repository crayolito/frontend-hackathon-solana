// Historial de QRs creados en esta sesión del navegador (el backend puede no exponer GET aún).

export type EntradaQrLocal = {
  id: string;
  creadoEn: number;
  etiqueta: string;
  montoVariable: boolean;
  respuesta: unknown;
};

const prefijoClave = "trustpay_qrs_v1_";

function claveSesion(idNegocio: string) {
  return `${prefijoClave}${idNegocio}`;
}

export function leerQrsLocalesNegocio(idNegocio: string): EntradaQrLocal[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.sessionStorage.getItem(claveSesion(idNegocio));
    if (!crudo) return [];
    const datos = JSON.parse(crudo) as unknown;
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (x): x is EntradaQrLocal =>
        x &&
        typeof x === "object" &&
        typeof (x as EntradaQrLocal).id === "string" &&
        "respuesta" in (x as EntradaQrLocal)
    );
  } catch {
    return [];
  }
}

export function guardarQrLocalNegocio(idNegocio: string, entrada: EntradaQrLocal) {
  if (typeof window === "undefined") return;
  const actuales = leerQrsLocalesNegocio(idNegocio);
  actuales.unshift(entrada);
  try {
    window.sessionStorage.setItem(claveSesion(idNegocio), JSON.stringify(actuales));
  } catch {
    // sessionStorage lleno o privado
  }
}
