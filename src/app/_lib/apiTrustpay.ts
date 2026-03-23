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

function mensajeErrorRed(base: string, causa: unknown): string {
  const texto =
    causa instanceof Error ? causa.message : typeof causa === "string" ? causa : "";
  const esConexion =
    /failed to fetch|networkerror|load failed|connection refused|aborted/i.test(texto) ||
    texto === "";
  if (esConexion) {
    return `No se pudo conectar con el API (${base}). ¿Está el backend en marcha en ese puerto? (p. ej. npm run start:dev en la carpeta del servidor).`;
  }
  return `Error de red: ${texto || "desconocido"}`;
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

  let respuesta: Response;
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      ...opciones,
      headers: encabezados,
    });
  } catch (causa) {
    throw new ErrorApiTrustpay(mensajeErrorRed(base, causa), 0, causa);
  }

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

/** Si enviás `walletAddress`, debe coincidir con la de la cuenta (merchants). Los admin pueden omitirla. */
export async function iniciarSesionTrustpay(
  correo: string,
  contrasena: string,
  walletAddress?: string
) {
  const cuerpo: { email: string; password: string; walletAddress?: string } = {
    email: correo.trim(),
    password: contrasena,
  };
  const w = walletAddress?.trim();
  if (w) cuerpo.walletAddress = w;
  return solicitudJson<RespuestaLoginRegistro>("/auth/login", {
    method: "POST",
    body: JSON.stringify(cuerpo),
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

export type FiltrosListadoUsuariosAdmin = {
  /** Si se indica, el API filtra por rol (p. ej. `merchant` para excluir admins del listado de clientes). */
  role?: RolTrustpayApi;
  search?: string;
};

export async function listarUsuariosAdmin(
  token: string,
  pagina: number,
  limite: number,
  filtros?: FiltrosListadoUsuariosAdmin
) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    limit: String(limite),
  });
  if (filtros?.role) consulta.set("role", filtros.role);
  if (filtros?.search) consulta.set("search", filtros.search);
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
  datos: {
    role: RolTrustpayApi;
    isActive: boolean;
    email?: string;
    country?: string;
    walletAddress?: string | null;
  }
) {
  const cuerpo: {
    role: RolTrustpayApi;
    isActive: boolean;
    email?: string;
    country?: string;
    walletAddress?: string | null;
  } = {
    role: datos.role,
    isActive: datos.isActive,
  };
  if (typeof datos.email === "string") cuerpo.email = datos.email.trim();
  if (typeof datos.country === "string") cuerpo.country = datos.country.trim();
  if (datos.walletAddress !== undefined) {
    const limpia =
      typeof datos.walletAddress === "string" ? datos.walletAddress.trim() : datos.walletAddress;
    cuerpo.walletAddress = limpia && limpia.length > 0 ? limpia : null;
  }

  return solicitudJson<UsuarioTrustpayRespuesta>(`/admin/users/${encodeURIComponent(idUsuario)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(cuerpo),
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

/** Marca un usuario como verificado en backend admin. */
export async function verificarUsuarioAdmin(token: string, idUsuario: string) {
  return solicitudJson<UsuarioTrustpayRespuesta | void>(
    `/admin/users/${encodeURIComponent(idUsuario)}/verify`,
    {
      method: "POST",
      token,
    }
  );
}

// --- Métricas escrow + comisión (admin) ---

export type ComisionAdminRespuesta = {
  commissionBps: number;
  updatedAt: string;
};

export type FilaMetricaMerchant = {
  userId: string;
  email: string;
  totalPayments: number;
  volumeLamports: string;
  volumeSol: string;
  estimatedCommissionLamports: string;
  estimatedCommissionSol: string;
  businessCount: number;
};

export type MetricasMerchantsPaginado = {
  commissionBps: number;
  data: FilaMetricaMerchant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function obtenerComisionAdmin(token: string) {
  return solicitudJson<ComisionAdminRespuesta>("/admin/settings/commission", {
    method: "GET",
    token,
  });
}

export async function actualizarComisionAdmin(token: string, commissionBps: number) {
  return solicitudJson<ComisionAdminRespuesta>("/admin/settings/commission", {
    method: "PATCH",
    token,
    body: JSON.stringify({ commissionBps }),
  });
}

export type ConsultaMetricasMerchants = {
  page?: number;
  limit?: number;
  sort?: "count" | "volume";
  from?: string;
  to?: string;
};

export async function obtenerMetricasMerchantsAdmin(
  token: string,
  consulta: ConsultaMetricasMerchants = {}
) {
  const q = new URLSearchParams();
  if (consulta.page != null) q.set("page", String(consulta.page));
  if (consulta.limit != null) q.set("limit", String(consulta.limit));
  if (consulta.sort) q.set("sort", consulta.sort);
  if (consulta.from) q.set("from", consulta.from);
  if (consulta.to) q.set("to", consulta.to);
  const sufijo = q.toString() ? `?${q.toString()}` : "";
  return solicitudJson<MetricasMerchantsPaginado>(
    `/admin/metrics/merchants/payments${sufijo}`,
    { method: "GET", token }
  );
}

const LAMPORTS_PER_SOL_BIG = BigInt("1000000000");

/** Suma volumen y comisión recorriendo todas las páginas (máx. 100 por página en API). */
export async function agregarMetricasMerchantsTodasLasPaginas(token: string) {
  const limit = 100;
  let page = 1;
  let commissionBps = 0;
  let totalMerchants = 0;
  let totalPagos = 0;
  let volumenLamports = BigInt(0);
  let comisionLamports = BigInt(0);
  let totalPages = 1;

  while (page <= totalPages) {
    const r = await obtenerMetricasMerchantsAdmin(token, { page, limit, sort: "volume" });
    commissionBps = r.commissionBps;
    totalMerchants = r.total;
    totalPages = r.totalPages;
    for (const row of r.data) {
      totalPagos += row.totalPayments;
      volumenLamports += BigInt(row.volumeLamports || "0");
      comisionLamports += BigInt(row.estimatedCommissionLamports || "0");
    }
    page += 1;
  }

  return {
    commissionBps,
    totalMerchants,
    totalPagos,
    volumenLamports,
    volumenSol: formatearLamportsASol(volumenLamports),
    comisionLamports,
    comisionSol: formatearLamportsASol(comisionLamports),
  };
}

export function formatearLamportsASol(lamports: bigint): string {
  const whole = lamports / LAMPORTS_PER_SOL_BIG;
  const frac = lamports % LAMPORTS_PER_SOL_BIG;
  if (frac === BigInt(0)) return whole.toString();
  const fracStr = frac.toString().padStart(9, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}

// --- Series temporales + distribución (admin) ---

export type PuntoSeriePagos = {
  bucketStart: string;
  paymentCount: number;
  volumeLamports: string;
  volumeSol: string;
};

export type SeriePagosAdminRespuesta = {
  groupBy: "day" | "week";
  buckets: number;
  range: { from: string; to: string };
  data: PuntoSeriePagos[];
};

export type DistribucionMerchantsAdminRespuesta = {
  totalMerchants: number;
  nuevos: number;
  bajoVolumen: number;
  medio: number;
  altoValor: number;
};

export async function obtenerSeriePagosAdmin(
  token: string,
  consulta: { groupBy?: "day" | "week"; buckets?: number } = {}
) {
  const q = new URLSearchParams();
  if (consulta.groupBy) q.set("groupBy", consulta.groupBy);
  if (consulta.buckets != null) q.set("buckets", String(consulta.buckets));
  const sufijo = q.toString() ? `?${q.toString()}` : "";
  return solicitudJson<SeriePagosAdminRespuesta>(
    `/admin/metrics/payments/timeseries${sufijo}`,
    { method: "GET", token }
  );
}

export async function obtenerDistribucionMerchantsAdmin(token: string) {
  return solicitudJson<DistribucionMerchantsAdminRespuesta>(
    `/admin/metrics/merchants/distribution`,
    { method: "GET", token }
  );
}

// --- Comercio (merchant): negocios y pagos escrow (JWT) ---

export type NegocioTrustpay = {
  id: string;
  name: string;
  walletAddress: string;
  description: string | null;
  category?: string | null;
  logoUrl?: string | null;
  isVerified?: boolean;
  isActive: boolean;
  solanaTxRegister?: string | null;
  createdAt: string;
};

export type RespuestaPaginada<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PagoEscrowMerchantItem = {
  id: string;
  transactionId: string;
  orderId: string | null;
  status: string;
  amount: number;
  sellerWallet: string;
  buyerWallet: string | null;
  escrowPda: string | null;
  qrImageUrl: string | null;
  solanaPayUrl: string;
  paidAt: string | null;
  shippedAt: string | null;
  releasedAt: string | null;
  autoReleaseAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export async function listarNegociosUsuario(token: string, page = 1, limit = 50) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return solicitudJson<RespuestaPaginada<NegocioTrustpay>>(`/businesses?${q}`, {
    method: "GET",
    token,
  });
}

export async function listarPagosEscrowNegocio(
  token: string,
  businessId: string,
  page = 1,
  limit = 20
) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return solicitudJson<RespuestaPaginada<PagoEscrowMerchantItem>>(
    `/businesses/${encodeURIComponent(businessId)}/payments?${q}`,
    { method: "GET", token }
  );
}

// --- Compatibilidad con módulos legacy de "negocios" ---

function normalizarListadoNegocios(
  crudo: unknown,
  page: number,
  limit: number
): { negocios: NegocioTrustpay[]; total: number; page: number; limit: number; totalPages: number } {
  if (Array.isArray(crudo)) {
    const negocios = crudo as NegocioTrustpay[];
    return {
      negocios,
      total: negocios.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(negocios.length / Math.max(1, limit))),
    };
  }
  if (crudo && typeof crudo === "object") {
    const o = crudo as Record<string, unknown>;
    const posibleLista = o.data ?? o.items ?? o.businesses ?? o.negocios;
    const negocios = Array.isArray(posibleLista) ? (posibleLista as NegocioTrustpay[]) : [];
    const total = typeof o.total === "number" ? o.total : negocios.length;
    const outPage = typeof o.page === "number" ? o.page : page;
    const outLimit = typeof o.limit === "number" ? o.limit : limit;
    const totalPages =
      typeof o.totalPages === "number"
        ? o.totalPages
        : Math.max(1, Math.ceil(total / Math.max(1, outLimit)));
    return { negocios, total, page: outPage, limit: outLimit, totalPages };
  }
  return { negocios: [], total: 0, page, limit, totalPages: 1 };
}

export async function listarNegociosTrustpay(token: string, page = 1, limit = 50) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  const crudo = await solicitudJson<unknown>(`/businesses?${q}`, {
    method: "GET",
    token,
  });
  return normalizarListadoNegocios(crudo, page, limit);
}

export async function crearNegocioTrustpay(
  token: string,
  datos: {
    name: string;
    description?: string | null;
    category?: string | null;
    logoUrl?: string | null;
    walletAddress: string;
  }
) {
  return solicitudJson<NegocioTrustpay>("/businesses", {
    method: "POST",
    token,
    body: JSON.stringify({
      name: datos.name.trim(),
      description: datos.description ?? null,
      category: datos.category ?? null,
      logoUrl: datos.logoUrl ?? null,
      walletAddress: datos.walletAddress.trim(),
    }),
  });
}

export async function obtenerNegocioTrustpay(token: string, idNegocio: string) {
  return solicitudJson<NegocioTrustpay>(`/businesses/${encodeURIComponent(idNegocio)}`, {
    method: "GET",
    token,
  });
}

export async function actualizarNegocioTrustpay(
  token: string,
  idNegocio: string,
  datos: { name: string; description?: string | null; category?: string | null; logoUrl?: string | null }
) {
  return solicitudJson<NegocioTrustpay>(`/businesses/${encodeURIComponent(idNegocio)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({
      name: datos.name.trim(),
      description: datos.description ?? null,
      category: datos.category ?? undefined,
      logoUrl: datos.logoUrl ?? undefined,
    }),
  });
}

