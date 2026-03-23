"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState, type FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  crearQrNegocioTrustpay,
  ErrorApiTrustpay,
} from "../../../_lib/apiTrustpay";
import { obtenerTokenSesion } from "../../../demoAuth";
import BotonConexionWallet from "../../../solana/BotonConexionWallet";
import estilosDev from "../desarrollador.module.css";
import { useNotificacion } from "../../../_componentes/ProveedorNotificaciones";
import estilos from "./negocios.module.css";
import { guardarQrLocalNegocio } from "./almacenamientoQrLocal";
import type { EntradaQrLocal } from "./almacenamientoQrLocal";

type Props = {
  idNegocio: string;
  alCrear: () => void;
};

function solAStringLamports(texto: string): string | null {
  const n = Number(texto.replace(",", ".").trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  const lamports = Math.round(n * 1_000_000_000);
  if (lamports <= 0) return null;
  return String(lamports);
}

// Alta de QR de caja: monto fijo (lamports) o variable (null), requiere Bearer.
export default function FormularioCrearQr({ idNegocio, alCrear }: Props) {
  const { mostrarNotificacion } = useNotificacion();
  const { connected } = useWallet();
  const [etiqueta, setEtiqueta] = useState("");
  const [montoVariable, setMontoVariable] = useState(true);
  const [solFijo, setSolFijo] = useState("0.05");
  const [cargando, setCargando] = useState(false);

  const enviar = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const token = obtenerTokenSesion();
      if (!token) {
        mostrarNotificacion("No hay sesión.");
        return;
      }
      if (!etiqueta.trim()) {
        mostrarNotificacion("Indicá una etiqueta (ej. Caja principal).");
        return;
      }

      let amountLamports: string | null = null;
      if (!montoVariable) {
        const lamports = solAStringLamports(solFijo);
        if (!lamports) {
          mostrarNotificacion("Indicá un monto en SOL válido (mayor a 0).");
          return;
        }
        amountLamports = lamports;
      }

      setCargando(true);
      try {
        const respuesta = await crearQrNegocioTrustpay(token, idNegocio, {
          label: etiqueta.trim(),
          type: "branch",
          amountLamports,
          tokenMint: null,
        });
        const entrada: EntradaQrLocal = {
          id: uuidv4(),
          creadoEn: Date.now(),
          etiqueta: etiqueta.trim(),
          montoVariable,
          respuesta,
        };
        guardarQrLocalNegocio(idNegocio, entrada);
        setEtiqueta("");
        alCrear();
      } catch (err) {
        if (err instanceof ErrorApiTrustpay) {
          mostrarNotificacion(err.message, 16_000);
        } else {
          mostrarNotificacion("No se pudo crear el código QR.");
        }
      } finally {
        setCargando(false);
      }
    },
    [alCrear, etiqueta, idNegocio, montoVariable, mostrarNotificacion, solFijo]
  );

  return (
    <section className={estilosDev.tarjeta}>
      <div className={estilosDev.cabeceraTarjeta}>
        <div>
          <h2 className={estilosDev.tituloTarjeta}>Nuevo código QR</h2>
          <p className={estilosDev.subtituloTarjeta}>
            Monto variable (el cliente elige) o monto fijo en SOL para esta caja.
          </p>
        </div>
      </div>
      <div className={estilosDev.cuerpoTarjeta}>
        {!connected ? (
          <div style={{ marginBottom: 14 }}>
            <p className={estilosDev.subtituloTarjeta} style={{ marginBottom: 10 }}>
              Conectá Phantom si el backend lo requiere para firmar; el alta usa tu sesión API.
            </p>
            <BotonConexionWallet />
          </div>
        ) : null}

        <form onSubmit={enviar}>
          <label className={estilosDev.etiqueta} htmlFor="qr-etiqueta">
            Etiqueta
          </label>
          <input
            id="qr-etiqueta"
            className={estilosDev.input}
            value={etiqueta}
            onChange={(ev) => setEtiqueta(ev.target.value)}
            placeholder="Caja principal"
            autoComplete="off"
          />

          <div style={{ marginTop: 16 }}>
            <span className={estilosDev.etiqueta}>Tipo de monto</span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              <button
                type="button"
                className={montoVariable ? estilosDev.botonPrimario : estilosDev.botonSecundario}
                onClick={() => setMontoVariable(true)}
              >
                Variable
              </button>
              <button
                type="button"
                className={!montoVariable ? estilosDev.botonPrimario : estilosDev.botonSecundario}
                onClick={() => setMontoVariable(false)}
              >
                Fijo (SOL)
              </button>
            </div>
          </div>

          {!montoVariable ? (
            <div style={{ marginTop: 16 }}>
              <label className={estilosDev.etiqueta} htmlFor="qr-sol">
                Monto en SOL
              </label>
              <input
                id="qr-sol"
                className={estilosDev.input}
                value={solFijo}
                onChange={(ev) => setSolFijo(ev.target.value)}
                inputMode="decimal"
              />
            </div>
          ) : null}

          <div className={estilos.filaBotones}>
            <button type="submit" className={estilosDev.botonPrimario} disabled={cargando}>
              {cargando ? "Generando…" : "Generar QR"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
