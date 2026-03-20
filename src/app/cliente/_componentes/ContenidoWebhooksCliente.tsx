"use client";

import { useCallback, useState } from "react";

import estilos from "./desarrollador.module.css";

const eventosDemo = [
  "escrow.created",
  "escrow.released",
  "escrow.disputed",
  "escrow.cancelled",
  "payment.succeeded",
  "payout.failed",
];

const entregasDemo = [
  { estado: "200 OK", ok: true, id: "evt_9a2b7…", tipo: "escrow.created", fecha: "2023-10-27 14:30:12" },
  { estado: "500 ERR", ok: false, id: "evt_8c1d4…", tipo: "escrow.released", fecha: "2023-10-27 14:28:45" },
  { estado: "200 OK", ok: true, id: "evt_3f5e9…", tipo: "payment.succeeded", fecha: "2023-10-27 14:15:20" },
];

// Endpoints, eventos y bitácora de entregas para el comercio (demo).
export default function ContenidoWebhooksCliente() {
  const [eventosSeleccionados, setEventosSeleccionados] = useState<Record<string, boolean>>(() => {
    const inicial: Record<string, boolean> = {};
    eventosDemo.forEach((e, i) => {
      inicial[e] = i < 2;
    });
    return inicial;
  });

  const alternarEvento = useCallback((nombre: string) => {
    setEventosSeleccionados((prev) => ({ ...prev, [nombre]: !prev[nombre] }));
  }, []);

  const agregarDemo = useCallback(() => {
    window.alert("Demo: se guardaría el endpoint y los eventos.");
  }, []);

  const pruebaDemo = useCallback(() => {
    window.alert("Demo: se enviaría un payload de prueba.");
  }, []);

  const limpiarLogs = useCallback(() => {
    window.alert("Demo: se borrarían los registros de entrega.");
  }, []);

  return (
    <div className={estilos.contenedor}>
      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <div>
            <h2 className={estilos.tituloTarjeta}>Nuevo endpoint</h2>
            <p className={estilos.subtituloTarjeta}>
              Define la URL donde recibirás notificaciones de eventos.
            </p>
          </div>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <label className={estilos.etiqueta} htmlFor="url-webhook">
            URL del endpoint
          </label>
          <input
            id="url-webhook"
            className={estilos.input}
            type="url"
            placeholder="https://tu-api.com/webhooks/compra-segura"
          />
          <p className={estilos.subtituloTarjeta} style={{ marginTop: 18 }}>
            Eventos a escuchar
          </p>
          <div className={estilos.eventosGrid}>
            {eventosDemo.map((ev) => (
              <label key={ev} className={estilos.filaCheck}>
                <input
                  type="checkbox"
                  checked={eventosSeleccionados[ev] ?? false}
                  onChange={() => alternarEvento(ev)}
                />
                <span className={estilos.mono}>{ev}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={estilos.pieTarjeta}>
          <button type="button" className={estilos.botonPrimario} onClick={agregarDemo}>
            Añadir endpoint
          </button>
        </div>
      </section>

      <section>
        <h2 className={estilos.tituloTarjeta} style={{ marginBottom: 12 }}>
          Endpoints activos
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className={estilos.tarjetaEndpoint}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
              <div className={estilos.iconoEstado} style={{ background: "#d1fae5" }} aria-hidden>
                ✓
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: "0.95rem" }}>API producción</strong>
                  <span className={estilos.badgeVerde}>Operativo</span>
                </div>
                <code className={estilos.mono} style={{ color: "#64748b" }}>
                  https://api.myapp.com/v1/webhooks/cs-secure
                </code>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className={estilos.botonSecundario} onClick={pruebaDemo}>
                Enviar prueba
              </button>
              <button type="button" className={estilos.botonSecundario} aria-label="Eliminar">
                🗑
              </button>
            </div>
          </div>
          <div className={estilos.tarjetaEndpoint}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
              <div className={estilos.iconoEstado} style={{ background: "#fee2e2" }} aria-hidden>
                !
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: "0.95rem" }}>Entorno staging</strong>
                  <span className={estilos.badgeRojo}>Error (500)</span>
                </div>
                <code className={estilos.mono} style={{ color: "#64748b" }}>
                  https://staging.myapp.com/webhooks
                </code>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className={estilos.botonSecundario} onClick={pruebaDemo}>
                Enviar prueba
              </button>
              <button type="button" className={estilos.botonSecundario} aria-label="Eliminar">
                🗑
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Entregas recientes</h2>
          <button
            type="button"
            className={estilos.enlace}
            style={{ border: 0, background: "none", cursor: "pointer" }}
            onClick={limpiarLogs}
          >
            Limpiar logs
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className={estilos.tabla}>
            <thead>
              <tr>
                <th>Estado</th>
                <th>ID evento</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th style={{ textAlign: "right" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {entregasDemo.map((fila) => (
                <tr key={fila.id}>
                  <td>
                    <span className={fila.ok ? estilos.badgeVerde : estilos.badgeRojo}>{fila.estado}</span>
                  </td>
                  <td className={estilos.mono}>{fila.id}</td>
                  <td>{fila.tipo}</td>
                  <td style={{ color: "#64748b" }}>{fila.fecha}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className={estilos.enlace}
                      style={{ border: 0, background: "none", cursor: "pointer" }}
                    >
                      Ver payload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 22px",
            background: "#f9fafb",
            borderTop: "1px solid #f0f0f5",
            fontSize: "0.78rem",
            color: "#64748b",
          }}
        >
          <span>Los registros se conservan 7 días (demo).</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className={estilos.botonSecundario} disabled>
              Anterior
            </button>
            <button type="button" className={estilos.botonSecundario}>
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
