"use client";

import Link from "next/link";
import { useCallback } from "react";

import type { ClienteDemo } from "../../_datos/datosCuentasAdminDemo";
import { obtenerTransaccionesPorCliente } from "../../_datos/datosCuentasAdminDemo";
import TablaTransaccionesAdmin from "../transacciones/TablaTransaccionesAdmin";
import estilos from "./detalle-cliente.module.css";

type Props = {
  cliente: ClienteDemo;
};

function claseEstado(estado: ClienteDemo["estado"]) {
  switch (estado) {
    case "activo":
      return estilos.estadoActivo;
    case "pendiente":
      return estilos.estadoPendiente;
    case "suspendido":
      return estilos.estadoSuspendido;
    default:
      return estilos.estadoPendiente;
  }
}

function etiquetaEstado(estado: ClienteDemo["estado"]) {
  const mapa: Record<ClienteDemo["estado"], string> = {
    activo: "Activo",
    pendiente: "Pendiente",
    suspendido: "Suspendido",
  };
  return mapa[estado];
}

// Vista de detalle: ficha + historial de transacciones del cliente (demo).
export default function DetalleClienteVista({ cliente }: Props) {
  const transacciones = obtenerTransaccionesPorCliente(cliente.id);

  const copiarCartera = useCallback(() => {
    void navigator.clipboard.writeText(cliente.cartera);
  }, [cliente.cartera]);

  return (
    <>
      <div className={estilos.barraVolver}>
        <Link className={estilos.enlaceVolver} href="/admin/customers">
          ← Volver a clientes
        </Link>
      </div>

      <section className={estilos.tarjetaFicha} aria-labelledby="titulo-cliente">
        <h1 id="titulo-cliente" className={estilos.tituloFicha}>
          {cliente.alias}
        </h1>
        <p className={estilos.metaFicha}>
          Cliente desde {cliente.registro} ·{" "}
          <span className={`${estilos.pillEstado} ${claseEstado(cliente.estado)}`}>
            {etiquetaEstado(cliente.estado)}
          </span>
        </p>

        <div className={estilos.gridDatos}>
          <div>
            <p className={estilos.etiquetaCampo}>Correo</p>
            <p className={estilos.valorCampo}>{cliente.correo}</p>
          </div>
          <div>
            <p className={estilos.etiquetaCampo}>ID interno</p>
            <p className={estilos.valorCampo}>{cliente.id}</p>
          </div>
          <div className={estilos.campoAncho}>
            <p className={estilos.etiquetaCampo}>Cartera Solana</p>
            <div className={estilos.filaCartera}>
              <span className={estilos.carteraCompleta}>{cliente.cartera}</span>
              <button type="button" className={estilos.botonCopiar} onClick={copiarCartera}>
                Copiar
              </button>
            </div>
          </div>
          <div>
            <p className={estilos.etiquetaCampo}>Volumen acumulado (demo)</p>
            <div className={estilos.filaVolumen}>
              <p className={estilos.valorCampo}>{cliente.volumenSolEtiqueta}</p>
              <p className={estilos.valorCampo}>{cliente.volumenUsdcEtiqueta}</p>
            </div>
          </div>
          <div>
            <p className={estilos.etiquetaCampo}>Transacciones totales</p>
            <p className={estilos.valorCampo}>{cliente.transaccionesTotal}</p>
          </div>
        </div>
      </section>

      <TablaTransaccionesAdmin
        filas={transacciones}
        titulo="Historial de transacciones"
        subtitulo="Movimientos asociados a esta cartera (logica tipo escrow / pago en Solana)."
      />
    </>
  );
}
