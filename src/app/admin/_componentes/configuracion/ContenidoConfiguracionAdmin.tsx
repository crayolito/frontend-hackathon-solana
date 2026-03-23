"use client";

import { useCallback, useEffect, useState } from "react";

import estilos from "./configuracion-admin.module.css";
import { obtenerTokenSesion } from "../../../demoAuth";
import {
  ErrorApiTrustpay,
  obtenerComisionAdmin,
  actualizarComisionAdmin,
} from "../../../_lib/apiTrustpay";

// Ajustes de plataforma: comisión real (GET/PATCH /admin/settings/commission); resto demo.
export default function ContenidoConfiguracionAdmin() {
  const [comisionPct, setComisionPct] = useState("");
  const [comisionCargando, setComisionCargando] = useState(true);
  const [comisionError, setComisionError] = useState<string | null>(null);
  const [comisionGuardando, setComisionGuardando] = useState(false);

  const [diasEscrow, setDiasEscrow] = useState("7");
  const [alertaDisputa, setAlertaDisputa] = useState(true);
  const [webhook, setWebhook] = useState(false);
  const [idioma, setIdioma] = useState("es");
  const [zona, setZona] = useState("America/La_Paz");

  useEffect(() => {
    const token = obtenerTokenSesion();
    if (!token) {
      setComisionCargando(false);
      setComisionError("Inicia sesión como admin para cargar la comisión.");
      return;
    }
    let cancelado = false;
    (async () => {
      try {
        const r = await obtenerComisionAdmin(token);
        if (cancelado) return;
        setComisionPct((r.commissionBps / 100).toFixed(2));
        setComisionError(null);
      } catch (e) {
        if (cancelado) return;
        if (e instanceof ErrorApiTrustpay) {
          setComisionError(e.message);
        } else {
          setComisionError("No se pudo cargar la comisión.");
        }
      } finally {
        if (!cancelado) setComisionCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  const guardarComision = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) {
      window.alert("Sin sesión.");
      return;
    }
    const raw = comisionPct.replace(",", ".").trim();
    const pct = Number.parseFloat(raw);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      window.alert("Indica un porcentaje entre 0 y 100.");
      return;
    }
    const bps = Math.round(pct * 100);
    setComisionGuardando(true);
    setComisionError(null);
    try {
      await actualizarComisionAdmin(token, bps);
      window.alert("Comisión de plataforma actualizada.");
    } catch (e) {
      if (e instanceof ErrorApiTrustpay) {
        setComisionError(e.message);
      } else {
        setComisionError("Error al guardar.");
      }
    } finally {
      setComisionGuardando(false);
    }
  }, [comisionPct]);

  const guardarDemo = useCallback(() => {
    window.alert(
      "El resto de opciones siguen en modo demo. La comisión usa el botón «Guardar comisión».",
    );
  }, []);

  const simularRegenerarClave = useCallback(() => {
    window.alert("En produccion se generaria una nueva clave de API y se invalidaria la anterior.");
  }, []);

  return (
    <div className={estilos.contenedor}>
      <section className={estilos.tarjeta} aria-labelledby="config-escrow">
        <h2 id="config-escrow" className={estilos.tituloTarjeta}>
          Escrow y comisiones
        </h2>
        <p className={estilos.descripcionTarjeta}>
          Comisión global de la plataforma (basis points en API). Se aplica en métricas de comisión
          estimada.
        </p>
        {comisionError ? (
          <p className={estilos.ayuda} style={{ color: "#b91c1c" }} role="alert">
            {comisionError}
          </p>
        ) : null}
        <div className={estilos.gridCampos}>
          <div>
            <label className={estilos.etiqueta} htmlFor="comision">
              Comisión plataforma (%)
            </label>
            <input
              id="comision"
              className={estilos.inputTexto}
              value={comisionCargando ? "…" : comisionPct}
              onChange={(e) => setComisionPct(e.target.value)}
              inputMode="decimal"
              disabled={comisionCargando || comisionGuardando}
            />
            <p className={estilos.ayuda}>
              Equivale a <code>commissionBps</code> en el backend (100 bps = 1%). Endpoint:{" "}
              <code>/admin/settings/commission</code>.
            </p>
            <div className={estilos.filaBotones} style={{ marginTop: 12 }}>
              <button
                type="button"
                className={estilos.botonPrimario}
                onClick={guardarComision}
                disabled={comisionCargando || comisionGuardando}
              >
                {comisionGuardando ? "Guardando…" : "Guardar comisión"}
              </button>
            </div>
          </div>
          <div>
            <label className={estilos.etiqueta} htmlFor="dias-escrow">
              Dias minimos en escrow
            </label>
            <input
              id="dias-escrow"
              className={estilos.inputTexto}
              value={diasEscrow}
              onChange={(e) => setDiasEscrow(e.target.value)}
              inputMode="numeric"
            />
            <p className={estilos.ayuda}>Demo local; lógica en backend si aplica.</p>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta} aria-labelledby="config-notif">
        <h2 id="config-notif" className={estilos.tituloTarjeta}>
          Notificaciones
        </h2>
        <p className={estilos.descripcionTarjeta}>
          Alertas al equipo cuando cambia el estado de un pago o se abre una disputa.
        </p>
        <div>
          <label className={estilos.filaCheck}>
            <input
              type="checkbox"
              className={estilos.checkbox}
              checked={alertaDisputa}
              onChange={(e) => setAlertaDisputa(e.target.checked)}
            />
            <span>
              <span className={estilos.textoCheck}>Enviar correo ante disputas y fondos bloqueados</span>
              <p className={estilos.ayuda}>Recomendado para el equipo de operaciones.</p>
            </span>
          </label>
          <label className={estilos.filaCheck}>
            <input
              type="checkbox"
              className={estilos.checkbox}
              checked={webhook}
              onChange={(e) => setWebhook(e.target.checked)}
            />
            <span>
              <span className={estilos.textoCheck}>Webhook HTTPS para eventos de transaccion</span>
              <p className={estilos.ayuda}>Definiras la URL cuando conectemos backend.</p>
            </span>
          </label>
        </div>
      </section>

      <section className={estilos.tarjeta} aria-labelledby="config-api">
        <h2 id="config-api" className={estilos.tituloTarjeta}>
          API del comercio
        </h2>
        <p className={estilos.descripcionTarjeta}>
          Claves para integrar tu checkout o ERP, al estilo de las claves secretas de un procesador de
          pagos.
        </p>
        <div className={estilos.gridCampos}>
          <div>
            <label className={estilos.etiqueta} htmlFor="api-publica">
              Clave publica (pk_demo)
            </label>
            <input
              id="api-publica"
              className={estilos.inputTexto}
              readOnly
              value="pk_live_••••••••••••8f2a"
            />
          </div>
          <div>
            <label className={estilos.etiqueta} htmlFor="api-secreta">
              Clave secreta
            </label>
            <input
              id="api-secreta"
              className={estilos.inputTexto}
              readOnly
              value="sk_live_•••••••••••••••••••••••••••••••••"
            />
          </div>
        </div>
        <div className={estilos.filaBotones} style={{ marginTop: 16 }}>
          <button type="button" className={estilos.botonSecundario} onClick={simularRegenerarClave}>
            Regenerar clave secreta
          </button>
          <p className={estilos.notaPie}>En demo no se guarda nada; en produccion rotar implica invalidar la clave anterior.</p>
        </div>
      </section>

      <section className={estilos.tarjeta} aria-labelledby="config-panel">
        <h2 id="config-panel" className={estilos.tituloTarjeta}>
          Panel de administracion
        </h2>
        <p className={estilos.descripcionTarjeta}>Preferencias de visualizacion para quien gestiona el comercio.</p>
        <div className={estilos.gridCampos}>
          <div>
            <label className={estilos.etiqueta} htmlFor="idioma">
              Idioma
            </label>
            <select
              id="idioma"
              className={estilos.inputTexto}
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className={estilos.etiqueta} htmlFor="zona">
              Zona horaria
            </label>
            <select
              id="zona"
              className={estilos.inputTexto}
              value={zona}
              onChange={(e) => setZona(e.target.value)}
            >
              <option value="America/La_Paz">America/La Paz</option>
              <option value="America/Sao_Paulo">America/Sao Paulo</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </section>

      <div className={estilos.filaBotones}>
        <button type="button" className={estilos.botonPrimario} onClick={guardarDemo}>
          Guardar resto (demo)
        </button>
        <p className={estilos.notaPie}>
          La comisión de plataforma se guarda con «Guardar comisión» arriba (API real).
        </p>
      </div>
    </div>
  );
}
