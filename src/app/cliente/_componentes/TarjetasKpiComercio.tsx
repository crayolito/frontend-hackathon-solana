"use client";

import { useEffect, useState } from "react";
import { estiloMascaraIcono } from "../../admin/_utilidades/estiloMascaraIcono";
import estilosMascara from "../../admin/_componentes/iconos-mascara.module.css";
import estilos from "../../admin/_componentes/dashboard/tarjetas-kpi-dashboard.module.css";
import { obtenerTokenSesion } from "../../demoAuth";
import {
  ErrorApiTrustpay,
  agregarMetricasMisNegocios,
  obtenerResumenEscrowMerchant,
} from "../../_lib/apiTrustpay";

/** KPIs reales: GET /metrics/my-businesses/payments + /metrics/my-businesses/escrow-locked */
export default function TarjetasKpiComercio() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volumenSol, setVolumenSol] = useState("—");
  const [totalPagos, setTotalPagos] = useState("—");
  const [negociosActivos, setNegociosActivos] = useState("—");
  const [escrowSol, setEscrowSol] = useState("—");

  useEffect(() => {
    const token = obtenerTokenSesion();
    if (!token) {
      setCargando(false);
      setError("Sin sesión");
      return;
    }

    let cancelado = false;
    (async () => {
      try {
        const [agg, escrow] = await Promise.all([
          agregarMetricasMisNegocios(token),
          obtenerResumenEscrowMerchant(token),
        ]);
        if (cancelado) return;
        setVolumenSol(agg.volumenSol);
        setTotalPagos(String(agg.totalPagos));
        setNegociosActivos(String(agg.negociosConActividad || agg.totalNegocios));
        setEscrowSol(escrow.totalLockedSol);
        setError(null);
      } catch (e) {
        if (cancelado) return;
        if (e instanceof ErrorApiTrustpay) {
          setError(e.message);
        } else {
          setError("No se pudieron cargar las métricas.");
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
    <section className={estilos.gridTarjetas} data-purpose="cliente-analytics-kpis">
      {error ? (
        <p
          className={estilos.nombreTarjeta}
          style={{ gridColumn: "1 / -1", color: "var(--error, #b91c1c)" }}
          role="alert"
        >
          Métricas: {error}
        </p>
      ) : null}

      <article className={estilos.tarjeta} data-tarjeta="volumen">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoIndigo}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-money.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeInfo}`}>Escrow</span>
        </div>
        <p className={estilos.nombreTarjeta}>Volumen (tus negocios)</p>
        <h3 className={estilos.valorTarjeta}>
          {cargando ? "…" : `${volumenSol} SOL`}
        </h3>
      </article>

      <article className={estilos.tarjeta} data-tarjeta="transacciones">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoAzul}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-transacciones.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeInfo}`}>API</span>
        </div>
        <p className={estilos.nombreTarjeta}>Pagos (conteo)</p>
        <h3 className={estilos.valorTarjeta}>{cargando ? "…" : totalPagos}</h3>
      </article>

      <article className={estilos.tarjeta} data-tarjeta="socios">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoVioleta}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-persona-unidas.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeInfo}`}>Negocios</span>
        </div>
        <p className={estilos.nombreTarjeta}>Con actividad (pagos)</p>
        <h3 className={estilos.valorTarjeta}>{cargando ? "…" : negociosActivos}</h3>
      </article>

      <article className={estilos.tarjeta} data-tarjeta="comision">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoRojo}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-exclamation.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeExito}`}>Bloqueado</span>
        </div>
        <p className={estilos.nombreTarjeta}>SOL aún en escrow</p>
        <h3 className={estilos.valorTarjeta}>
          {cargando ? "…" : `${escrowSol} SOL`}
        </h3>
      </article>
    </section>
  );
}