export async function eliminarNegocioTrustpay(token: string, idNegocio: string) {
  return solicitudJson<void>(`/businesses/${encodeURIComponent(idNegocio)}`, {
    method: "DELETE",
    token,
  });
}

export async function verificarNegocioTrustpay(token: string, idNegocio: string) {
  return solicitudJson<NegocioTrustpay | void>(`/businesses/${encodeURIComponent(idNegocio)}/verify`, {
    method: "POST",
    token,
  });
}

export async function crearQrNegocioTrustpay(
  token: string,
  idNegocio: string,
  datos: {
    label: string;
    type?: string;
    amountLamports?: string | null;
    tokenMint?: string | null;
  }
) {
  return solicitudJson<unknown>(`/businesses/${encodeURIComponent(idNegocio)}/qr-codes`, {
    method: "POST",
    token,
    body: JSON.stringify({
      label: datos.label.trim(),
      type: datos.type ?? "branch",
      amountLamports: datos.amountLamports ?? null,
      tokenMint: datos.tokenMint ?? null,
    }),
  });
}

export async function listarQrCodesNegocioTrustpay(
  token: string,
  idNegocio: string,
  page = 1,
  limit = 20
) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  const crudo = await solicitudJson<unknown>(
    `/businesses/${encodeURIComponent(idNegocio)}/qr-codes?${q.toString()}`,
    { method: "GET", token }
  );
  if (crudo && typeof crudo === "object") {
    const o = crudo as Record<string, unknown>;
    const items = Array.isArray(o.items) ? o.items : Array.isArray(o.data) ? o.data : [];
    const total = typeof o.total === "number" ? o.total : items.length;
    const outPage = typeof o.page === "number" ? o.page : page;
    const outLimit = typeof o.limit === "number" ? o.limit : limit;
    const totalPages =
      typeof o.totalPages === "number"
        ? o.totalPages
        : Math.max(1, Math.ceil(total / Math.max(1, outLimit)));
    return { items, total, page: outPage, limit: outLimit, totalPages };
  }
  return { items: [], total: 0, page, limit, totalPages: 1 };
}
