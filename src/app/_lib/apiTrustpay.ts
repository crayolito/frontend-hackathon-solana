// Cliente HTTP hacia el backend TrustPay: login, registro, perfil y cuenta.
// Centraliza la URL base y el header Bearer para no repetir lógica en componentes.

const URL_POR_DEFECTO = "https://trustpay-backend.fly.dev";

export function obtenerUrlBaseTrustpay() {
  const desdeEntorno = process.env.NEXT_PUBLIC_TRUSTPAY_API_URL?.trim();
  return desdeEntorno && desdeEntorno.length > 0 ? desdeEntorno : URL_POR_DEFECTO;
}

export type RolTrustpayApi = "admin" | "merchant";

export type UsuarioTrustpayRespuesta = {
  id: string;
  fullName: string;
  email: string;
  role: RolTrustpayApi;
  country: string;
  walletAddress: string | null;
  isVerified?: boolean;
  isActive?: boolean;
};

export type RespuestaLoginRegistro = {
  user: UsuarioTrustpayRespuesta;
  token: string;
};

export type CuerpoErrorApi = {
  message?: string;
  error?: string;
  statusCode?: number;
};

export class ErrorApiTrustpay extends Error {
  codigoEstado: number;
  cuerpo: unknown;

  constructor(mensaje: string, codigoEstado: number, cuerpo: unknown) {
    super(mensaje);
    this.name = "ErrorApiTrustpay";
    this.codigoEstado = codigoEstado;
    this.cuerpo = cuerpo;
  }
}

async function parsearError(respuesta: Response): Promise<never> {
  let cuerpo: unknown;
  try {
    cuerpo = await respuesta.json();
  } catch {
    cuerpo = null;
  }
  const mensaje =
    typeof cuerpo === "object" &&
    cuerpo !== null &&
    "message" in cuerpo &&
    typeof (cuerpo as CuerpoErrorApi).message === "string"
      ? (cuerpo as CuerpoErrorApi).message!
      : respuesta.statusText || "Error de red";
  throw new ErrorApiTrustpay(mensaje, respuesta.status, cuerpo);
}

async function solicitudJson<T>(
  ruta: string,
  opciones: RequestInit & { token?: string }
): Promise<T> {
  const base = obtenerUrlBaseTrustpay();
  const encabezados = new Headers(opciones.headers);
  if (!encabezados.has("Content-Type") && opciones.body !== undefined) {
    encabezados.set("Content-Type", "application/json");
  }
  if (opciones.token) {
    encabezados.set("Authorization", `Bearer ${opciones.token}`);
  }

  const respuesta = await fetch(`${base}${ruta}`, {
    ...opciones,
    headers: encabezados,
  });

  if (!respuesta.ok) {
    await parsearError(respuesta);
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  const texto = await respuesta.text();
  if (!texto) return undefined as T;
  return JSON.parse(texto) as T;
}

export async function iniciarSesionTrustpay(correo: string, contrasena: string) {
  return solicitudJson<RespuestaLoginRegistro>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: correo.trim(), password: contrasena }),
  });
}

export async function registrarUsuarioTrustpay(cuerpo: {
  email: string;
  password: string;
  fullName: string;
  country: string;
  walletAddress: string;
}) {
  return solicitudJson<RespuestaLoginRegistro>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: cuerpo.email.trim(),
      password: cuerpo.password,
      fullName: cuerpo.fullName.trim(),
      country: cuerpo.country.trim(),
      walletAddress: cuerpo.walletAddress.trim(),
    }),
  });
}

export async function obtenerPerfilAuth(token: string) {
  return solicitudJson<UsuarioTrustpayRespuesta>("/auth/profile", {
    method: "GET",
    token,
  });
}

export async function obtenerUsuarioYo(token: string) {
  return solicitudJson<UsuarioTrustpayRespuesta>("/users/me", {
    method: "GET",
    token,
  });
}

export async function actualizarUsuarioYo(token: string, datos: { fullName: string }) {
  return solicitudJson<UsuarioTrustpayRespuesta>("/users/me", {
    method: "PATCH",
    token,
    body: JSON.stringify({ fullName: datos.fullName.trim() }),
  });
}

