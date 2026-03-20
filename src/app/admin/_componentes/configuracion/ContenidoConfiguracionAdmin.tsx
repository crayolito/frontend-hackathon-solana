"use client";

import { useCallback, useState } from "react";

import estilos from "./configuracion-admin.module.css";

// Formulario de ajustes del comercio: sin backend; guardado simulado (demo).
export default function ContenidoConfiguracionAdmin() {
  const [comision, setComision] = useState("0,8");
  const [diasEscrow, setDiasEscrow] = useState("7");
  const [alertaDisputa, setAlertaDisputa] = useState(true);
  const [webhook, setWebhook] = useState(false);
  const [idioma, setIdioma] = useState("es");
  const [zona, setZona] = useState("America/La_Paz");

  const guardar = useCallback(() => {
    window.alert(
      "Cambios guardados en modo demo. Más adelante esto persistirá en backend o on-chain según diseño.",
    );
  }, []);

  const simularRegenerarClave = useCallback(() => {
    window.alert("En produccion se generaria una nueva clave de API y se invalidaria la anterior.");
  }, []);

  return (
    <div className={estilos.contenedor}>
      <section className={estilos.tarjeta} aria-labelledby="config-red">
        <h2 id="config-red" className={estilos.tituloTarjeta}>
          Red Solana
        </h2>
        <p className={estilos.descripcionTarjeta}>
          Misma idea que elegir ambiente en una pasarela: aqui fijamos la red y el endpoint RPC que usa el
          panel para leer saldos y transacciones.
        </p>
        <div className={estilos.gridCampos}>
          <div>
            <label className={estilos.etiqueta} htmlFor="rpc-url">
              URL del RPC (solo lectura en demo)
            </label>
            <input
              id="rpc-url"
              className={estilos.inputTexto}
              readOnly
              value="https://api.mainnet-beta.solana.com"
            />
          </div>
          <div>
            <label className={estilos.etiqueta} htmlFor="red-nombre">
              Red activa
            </label>
            <input id="red-nombre" className={estilos.inputTexto} readOnly value="Mainnet-beta" />
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta} aria-labelledby="config-escrow">
        <h2 id="config-escrow" className={estilos.tituloTarjeta}>
          Escrow y comisiones
        </h2>
        <p className={estilos.descripcionTarjeta}>
          Parametros tipo Stripe Billing: comision de la plataforma y tiempo minimo de custodia antes de
          liberar o disputar.
        </p>
        <div className={estilos.gridCampos}>
          <div>
            <label className={estilos.etiqueta} htmlFor="comision">
              Comision plataforma (%)
            </label>
            <input
              id="comision"
              className={estilos.inputTexto}
              value={comision}
              onChange={(e) => setComision(e.target.value)}
              inputMode="decimal"
            />
            <p className={estilos.ayuda}>Se aplicara sobre el monto neto en SOL o USDC segun el flujo.</p>
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
          Claves para integrar tu checkout o ERP, similar a las claves secretas de Stripe.
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
        <button type="button" className={estilos.botonPrimario} onClick={guardar}>
          Guardar cambios
        </button>
        <p className={estilos.notaPie}>Los valores se mantienen solo en esta sesión hasta que conectemos persistencia.</p>
      </div>
    </div>
  );
}
