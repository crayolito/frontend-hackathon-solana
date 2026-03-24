"use client";

import { useEffect, useState } from "react";
import estilosDev from "./desarrollador.module.css";
import estilos from "./transacciones.module.css";
import { obtenerTokenSesion } from "../../demoAuth";
import {
  ErrorApiTrustpay,
  agregarMetricasMisNegocios,
  obtenerSeriePagosMerchant,
  obtenerEmbudoPagosMerchant,
  listarPagosRecientesTodosNegocios,
  type PagoConNegocio,
} from "../../_lib/apiTrustpay";

function acortarId(id: string, izq = 8, der = 4): string {
  if (id.length <= izq + der + 1) return id;
  return `${id.slice(0, izq)}…${id.slice(-der)}`;
}

function formatearFechaRelativa(iso: string): string {
  try {
    const d = new Date(iso);
    const ahora = new Date();
    const mismoDia =
      d.getFullYear() === ahora.getFullYear() &&
      d.getMonth() === ahora.getMonth() &&
      d.getDate() === ahora.getDate();
    const hora = d.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (mismoDia) return `Hoy · ${hora}`;
    const ayer = new Date(ahora);
    ayer.setDate(ayer.getDate() - 1);
    const esAyer =
      d.getFullYear() === ayer.getFullYear() &&
      d.getMonth() === ayer.getMonth() &&
      d.getDate() === ayer.getDate();
    if (esAyer) return `Ayer · ${hora}`;
    return d.toLocaleString("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function etiquetaEstadoPago(status: string): "ok" | "pendiente" {
  if (status === "released" || status === "auto_released") return "ok";
  return "pendiente";
}

function textoEstado(status: string): string {
  const m: Record<string, string> = {
    pending: "Pendiente de pago",
    escrow_locked: "En escrow",
    shipped: "Enviado",
    released: "Liberado",
    auto_released: "Liberado",
    disputed: "En disputa",
    refunded: "Reembolsado",
    expired: "Expirado",
  };
  return m[status] ?? status;
}

function montoFormateado(p: PagoConNegocio): string {
  const sol = typeof p.amount === "number" ? p.amount : 0;
  const signo = sol >= 0 ? "+" : "";
  const token = p.tokenMint ? " (token)" : "";
  return `${signo}${Math.abs(sol).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })} SOL${token}`;
}

export default function ContenidoTransaccionesCliente() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagosHoy, setPagosHoy] = useState("—");
  const [volumenSol, setVolumenSol] = useState("—");
  const [pendientes, setPendientes] = useState("—");
  const [tasaOk, setTasaOk] = useState("—");
  const [filas, setFilas] = useState<PagoConNegocio[]>([]);

  useEffect(() => {
    const token = obtenerTokenSesion();
    if (!token) {
      setCargando(false);
      setError("Iniciá sesión para ver tus transacciones.");
      return;
    }

    let cancelado = false;
    (async () => {
      try {
        const [agg, serie, embudo, movimientos] = await Promise.all([
          agregarMetricasMisNegocios(token),
          obtenerSeriePagosMerchant(token, { groupBy: "day", buckets: 1 }),
          obtenerEmbudoPagosMerchant(token),
          listarPagosRecientesTodosNegocios(token, 35),
        ]);
        if (cancelado) return;

        const hoyPunto = serie.data[serie.data.length - 1];
        setPagosHoy(String(hoyPunto?.paymentCount ?? 0));
        setVolumenSol(`${agg.volumenSol} SOL`);

        const pend = embudo.countsByStatus?.pending ?? 0;
        setPendientes(String(pend));

        const lib = embudo.steps?.find((s) => s.key === "liberados");
        setTasaOk(
          lib != null && typeof lib.percentOfFirst === "number"
            ? `${lib.percentOfFirst.toLocaleString("es-AR", {
                maximumFractionDigits: 1,
              })} %`
            : "—"
        );

        setFilas(movimientos);
        setError(null);
      } catch (e) {
        if (cancelado) return;
        if (e instanceof ErrorApiTrustpay) {
          setError(e.message);
        } else {
          setError("No se pudieron cargar las transacciones.");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className={estilos.contenedor}>
      {error ? (
        <p
          className={estilosDev.subtituloTarjeta}
          style={{ color: "var(--error, #b91c1c)", marginBottom: 16 }}
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <dl className={estilos.resumenFila} aria-label="Resumen de actividad">
        <div className={estilos.celdaResumen}>
          <dt>Pagos hoy</dt>
          <dd>{cargando ? "…" : pagosHoy}</dd>
        </div>
        <div className={estilos.celdaResumen}>
          <dt>Volumen total (métricas)</dt>
          <dd>{cargando ? "…" : volumenSol}</dd>
        </div>
        <div className={estilos.celdaResumen}>
          <dt>Pendientes de pago</dt>
          <dd>{cargando ? "…" : pendientes}</dd>
        </div>
        <div className={estilos.celdaResumen}>
          <dt>Órdenes liberadas (del total)</dt>
          <dd>{cargando ? "…" : tasaOk}</dd>
        </div>
      </dl>

      <section className={estilosDev.tarjeta}>
        <div className={estilosDev.cabeceraTarjeta}>
          <div>
            <h2 className={estilosDev.tituloTarjeta}>Últimos movimientos</h2>
            <p className={estilosDev.subtituloTarjeta}>
              Pagos reales de tus negocios (ordenados por fecha de creación).
            </p>
          </div>
        </div>
        <div className={estilosDev.cuerpoTarjeta} style={{ paddingTop: 8 }}>
          {cargando ? (
            <p className={estilosDev.subtituloTarjeta}>Cargando…</p>
          ) : filas.length === 0 ? (
            <p className={estilosDev.subtituloTarjeta}>
              Todavía no hay pagos registrados.
            </p>
          ) : (
            <ul className={estilos.lista}>
              {filas.map((f) => {
                const estadoUi = etiquetaEstadoPago(f.status);
                return (
                  <li key={f.id} className={estilos.fila}>
                    <div className={estilos.filaIzq}>
                      <p className={estilos.filaTitulo}>{f.businessName}</p>
                      <p className={estilos.filaMeta}>
                        {acortarId(f.transactionId, 10, 6)}
                        {f.orderId ? ` · Pedido ${f.orderId}` : ""} ·{" "}
                        {textoEstado(f.status)}
                      </p>
                      <p className={estilos.filaMeta} style={{ marginTop: 4 }}>
                        {formatearFechaRelativa(f.createdAt)}
                      </p>
                    </div>
                    <div className={estilos.filaDer}>
                      <p className={estilos.monto}>{montoFormateado(f)}</p>
                      {estadoUi === "ok" ? (
                        <span className={estilos.badgeOk}>Completado</span>
                      ) : (
                        <span className={estilos.badgePend}>En curso</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