export async function eliminarCuentaUsuarioYo(token: string, contrasena: string) {
  return solicitudJson<void>("/users/me", {
    method: "DELETE",
    token,
    body: JSON.stringify({ password: contrasena }),
  });
}

export async function cambiarContrasenaTrustpay(
  token: string,
  contrasenaActual: string,
  contrasenaNueva: string
) {
  return solicitudJson<unknown>("/auth/change-password", {
    method: "POST",
    token,
    body: JSON.stringify({
      currentPassword: contrasenaActual,
      newPassword: contrasenaNueva,
    }),
  });
}

export async function verificarContrasenaTrustpay(token: string, contrasena: string) {
  return solicitudJson<unknown>("/auth/verify-password", {
    method: "POST",
    token,
    body: JSON.stringify({ password: contrasena }),
  });
}

// --- Panel admin: usuarios (listado paginado, detalle, rol/activo y alternar estado).

/** Interpreta el JSON del listado porque el backend puede devolver `data`, `users` o un arreglo plano. */
function normalizarListadoAdminUsuarios(
  crudo: unknown,
  paginaPedida: number,
  limitePedido: number
): {
  usuarios: UsuarioTrustpayRespuesta[];
  total: number;
  pagina: number;
  limite: number;
} {
  if (Array.isArray(crudo)) {
    return {
      usuarios: crudo as UsuarioTrustpayRespuesta[],
      total: crudo.length,
      pagina: paginaPedida,
      limite: limitePedido,
    };
  }
  if (crudo && typeof crudo === "object") {
    const o = crudo as Record<string, unknown>;
    const posibleLista = o.data ?? o.users ?? o.items;
    const usuarios = Array.isArray(posibleLista)
      ? (posibleLista as UsuarioTrustpayRespuesta[])
      : [];
    const total =
      typeof o.total === "number"
        ? o.total
        : typeof o.totalItems === "number"
          ? o.totalItems
          : usuarios.length;
    const pagina = typeof o.page === "number" ? o.page : paginaPedida;
    const limite = typeof o.limit === "number" ? o.limit : limitePedido;
    return { usuarios, total, pagina, limite };
  }
  return { usuarios: [], total: 0, pagina: paginaPedida, limite: limitePedido };
}

export async function listarUsuariosAdmin(token: string, pagina: number, limite: number) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    limit: String(limite),
  });
  const crudo = await solicitudJson<unknown>(`/admin/users?${consulta.toString()}`, {
    method: "GET",
    token,
  });
  return normalizarListadoAdminUsuarios(crudo, pagina, limite);
}

export async function obtenerUsuarioAdminPorId(token: string, idUsuario: string) {
  return solicitudJson<UsuarioTrustpayRespuesta>(`/admin/users/${encodeURIComponent(idUsuario)}`, {
    method: "GET",
    token,
  });
}

