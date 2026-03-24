"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  ErrorApiTrustpay,
  crearApiKeyCuentaMercado,
  listarApiKeysCuentaMercado,
  revocarApiKeyCuentaMercado,
  type ApiKeyNegocioCreada,
  type ApiKeyNegocioItem,
} from "../../_lib/apiTrustpay";
import { obtenerTokenSesion } from "../../demoAuth";
import estilosDev from "../../cliente/_componentes/desarrollador.module.css";
import estilos from "./credenciales-api.module.css";

function formatearFecha(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function SeccionCredencialesApiPublica() {
  const [claves, setClaves] = useState<ApiKeyNegocioItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoClaves, setCargandoClaves] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);
  const [nuevaClave, setNuevaClave] = useState<ApiKeyNegocioCreada | null>(null);
  const [nombreNueva, setNombreNueva] = useState("");

  const cargarClaves = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) {
      setClaves([]);
      setCargando(false);
      return;
    }
    setCargandoClaves(true);
    setError(null);
    try {
      const r = await listarApiKeysCuentaMercado(token, 1, 50);
      setClaves(r.data);
    } catch (e) {
      setError(e instanceof ErrorApiTrustpay ? e.message : "No se pudieron cargar las API keys.");
      setClaves([]);
    } finally {
      setCargandoClaves(false);
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarClaves();
  }, [cargarClaves]);

  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      /* ignore */
    }
  };

  const crearClave = async () => {
    const token = obtenerTokenSesion();
    if (!token) return;
    setCreando(true);
    setError(null);
    try {
      const creada = await crearApiKeyCuentaMercado(token, {
        name: nombreNueva.trim() || null,
      });
      setNuevaClave(creada);
      setNombreNueva("");
      await cargarClaves();
    } catch (e) {
      setError(e instanceof ErrorApiTrustpay ? e.message : "No se pudo crear la clave.");
    } finally {
      setCreando(false);
    }
  };

  const revocar = async (keyId: string) => {
    const token = obtenerTokenSesion();
    if (!token) return;
    if (!window.confirm("¿Revocar esta clave? Dejará de funcionar para la API pública.")) return;
    setError(null);
    try {
      await revocarApiKeyCuentaMercado(token, keyId);
      await cargarClaves();
    } catch (e) {
      setError(e instanceof ErrorApiTrustpay ? e.message : "No se pudo revocar.");
    }
  };

  if (cargando) {
    return (
      <section className={estilosDev.tarjeta}>
        <p className={estilosDev.subtituloTarjeta} style={{ padding: "16px 22px", margin: 0 }}>
          Cargando credenciales…
        </p>
      </section>
    );
  }

  return (
    <>
      <section className={estilosDev.tarjeta}>
        <div className={estilosDev.cabeceraTarjeta}>
          <div>
            <h2 className={estilosDev.tituloTarjeta}>Credenciales API (pagos)</h2>
            <p className={estilosDev.subtituloTarjeta} style={{ marginTop: 6 }}>
              Mismas claves para <strong>todos tus negocios</strong>. La API pública{" "}
              <code>/api/payments</code> usa solo <strong>x-api-key</strong> y <strong>x-secret-key</strong>{" "}
              (sin JWT). Red: <strong>devnet</strong>.
            </p>
          </div>
          <Link href="/api-docs" className={estilosDev.botonSecundario} style={{ textDecoration: "none" }}>
            Ver documentación
          </Link>
        </div>
        <div className={estilosDev.cuerpoTarjeta}>
          {error ? (
            <p style={{ color: "#b91c1c", fontSize: "0.9rem", marginBottom: 12 }}>{error}</p>
          ) : null}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end", marginBottom: 16 }}>
            <div style={{ flex: "1 1 220px" }}>
              <label className={estilosDev.etiqueta} htmlFor="cred-nombre">
                Nombre opcional (nueva clave)
              </label>
              <input
                id="cred-nombre"
                className={estilosDev.input}
                placeholder="Ej. Integración tienda"
                value={nombreNueva}
                onChange={(e) => setNombreNueva(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={estilosDev.botonPrimario}
              disabled={creando}
              onClick={() => void crearClave()}
            >
              {creando ? "Creando…" : "Generar nueva clave"}
            </button>
          </div>

          {cargandoClaves ? (
            <p className={estilosDev.subtituloTarjeta}>Cargando claves…</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className={estilos.tabla}>
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Publishable (x-api-key)</th>
                    <th>Secret (vista)</th>
                    <th>Red</th>
                    <th>Último uso</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {claves.map((k) => {
                    const activa = !k.revokedAt && !k.disabledAt;
                    return (
                      <tr key={k.id} className={activa ? undefined : estilos.filaInactiva}>
                        <td>
                          {k.revokedAt ? (
                            <span className={`${estilos.badge} ${estilos.badgeOff}`}>Revocada</span>
                          ) : k.disabledAt ? (
                            <span className={`${estilos.badge} ${estilos.badgeOff}`}>Deshabilitada</span>
                          ) : (
                            <span className={`${estilos.badge} ${estilos.badgeOk}`}>Activa</span>
                          )}
                        </td>
                        <td className={estilos.mono}>
                          {k.publishableKey}
                          <div className={estilos.acciones} style={{ marginTop: 6 }}>
                            <button
                              type="button"
                              className={estilos.botonMini}
                              onClick={() => void copiar(k.publishableKey)}
                            >
                              Copiar
                            </button>
                          </div>
                        </td>
                        <td className={estilos.mono}>
                          {k.secretKeyPreview ?? "—"}
                          <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 4 }}>
                            El secreto completo solo se muestra al crear la clave.
                          </div>
                        </td>
                        <td>{k.network}</td>
                        <td>{formatearFecha(k.lastUsedAt)}</td>
                        <td>
                          {activa ? (
                            <button
                              type="button"
                              className={`${estilos.botonMini} ${estilos.botonPeligro}`}
                              onClick={() => void revocar(k.id)}
                            >
                              Revocar
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {claves.length === 0 ? (
                <p className={estilosDev.subtituloTarjeta}>Todavía no hay claves. Generá una para integrar.</p>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {nuevaClave ? (
        <div
          className={estilos.modalFondo}
          role="dialog"
          aria-modal
          aria-labelledby="modal-secreto-titulo"
        >
          <div className={estilos.modalCaja}>
            <h3 id="modal-secreto-titulo" className={estilos.modalTitulo}>
              Guardá tu secret key
            </h3>
            <p className={estilos.alertaSecreto}>
              {nuevaClave.message} No podrás volver a ver el <strong>secret</strong> completo; solo quedará el
              preview en la tabla.
            </p>
            <div>
              <span className={estilosDev.etiqueta}>x-api-key (publishable)</span>
              <div className={estilos.cajaClave}>{nuevaClave.publishableKey}</div>
              <button
                type="button"
                className={estilosDev.botonSecundario}
                style={{ marginTop: 8 }}
                onClick={() => void copiar(nuevaClave.publishableKey)}
              >
                Copiar publishable
              </button>
            </div>
            <div style={{ marginTop: 16 }}>
              <span className={estilosDev.etiqueta}>x-secret-key</span>
              <div className={estilos.cajaClave}>{nuevaClave.secretKey}</div>
              <button
                type="button"
                className={estilosDev.botonPrimario}
                style={{ marginTop: 8 }}
                onClick={() => void copiar(nuevaClave.secretKey)}
              >
                Copiar secret
              </button>
            </div>
            <div className={estilosDev.pieTarjeta} style={{ marginTop: 20, justifyContent: "flex-end" }}>
              <button
                type="button"
                className={estilosDev.botonPrimario}
                onClick={() => setNuevaClave(null)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
