// DemoAuth: autenticacion de prueba para la hackathon.
// Guarda usuarios y sesion en localStorage para que el modal de login funcione
// sin necesitar backend por ahora.

export type RolDemo = "admin" | "cliente";

export type UsuarioDemo = {
  email: string;
  password: string;
  rol: RolDemo;
  telefono?: string;
  pais?: string;
};

const CLAVE_USUARIOS = "compra_segura_usuarios_v1";
const CLAVE_SESION = "compra_segura_sesion_v1";

const USUARIOS_SEMILLA: UsuarioDemo[] = [
  { email: "admin@gmail.com", password: "clave123", rol: "admin" },
  { email: "cliente@gmail.com", password: "clave123", rol: "cliente" },
];

function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

export function inicializarUsuariosDemo() {
  if (typeof window === "undefined") return;

  try {
    const guardados = window.localStorage.getItem(CLAVE_USUARIOS);
    if (guardados) return;

    window.localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_SEMILLA));
  } catch {
    // Si falla localStorage, no bloqueamos la UI. El login no funcionara en ese caso.
  }
}

export function obtenerUsuariosDemo(): UsuarioDemo[] {
  if (typeof window === "undefined") return [];

  try {
    const guardados = window.localStorage.getItem(CLAVE_USUARIOS);
    if (!guardados) return [];
    const datos = JSON.parse(guardados) as UsuarioDemo[];
    if (!Array.isArray(datos)) return [];
    return datos;
  } catch {
    return [];
  }
}

export function verificarCredenciales(
  email: string,
  password: string
): RolDemo | null {
  const emailNorm = normalizarEmail(email);
  const users = obtenerUsuariosDemo();
  const encontrado = users.find(
    (u) => normalizarEmail(u.email) === emailNorm && u.password === password
  );
  return encontrado?.rol ?? null;
}

export function crearUsuarioDemo(params: {
  email: string;
  password: string;
  rol: RolDemo;
  pais?: string;
  prefijo?: string;
  telefono?: string;
}) {
  const emailNorm = normalizarEmail(params.email);

  if (!emailNorm || !params.password) return false;

  const users = obtenerUsuariosDemo();
  const existe = users.some((u) => normalizarEmail(u.email) === emailNorm);
  if (existe) return false;

  const nuevo: UsuarioDemo = {
    email: emailNorm,
    password: params.password,
    rol: params.rol,
    pais: params.pais ? `${params.pais}${params.prefijo ? ` ${params.prefijo}` : ""}` : undefined,
    telefono: params.telefono,
  };

  const actualizados = [...users, nuevo];
  window.localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
  return true;
}

export function guardarSesion(params: { email: string; rol: RolDemo }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    CLAVE_SESION,
    JSON.stringify({ email: normalizarEmail(params.email), rol: params.rol })
  );
}

export function cerrarSesion() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLAVE_SESION);
}

export function obtenerSesion(): { email: string; rol: RolDemo } | null {
  if (typeof window === "undefined") return null;

  try {
    const sesion = window.localStorage.getItem(CLAVE_SESION);
    if (!sesion) return null;
    const data = JSON.parse(sesion) as { email: string; rol: RolDemo };
    if (!data || !data.email || !data.rol) return null;
    return data;
  } catch {
    return null;
  }
}