export async function actualizarUsuarioAdmin(
  token: string,
  idUsuario: string,
  datos: { role: RolTrustpayApi; isActive: boolean }
) {
  return solicitudJson<UsuarioTrustpayRespuesta>(`/admin/users/${encodeURIComponent(idUsuario)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({
      role: datos.role,
      isActive: datos.isActive,
    }),
  });
}

/** Alterna activo/inactivo en servidor (POST dedicado). */
export async function alternarActivoUsuarioAdmin(token: string, idUsuario: string) {
  return solicitudJson<UsuarioTrustpayRespuesta | void>(
    `/admin/users/${encodeURIComponent(idUsuario)}/toggle-active`,
    {
      method: "POST",
      token,
    }
  );
}

// --- Comercio: negocios y códigos QR (Bearer merchant).

/** Coincide con el JSON del backend (POST/GET/PATCH y cada ítem de `data` en el listado paginado). */
export type NegocioTrustpay = {
  id: string;
  userId?: string;
  name: string;
  description: string | null;
  category: string;
  logoUrl: string | null;
  walletAddress: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  solanaTxRegister?: string | null;
  solanaTxVerify?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/** Convierte un objeto suelto del API al tipo de negocio (ignora campos desconocidos). */
function mapearNegocioDesdeApi(raw: unknown): NegocioTrustpay | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o.id;
  const name = o.name;
  if (typeof id !== "string" || typeof name !== "string") return null;

  const walletAddress =
    typeof o.walletAddress === "string"
      ? o.walletAddress
      : o.walletAddress === null
        ? null
        : null;

  return {
    id,
    userId: typeof o.userId === "string" ? o.userId : undefined,
    name,
    description: typeof o.description === "string" ? o.description : null,
    category: typeof o.category === "string" ? o.category : "",
    logoUrl: typeof o.logoUrl === "string" ? o.logoUrl : null,
    walletAddress,
    isActive: typeof o.isActive === "boolean" ? o.isActive : undefined,
    isVerified: typeof o.isVerified === "boolean" ? o.isVerified : undefined,
    solanaTxRegister:
      typeof o.solanaTxRegister === "string"
        ? o.solanaTxRegister
        : o.solanaTxRegister === null
          ? null
          : undefined,
    solanaTxVerify:
      typeof o.solanaTxVerify === "string"
        ? o.solanaTxVerify
        : o.solanaTxVerify === null
          ? null
          : undefined,
    createdAt: typeof o.createdAt === "string" ? o.createdAt : undefined,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : undefined,
  };
}

/** POST/PATCH pueden devolver el objeto plano o envuelto en `{ data: ... }`. */
function extraerNegocioDeRespuesta(crudo: unknown): NegocioTrustpay {
  if (crudo && typeof crudo === "object") {
    const o = crudo as Record<string, unknown>;
    if (o.data !== undefined) {
      const desdeData = mapearNegocioDesdeApi(o.data);
      if (desdeData) return desdeData;
    }
  }
  const directo = mapearNegocioDesdeApi(crudo);
  if (directo) return directo;
  throw new ErrorApiTrustpay("El servidor devolvió un negocio en formato no reconocido.", 500, crudo);
}

/** Cuerpo para registrar un negocio on-chain vía backend. */
export type CuerpoCrearNegocioTrustpay = {
  name: string;
  description: string | null;
  category: string;
  logoUrl: string | null;
  walletAddress: string;
};

export type CuerpoActualizarNegocioTrustpay = {
  name?: string;
  description?: string | null;
  category?: string;
  logoUrl?: string | null;
};

/** Monto variable: amountLamports y tokenMint en null. Monto fijo: amountLamports como string de lamports. */
export type CuerpoCrearQrNegocioTrustpay = {
  label: string;
  type: string;
  amountLamports: string | null;
  tokenMint: string | null;
};

function normalizarListadoNegocios(
  crudo: unknown,
  paginaPedida: number,
  limitePedido: number
): {
  negocios: NegocioTrustpay[];
  total: number;
  pagina: number;
  limite: number;
} {
  if (Array.isArray(crudo)) {
    const negocios = crudo
      .map(mapearNegocioDesdeApi)
      .filter((n): n is NegocioTrustpay => n !== null);
    return {
      negocios,
      total: negocios.length,
      pagina: paginaPedida,
      limite: limitePedido,
    };
  }
  if (crudo && typeof crudo === "object") {
    const o = crudo as Record<string, unknown>;
    const posibleLista = o.data ?? o.businesses ?? o.items ?? o.results;
    const negocios = Array.isArray(posibleLista)
      ? posibleLista
          .map(mapearNegocioDesdeApi)
          .filter((n): n is NegocioTrustpay => n !== null)
      : [];
    const total =
      typeof o.total === "number"
        ? o.total
        : typeof o.totalItems === "number"
          ? o.totalItems
          : negocios.length;
    const pagina = typeof o.page === "number" ? o.page : paginaPedida;
    const limite = typeof o.limit === "number" ? o.limit : limitePedido;
    return { negocios, total, pagina, limite };
  }
  return { negocios: [], total: 0, pagina: paginaPedida, limite: limitePedido };
}

export async function crearNegocioTrustpay(token: string, cuerpo: CuerpoCrearNegocioTrustpay) {
  const crudo = await solicitudJson<unknown>("/businesses", {
    method: "POST",
    token,
    body: JSON.stringify({
      name: cuerpo.name.trim(),
      description: cuerpo.description,
      category: cuerpo.category.trim(),
      logoUrl: cuerpo.logoUrl,
      walletAddress: cuerpo.walletAddress.trim(),
    }),
  });
  return extraerNegocioDeRespuesta(crudo);
}

/** Un negocio por id (si el backend no expone GET, usar listado en el componente). */
export async function obtenerNegocioTrustpay(token: string, idNegocio: string) {
  const crudo = await solicitudJson<unknown>(`/businesses/${encodeURIComponent(idNegocio)}`, {
    method: "GET",
    token,
  });
  return extraerNegocioDeRespuesta(crudo);
}

export async function listarNegociosTrustpay(token: string, pagina: number, limite: number) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    limit: String(limite),
  });
  const crudo = await solicitudJson<unknown>(`/businesses?${consulta.toString()}`, {
    method: "GET",
    token,
  });
  return normalizarListadoNegocios(crudo, pagina, limite);
}

export async function actualizarNegocioTrustpay(
  token: string,
  idNegocio: string,
  datos: CuerpoActualizarNegocioTrustpay
) {
  const crudo = await solicitudJson<unknown>(`/businesses/${encodeURIComponent(idNegocio)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(datos),
  });
  return extraerNegocioDeRespuesta(crudo);
}

