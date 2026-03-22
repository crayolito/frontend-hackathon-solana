// Sesión TrustPay en el navegador: JWT y snapshot del usuario (roles admin | merchant).
// El área de rutas `/cliente` corresponde al rol `merchant` del API.

export type RolSesion = "admin" | "merchant";

export type UsuarioSesion = {
  id: string;
  fullName: string;
  email: string;
  role: RolSesion;
  country: string;
  walletAddress: string | null;
  isVerified?: boolean;
  isActive?: boolean;
};

export type DatosSesionTrustpay = {
  token: string;
  user: UsuarioSesion;
};

const CLAVE_SESION = "trustpay_sesion_v1";

function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

// Guarda token y usuario tras login o registro exitoso.
export function guardarSesionTrustpay(datos: DatosSesionTrustpay) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLAVE_SESION, JSON.stringify(datos));
  } catch {
    // localStorage lleno o deshabilitado: el login no persistirá
  }
}

export function obtenerSesionTrustpay(): DatosSesionTrustpay | null {
  if (typeof window === "undefined") return null;
  try {
    const crudo = window.localStorage.getItem(CLAVE_SESION);
    if (!crudo) return null;
    const datos = JSON.parse(crudo) as DatosSesionTrustpay;
    if (
      !datos?.token ||
      !datos?.user?.email ||
      (datos.user.role !== "admin" && datos.user.role !== "merchant")
    ) {
      return null;
    }
    return datos;
  } catch {
    return null;
  }
}

export function obtenerTokenSesion(): string | null {
  return obtenerSesionTrustpay()?.token ?? null;
}

// Actualiza solo el objeto user (p. ej. tras PATCH /users/me) sin tocar el token.
export function actualizarUsuarioEnSesion(usuario: UsuarioSesion) {
  const actual = obtenerSesionTrustpay();
  if (!actual) return;
  guardarSesionTrustpay({ token: actual.token, user: usuario });
}

export function cerrarSesion() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLAVE_SESION);
}

/**
 * Compatibilidad con layouts que solo necesitan email + rol para la UI.
 * El rol del API `merchant` es el comercio (rutas `/cliente`).
 */
export function obtenerSesion(): { email: string; rol: RolSesion } | null {
  const s = obtenerSesionTrustpay();
  if (!s) return null;
  return { email: normalizarEmail(s.user.email), rol: s.user.role };
}
