"use client";

import { useCallback, useState } from "react";

import estilos from "./desarrollador.module.css";

// Perfil del negocio, wallet de cobros, notificaciones y equipo (demo).
export default function ContenidoCuentaSettingsCliente() {
  const [pushActivo, setPushActivo] = useState(true);
  const [emailActivo, setEmailActivo] = useState(true);

  const guardarPerfil = useCallback(() => {
    window.alert("Demo: se guardarían los datos del negocio.");
  }, []);

  const actualizarWallet = useCallback(() => {
    window.alert("Demo: se aplicaría la verificación de 24 h sobre retiros.");
  }, []);

  const desactivar = useCallback(() => {
    window.alert("Demo: en producción se pediría confirmación adicional.");
  }, []);

  return (
    <div className={estilos.contenedor}>
      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Perfil del negocio</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <div className={estilos.grid2}>
            <div>
              <label className={estilos.etiqueta} htmlFor="nombre-negocio">
                Nombre comercial
              </label>
              <input id="nombre-negocio" className={estilos.input} type="text" defaultValue="Acme Corp" />
            </div>
            <div>
              <label className={estilos.etiqueta} htmlFor="sitio">
                Sitio web
              </label>
              <input id="sitio" className={estilos.input} type="url" defaultValue="https://acme.example.com" />
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <span className={estilos.etiqueta}>Logo</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  border: "2px dashed #cbd5e1",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                }}
              >
                IMG
              </div>
              <button type="button" className={estilos.botonSecundario}>
                Subir logo
              </button>
            </div>
          </div>
        </div>
        <div className={estilos.pieTarjeta}>
          <button type="button" className={estilos.botonPrimario} onClick={guardarPerfil}>
            Guardar cambios
          </button>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Wallet de cobros</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <label className={estilos.etiqueta} htmlFor="sol">
            Dirección Solana (SOL)
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <input
              id="sol"
              className={estilos.input}
              style={{ flex: "1 1 280px" }}
              type="text"
              defaultValue="HN7cABqLFs2NXpPLU7xy3pUpxW7H3XF6L"
            />
            <button type="button" className={estilos.botonPrimario} onClick={actualizarWallet}>
              Actualizar
            </button>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #fcd34d",
              background: "#fffbeb",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span aria-hidden>⚠</span>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#92400e" }}>
              <strong>Seguridad:</strong> cambiar la dirección de cobro puede activar una verificación de 24 h
              en retiros.
            </p>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Notificaciones</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <label style={{ display: "block", cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="checkbox"
                checked={pushActivo}
                onChange={(e) => setPushActivo(e.target.checked)}
              />
              <span>
                <strong style={{ fontSize: "0.95rem" }}>Notificaciones en el navegador</strong>
                <p className={estilos.subtituloTarjeta} style={{ marginTop: 4 }}>
                  Alertas en tiempo real por ventas y disputas.
                </p>
              </span>
            </div>
          </label>
          <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />
          <label style={{ display: "block", cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="checkbox"
                checked={emailActivo}
                onChange={(e) => setEmailActivo(e.target.checked)}
              />
              <span>
                <strong style={{ fontSize: "0.95rem" }}>Correo</strong>
                <p className={estilos.subtituloTarjeta} style={{ marginTop: 4 }}>
                  Resúmenes diarios de cobros y reportes semanales.
                </p>
              </span>
            </div>
          </label>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Equipo</h2>
          <button type="button" className={estilos.enlace} style={{ border: 0, background: "none", cursor: "pointer" }}>
            + Invitar
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className={estilos.tabla}>
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Rol</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#e0e7ff",
                        color: "#4338ca",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                      }}
                    >
                      JS
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>John Smith (tú)</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>john@acme.example.com</div>
                    </div>
                  </div>
                </td>
                <td>Admin</td>
                <td>
                  <span className={estilos.badgeVerde}>Activo</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#d1fae5",
                        color: "#047857",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                      }}
                    >
                      SM
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>Sarah Miller</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>sarah@acme.example.com</div>
                    </div>
                  </div>
                </td>
                <td>Manager</td>
                <td>
                  <span className={estilos.badgeVerde}>Activo</span>
                </td>
                <td>⋯</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={estilos.zonaPeligro}>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: "0.75rem", color: "#991b1b" }}>
            Zona de riesgo
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "0.88rem", color: "#b91c1c" }}>
            Desactivar la cuenta detiene cobros y el acceso al historial.
          </p>
        </div>
        <button type="button" className={estilos.botonPeligro} onClick={desactivar}>
          Desactivar cuenta
        </button>
      </section>
    </div>
  );
}
