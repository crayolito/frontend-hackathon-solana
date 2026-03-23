"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ErrorApiTrustpay, listarNegociosTrustpay } from "../../../_lib/apiTrustpay";
import { obtenerTokenSesion } from "../../../demoAuth";
import estilosDev from "../desarrollador.module.css";
import { useNotificacion } from "../../../_componentes/ProveedorNotificaciones";
import { MAX_NEGOCIOS_POR_COMERCIO } from "./constantesNegocios";

// Bloque en el panel principal: enlace a negocios y conteo desde el API.
export default function ResumenNegociosEnPanel() {
  const { mostrarNotificacion } = useNotificacion();
  const [total, setTotal] = useState<number | null>(null);
  const [falloCarga, setFalloCarga] = useState(false);

  useEffect(() => {
    const token = obtenerTokenSesion();
    if (!token) return;
    let cancelado = false;
    void (async () => {
      try {
        const { total: t } = await listarNegociosTrustpay(token, 1, MAX_NEGOCIOS_POR_COMERCIO);
        if (!cancelado) {
          setTotal(t);
          setFalloCarga(false);
        }
      } catch (e) {
        if (!cancelado) {
          const texto =
            e instanceof ErrorApiTrustpay ? e.message : "No se pudo cargar negocios.";
          mostrarNotificacion(texto);
          setFalloCarga(true);
        }
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [mostrarNotificacion]);

  return (
    <section className={estilosDev.tarjeta} style={{ marginTop: 18 }}>
      <div className={estilosDev.cabeceraTarjeta}>
        <div>
          <h2 className={estilosDev.tituloTarjeta}>Tus negocios</h2>
          <p className={estilosDev.subtituloTarjeta}>
            Hasta {MAX_NEGOCIOS_POR_COMERCIO} negocios por cuenta. Registrá locales, QRs de cobro y
            métricas (demo) por cada uno.
          </p>
        </div>
        <Link href="/cliente/negocios" className={estilosDev.botonPrimario}>
          Ir a negocios
        </Link>
      </div>
      <div className={estilosDev.cuerpoTarjeta}>
        {!falloCarga && total !== null ? (
          <p style={{ margin: 0, color: "var(--texto-secundario)" }}>
            Tenés <strong>{total}</strong> de {MAX_NEGOCIOS_POR_COMERCIO} negocios registrados.
          </p>
        ) : null}
        {!falloCarga && total === null ? (
          <p style={{ margin: 0, color: "var(--texto-secundario)" }}>Cargando resumen…</p>
        ) : null}
        {falloCarga ? (
          <p style={{ margin: 0, color: "var(--texto-secundario)" }}>
            No pudimos cargar el resumen; revisá la notificación arriba a la derecha.
          </p>
        ) : null}
      </div>
    </section>
  );
}
