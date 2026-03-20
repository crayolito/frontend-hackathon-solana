"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import estilos from "./desarrollador.module.css";

// Vista de claves publishable/secret y permisos para el comercio (demo, sin backend).
export default function ContenidoApiKeysCliente() {
  const [modoPrueba, setModoPrueba] = useState(true);
  const [mostrarSecreta, setMostrarSecreta] = useState(false);

  const copiarDemo = useCallback(() => {
    window.alert("Demo: en producción se copiaría al portapapeles.");
  }, []);

  const regenerarDemo = useCallback(() => {
    window.alert("Demo: se invalidaría la clave secreta anterior.");
  }, []);

  return (
    <div className={estilos.contenedor}>
      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <div>
            <h2 className={estilos.tituloTarjeta}>Modo de entorno</h2>
            <p className={estilos.subtituloTarjeta}>
              Cambia entre pruebas y producción para las claves mostradas (solo demo).
            </p>
          </div>
          <div className={estilos.toggleGrupo}>
            <button
              type="button"
              className={modoPrueba ? estilos.toggleBtnActivo : estilos.toggleBtn}
              onClick={() => setModoPrueba(true)}
            >
              Modo prueba
            </button>
            <button
              type="button"
              className={!modoPrueba ? estilos.toggleBtnActivo : estilos.toggleBtn}
              onClick={() => setModoPrueba(false)}
            >
              Modo live
            </button>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Claves estándar</h2>
          <span className={estilos.badgeAmbar}>
            {modoPrueba ? "Entorno de prueba" : "Entorno live"}
          </span>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <div className={estilos.grid4}>
            <div>
              <span className={estilos.etiqueta}>Clave publicable</span>
              <p className={estilos.subtituloTarjeta} style={{ marginTop: 0 }}>
                Uso en frontend / checkout embebido
              </p>
            </div>
            <div className={estilos.filaClave}>
              <div className={`${estilos.cajaClave} ${estilos.mono}`}>
                {modoPrueba
                  ? "pk_test_51Iq8S0LxVv9Xh6W8p..."
                  : "pk_live_51Iq8S0LxVv9Xh6W8p..."}
              </div>
              <button type="button" className={estilos.botonSecundario} onClick={copiarDemo}>
                Copiar
              </button>
            </div>
          </div>
          <div className={estilos.grid4} style={{ marginTop: 22 }}>
            <div>
              <span className={estilos.etiqueta}>Clave secreta</span>
              <p className={estilos.subtituloTarjeta} style={{ marginTop: 0 }}>
                Solo servidor; no la subas a repositorios
              </p>
            </div>
            <div className={estilos.filaClave}>
              <div className={`${estilos.cajaClave} ${estilos.mono}`}>
                {mostrarSecreta
                  ? modoPrueba
                    ? "sk_test_51Iq8S0LxVv9Xh6W8p9H2j..."
                    : "sk_live_51Iq8S0LxVv9Xh6W8p9H2j..."
                  : "••••••••••••••••••••••••••••••••"}
                <button
                  type="button"
                  className={estilos.enlace}
                  style={{ marginLeft: 12, border: 0, background: "none", cursor: "pointer" }}
                  onClick={() => setMostrarSecreta((v) => !v)}
                >
                  {mostrarSecreta ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <button type="button" className={estilos.botonSecundario} onClick={copiarDemo}>
                Copiar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <div>
            <h2 className={estilos.tituloTarjeta}>Secreto de webhooks</h2>
            <p className={estilos.subtituloTarjeta}>
              Firma HMAC para validar payloads entrantes en tu servidor.
            </p>
          </div>
          <Link href="/cliente/webhooks" className={estilos.botonSecundario} style={{ textDecoration: "none" }}>
            Gestionar endpoints
          </Link>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <div className={estilos.filaClave}>
            <div className={`${estilos.cajaClave} ${estilos.mono}`}>whsec_8uK7y6t5R4e3W2q1Z0...</div>
            <button type="button" className={estilos.botonSecundario} onClick={copiarDemo}>
              Copiar
            </button>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Permisos de la clave</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <div className={estilos.grid2}>
            {[
              ["Transacciones", "Acceso total"],
              ["Reembolsos", "Acceso total"],
              ["Clientes", "Acceso total"],
              ["Webhooks", "Solo lectura"],
            ].map(([nombre, nivel]) => (
              <div
                key={nombre}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f1f5f9",
                  paddingBottom: 10,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{nombre}</span>
                <span
                  className={
                    nivel.includes("lectura")
                      ? estilos.etiquetaPermisoLectura
                      : estilos.etiquetaPermisoOk
                  }
                >
                  {nivel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={estilos.zonaPeligro}>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: "0.75rem", color: "#991b1b" }}>
            Zona de riesgo
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "0.88rem", color: "#b91c1c" }}>
            Regenerar la clave secreta invalida la anterior de inmediato.
          </p>
        </div>
        <button type="button" className={estilos.botonPeligro} onClick={regenerarDemo}>
          Regenerar clave secreta
        </button>
      </section>
    </div>
  );
}