export async function eliminarNegocioTrustpay(token: string, idNegocio: string) {
  return solicitudJson<void>(`/businesses/${encodeURIComponent(idNegocio)}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Verifica un negocio (backend).
 * Como el path exacto puede variar según la implementación, probamos:
 * 1) `POST /businesses/:id/verify`
 * 2) fallback: `PATCH /businesses/:id` con `{ isVerified: true }`
 */
export async function verificarNegocioTrustpay(token: string, idNegocio: string) {
  try {
    const crudo = await solicitudJson<unknown>(`/businesses/${encodeURIComponent(idNegocio)}/verify`, {
      method: "POST",
      token,
    });
    return extraerNegocioDeRespuesta(crudo);
  } catch (e) {
    if (e instanceof ErrorApiTrustpay && e.codigoEstado === 404) {
      const crudoFallback = await solicitudJson<unknown>(`/businesses/${encodeURIComponent(idNegocio)}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ isVerified: true }),
      });
      return extraerNegocioDeRespuesta(crudoFallback);
    }
    throw e;
  }
}

/** Respuesta del alta de QR: el backend puede devolver distintas formas; el front normaliza con resolverVistaQr. */
export async function crearQrNegocioTrustpay(
  token: string,
  idNegocio: string,
  cuerpo: CuerpoCrearQrNegocioTrustpay
) {
  return solicitudJson<unknown>(`/businesses/${encodeURIComponent(idNegocio)}/qr-codes`, {
    method: "POST",
    token,
    body: JSON.stringify({
      label: cuerpo.label.trim(),
      type: cuerpo.type,
      amountLamports: cuerpo.amountLamports,
      tokenMint: cuerpo.tokenMint,
    }),
  });
}

/** Listado paginado GET /businesses/:id/qr-codes (misma forma que el listado de negocios: `data`, `total`, `page`, `limit`). */
function normalizarListadoQrNegocio(
  crudo: unknown,
  paginaPedida: number,
  limitePedido: number
): {
  items: unknown[];
  total: number;
  pagina: number;
  limite: number;
} {
  if (Array.isArray(crudo)) {
    return {
      items: crudo,
      total: crudo.length,
      pagina: paginaPedida,
      limite: limitePedido,
    };
  }
  if (crudo && typeof crudo === "object") {
    const o = crudo as Record<string, unknown>;
    const posibleLista = o.data ?? o.items ?? o.qrCodes ?? o.results;
    const items = Array.isArray(posibleLista) ? posibleLista : [];
    const total =
      typeof o.total === "number"
        ? o.total
        : typeof o.totalItems === "number"
          ? o.totalItems
          : items.length;
    const pagina = typeof o.page === "number" ? o.page : paginaPedida;
    const limite = typeof o.limit === "number" ? o.limit : limitePedido;
    return { items, total, pagina, limite };
  }
  return { items: [], total: 0, pagina: paginaPedida, limite: limitePedido };
}

export async function listarQrCodesNegocioTrustpay(
  token: string,
  idNegocio: string,
  pagina: number,
  limite: number
) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    limit: String(limite),
  });
  const crudo = await solicitudJson<unknown>(
    `/businesses/${encodeURIComponent(idNegocio)}/qr-codes?${consulta.toString()}`,
    {
      method: "GET",
      token,
    }
  );
  return normalizarListadoQrNegocio(crudo, pagina, limite);
}
