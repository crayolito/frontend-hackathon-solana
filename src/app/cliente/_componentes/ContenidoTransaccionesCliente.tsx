"use client";

import estilosDev from "./desarrollador.module.css";
import estilos from "./transacciones.module.css";

// Movimientos de ejemplo para la demo (sin API ni webhooks).
const KPI_DEMO = {
  hoy: "12",
  volumen: "48,2 SOL",
  pendientes: "2",
  tasaOk: "98 %",
};

const FILAS_DEMO = [
  {
    id: "tx_7k2m…9pq",
    negocio: "Sucursal Centro",
    concepto: "QR mostrador · SOL",
    monto: "+2,40 SOL",
    estado: "ok" as const,
    fecha: "Hoy · 14:32",
  },
  {
    id: "tx_3n8r…1wx",
    negocio: "Delivery Norte",
    concepto: "Pago enlace",
    monto: "+0,85 SOL",
    estado: "ok" as const,
    fecha: "Hoy · 11:05",
  },
  {
    id: "tx_9b1c…4yz",
    negocio: "Sucursal Centro",
    concepto: "QR mostrador · USDC",
    monto: "+18,50 USDC",
    estado: "pendiente" as const,
    fecha: "Ayer · 19:44",
  },
  {
    id: "tx_2d5e…8ab",
    negocio: "Kiosco Sur",
    concepto: "QR mostrador · SOL",
    monto: "+1,12 SOL",
    estado: "ok" as const,
    fecha: "Ayer · 16:20",
  },
  {
    id: "tx_6f0g…2cd",
    negocio: "Delivery Norte",
    concepto: "Reembolso parcial",
    monto: "−0,30 SOL",
    estado: "ok" as const,
    fecha: "20 mar · 09:15",
  },
  {
    id: "tx_4h7j…5ef",
    negocio: "Sucursal Centro",
    concepto: "QR mostrador · SOL",
    monto: "+3,00 SOL",
    estado: "pendiente" as const,
    fecha: "19 mar · 22:01",
  },
];

// Vista solo lectura con datos fijos para la hackathon (sin formularios).
export default function ContenidoTransaccionesCliente() {
  return (
    <div className={estilos.contenedor}>
      <dl className={estilos.resumenFila} aria-label="Resumen de actividad demo">
        <div className={estilos.celdaResumen}>
          <dt>Pagos hoy</dt>
          <dd>{KPI_DEMO.hoy}</dd>
        </div>
        <div className={estilos.celdaResumen}>
          <dt>Volumen (demo)</dt>
          <dd>{KPI_DEMO.volumen}</dd>
        </div>
        <div className={estilos.celdaResumen}>
          <dt>Pendientes</dt>
          <dd>{KPI_DEMO.pendientes}</dd>
        </div>
        <div className={estilos.celdaResumen}>
          <dt>Confirmados OK</dt>
          <dd>{KPI_DEMO.tasaOk}</dd>
        </div>
      </dl>

      <section className={estilosDev.tarjeta}>
        <div className={estilosDev.cabeceraTarjeta}>
          <div>
            <h2 className={estilosDev.tituloTarjeta}>Últimos movimientos</h2>
            <p className={estilosDev.subtituloTarjeta}>
              Datos estáticos para la presentación; después se conectan al backend.
            </p>
          </div>
        </div>
        <div className={estilosDev.cuerpoTarjeta} style={{ paddingTop: 8 }}>
          <ul className={estilos.lista}>
            {FILAS_DEMO.map((f) => (
              <li key={f.id} className={estilos.fila}>
                <div className={estilos.filaIzq}>
                  <p className={estilos.filaTitulo}>{f.negocio}</p>
                  <p className={estilos.filaMeta}>
                    {f.id} · {f.concepto}
                  </p>
                  <p className={estilos.filaMeta} style={{ marginTop: 4 }}>
                    {f.fecha}
                  </p>
                </div>
                <div className={estilos.filaDer}>
                  <p className={estilos.monto}>{f.monto}</p>
                  {f.estado === "ok" ? (
                    <span className={estilos.badgeOk}>Confirmado</span>
                  ) : (
                    <span className={estilos.badgePend}>Pendiente</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
