"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ErrorApiTrustpay,
  listarNegociosUsuario,
  listarPagosEscrowNegocio,
  type NegocioTrustpay,
  type PagoEscrowMerchantItem,
} from "../../_lib/apiTrustpay";
import { obtenerTokenSesion } from "../../demoAuth";
import estilos from "./tabla-pagos-cliente.module.css";

const LIMITE_PAGINA = 20;

function acortarId(id: string, n = 8) {
  if (id.length <= n + 2) return id;
  return `${id.slice(0, n)}…`;
}

function acortarWallet(w: string | null) {
  if (!w) return "—";
  if (w.length <= 12) return w;
  return `${w.slice(0, 4)}…${w.slice(-4)}`;
}

function claseEstado(status: string): string {
  switch (status) {
    case "pending":
      return estilos.estadoPendiente;
    case "escrow_locked":
      return estilos.estadoEscrow;
    case "shipped":
      return estilos.estadoEnviado;
    case "released":
    case "auto_released":
      return estilos.estadoOk;
    case "disputed":
      return estilos.estadoDisputa;
    default:
      return estilos.estadoOtro;
  }
}

function etiquetaEstado(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendiente",
    escrow_locked: "En escrow",
    shipped: "Enviado",
    released: "Liberado",
    auto_released: "Liberado (auto)",
    disputed: "Disputa",
    refunded: "Reembolsado",
    expired: "Expirado",
  };
  return map[status] ?? status;
}

function formatearFecha(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function ContenidoPagosCliente() {
  const [cargandoNegocios, setCargandoNegocios] = useState(true);
  const [cargandoPagos, setCargandoPagos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [negocios, setNegocios] = useState<NegocioTrustpay[]>([]);
  const [negocioId, setNegocioId] = useState<string>("");
  const [pagos, setPagos] = useState<PagoEscrowMerchantItem[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const token = obtenerTokenSesion();
      if (!token) {
        setError("No hay sesión.");
        setCargandoNegocios(false);
        return;
      }
      try {
        const r = await listarNegociosUsuario(token, 1, 50);
        if (cancelado) return;
        setNegocios(r.data);
        setNegocioId((prev) => prev || r.data[0]?.id || "");
        setError(null);
      } catch (e) {
        if (cancelado) return;
        if (e instanceof ErrorApiTrustpay) setError(e.message);
        else setError("No se pudieron cargar los negocios.");
      } finally {
        if (!cancelado) setCargandoNegocios(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  const cargarPagos = useCallback(async (bizId: string, page: number) => {
    const token = obtenerTokenSesion();
    if (!token || !bizId) return;
    setCargandoPagos(true);
    try {
      const r = await listarPagosEscrowNegocio(token, bizId, page, LIMITE_PAGINA);
      setPagos(r.data);
      setTotalPaginas(r.totalPages);
      setTotal(r.total);
      setPagina(r.page);
      setError(null);
    } catch (e) {
      if (e instanceof ErrorApiTrustpay) setError(e.message);
      else setError("No se pudieron cargar los pagos.");
    } finally {
      setCargandoPagos(false);
    }
  }, []);

  useEffect(() => {
    if (!negocioId) return;
    void cargarPagos(negocioId, 1);
  }, [negocioId, cargarPagos]);

  return (
    <div style={{ marginTop: 8 }}>
      {error ? (
        <p className={estilos.alerta} role="alert">
          {error}
        </p>
      ) : null}

      {cargandoNegocios ? (
        <p style={{ color: "var(--texto-secundario)", fontWeight: 600 }}>Cargando negocios…</p>
      ) : negocios.length === 0 ? (
        <p style={{ color: "var(--texto-secundario)", maxWidth: 520 }}>
          No tenés negocios activos. Creá un negocio desde la API o el flujo de registro para recibir pagos
          escrow y verlos aquí.
        </p>
      ) : (
        <>
          <div className={estilos.barraFiltros}>
            <span className={estilos.etiquetaFiltro}>Negocio</span>
            <select
              className={estilos.selectNegocio}
              value={negocioId}
              onChange={(e) => setNegocioId(e.target.value)}
              aria-label="Seleccionar negocio"
            >
              {negocios.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          <section className={estilos.tarjetaTabla} aria-busy={cargandoPagos}>
            {cargandoPagos && pagos.length === 0 ? (
              <p className={estilos.mensajeVacio}>Cargando pagos…</p>
            ) : pagos.length === 0 ? (
              <p className={estilos.mensajeVacio}>
                No hay pagos escrow para este negocio todavía. Los cobros con QR Solana Pay aparecerán aquí.
              </p>
            ) : (
              <>
                <div className={estilos.envoltorioTabla}>
                  <table className={estilos.tabla}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Pedido</th>
                        <th>Estado</th>
                        <th>Monto (SOL)</th>
                        <th>Comprador</th>
                        <th>Creado</th>
                        <th>Pagado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <span className={estilos.idCorta} title={p.id}>
                              {acortarId(p.id)}
                            </span>
                          </td>
                          <td>{p.orderId ?? "—"}</td>
                          <td>
                            <span className={`${estilos.badgeEstado} ${claseEstado(p.status)}`}>
                              {etiquetaEstado(p.status)}
                            </span>
                          </td>
                          <td className={estilos.monto}>
                            {Number.isFinite(p.amount)
                              ? p.amount.toLocaleString("es", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6,
                                })
                              : "—"}
                          </td>
                          <td>
                            <span className={estilos.walletCorta} title={p.buyerWallet ?? ""}>
                              {acortarWallet(p.buyerWallet)}
                            </span>
                          </td>
                          <td className={estilos.walletCorta}>{formatearFecha(p.createdAt)}</td>
                          <td className={estilos.walletCorta}>{formatearFecha(p.paidAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPaginas > 1 ? (
                  <div className={estilos.paginacion}>
                    <p className={estilos.textoPaginacion}>
                      {total} pago{total !== 1 ? "s" : ""} · página {pagina} de {totalPaginas}
                    </p>
                    <div className={estilos.botonesPag}>
                      <button
                        type="button"
                        className={estilos.botonPag}
                        disabled={cargandoPagos || pagina <= 1}
                        onClick={() => void cargarPagos(negocioId, pagina - 1)}
                      >
                        Anterior
                      </button>
                      <button
                        type="button"
                        className={estilos.botonPag}
                        disabled={cargandoPagos || pagina >= totalPaginas}
                        onClick={() => void cargarPagos(negocioId, pagina + 1)}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
