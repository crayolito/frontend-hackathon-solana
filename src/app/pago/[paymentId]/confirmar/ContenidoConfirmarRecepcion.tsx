"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  ErrorApiTrustpay,
  obtenerResumenPagoPublico,
  solicitarTransaccionConfirmarRecepcion,
  type ResumenPagoPublico,
} from "../../../_lib/apiTrustpay";
import BotonConexionWallet from "../../../solana/BotonConexionWallet";
import estilos from "./confirmar-recepcion.module.css";

function igualWallet(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export default function ContenidoConfirmarRecepcion({
  paymentId,
}: Readonly<{ paymentId: string }>) {
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();

  const [resumen, setResumen] = useState<ResumenPagoPublico | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [firmaTx, setFirmaTx] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const r = await obtenerResumenPagoPublico(paymentId);
      setResumen(r);
    } catch (e) {
      setError(
        e instanceof ErrorApiTrustpay ? e.message : "No se pudo cargar el pago."
      );
      setResumen(null);
    } finally {
      setCargando(false);
    }
  }, [paymentId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const puedeConfirmar =
    resumen &&
    (resumen.status === "escrow_locked" || resumen.status === "shipped");

  const walletCoincide =
    connected &&
    publicKey &&
    resumen?.buyerWallet &&
    igualWallet(publicKey.toBase58(), resumen.buyerWallet);

  const walletDistinta =
    connected &&
    publicKey &&
    resumen?.buyerWallet &&
    !igualWallet(publicKey.toBase58(), resumen.buyerWallet);

  const confirmar = async () => {
    if (!publicKey || !puedeConfirmar) return;
    setProcesando(true);
    setError(null);
    setFirmaTx(null);
    try {
      const { transaction: txB64 } = await solicitarTransaccionConfirmarRecepcion(
        paymentId,
        publicKey.toBase58()
      );
      const raw = Uint8Array.from(atob(txB64), (c) => c.charCodeAt(0));
      const tx = Transaction.from(raw);
      const sig = await sendTransaction(tx, connection, {
        skipPreflight: false,
        maxRetries: 5,
      });
      setFirmaTx(sig);
      await cargar();
    } catch (e) {
      setError(
        e instanceof ErrorApiTrustpay
          ? e.message
          : e instanceof Error
            ? e.message
            : "No se pudo enviar la transacción."
      );
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className={estilos.caja}>
        <p className={estilos.muted}>Cargando pago…</p>
      </div>
    );
  }

  if (error && !resumen) {
    return (
      <div className={estilos.caja}>
        <p className={estilos.error}>{error}</p>
        <Link href="/" className={estilos.enlace}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  const st = resumen?.status ?? "";

  return (
    <div className={estilos.ancho}>
      <header className={estilos.cabecera}>
        <span className={estilos.marca}>TrustPay</span>
        <h1 className={estilos.titulo}>Confirmar recepción</h1>
        <p className={estilos.subtitulo}>
          Si ya pagaste con Phantom, conectá la <strong>misma wallet</strong> y firmá para liberar el pago al
          vendedor (escrow).
        </p>
      </header>

      <div className={estilos.caja}>
        {resumen?.businessName ? (
          <p className={estilos.linea}>
            <span className={estilos.etiqueta}>Comercio</span> {resumen.businessName}
          </p>
        ) : null}
        {resumen?.orderId ? (
          <p className={estilos.linea}>
            <span className={estilos.etiqueta}>Pedido</span> {resumen.orderId}
          </p>
        ) : null}
        {resumen?.description ? (
          <p className={estilos.linea}>
            <span className={estilos.etiqueta}>Detalle</span> {resumen.description}
          </p>
        ) : null}
        <p className={estilos.linea}>
          <span className={estilos.etiqueta}>Estado</span>{" "}
          <code className={estilos.code}>{st}</code>
        </p>
        {resumen?.buyerWallet ? (
          <p className={estilos.linea}>
            <span className={estilos.etiqueta}>Wallet que pagó</span>{" "}
            <span className={estilos.mono}>{resumen.buyerWallet}</span>
          </p>
        ) : (
          <p className={estilos.aviso}>
            Todavía no hay pago registrado. Primero escaneá el QR y completá el pago en Phantom.
          </p>
        )}
      </div>

      {error ? <p className={estilos.errorBanner}>{error}</p> : null}

      {firmaTx ? (
        <p className={estilos.exito}>
          Transacción enviada. Firma: <code className={estilos.code}>{firmaTx}</code>
        </p>
      ) : null}

      {st === "released" || st === "auto_released" ? (
        <p className={estilos.exito}>Este pago ya fue liberado. No hace falta confirmar de nuevo.</p>
      ) : null}

      {st === "refunded" ? (
        <p className={estilos.aviso}>Este pago fue reembolsado.</p>
      ) : null}

      {st === "expired" || st === "pending" ? (
        <p className={estilos.aviso}>
          {st === "pending"
            ? "El pago sigue pendiente. Completá primero el pago con el QR de Solana Pay."
            : "Este pago expiró."}
        </p>
      ) : null}

      {puedeConfirmar ? (
        <>
          <div className={estilos.walletRow}>
            <BotonConexionWallet className={estilos.botonWallet} />
          </div>

          {walletDistinta ? (
            <p className={estilos.errorBanner}>
              Conectá la wallet que usaste para pagar (la que coincide con «Wallet que pagó» arriba).
            </p>
          ) : null}

          {connected && publicKey && !resumen?.buyerWallet ? (
            <p className={estilos.aviso}>
              Tu wallet está conectada, pero el sistema todavía no registró el pago. Esperá unos segundos y
              recargá, o pagá primero con el QR.
            </p>
          ) : null}

          <button
            type="button"
            className={estilos.botonPrimario}
            disabled={
              !connected ||
              !publicKey ||
              !walletCoincide ||
              procesando ||
              !resumen?.buyerWallet
            }
            onClick={() => void confirmar()}
          >
            {procesando ? "Firmando…" : "Confirmar recepción y liberar pago"}
          </button>
          <p className={estilos.ayuda}>
            Vas a firmar una transacción en Solana (devnet). No cobramos gas extra en esta acción más allá de la
            red.
          </p>
        </>
      ) : null}

      <p className={estilos.pie}>
        <button type="button" className={estilos.enlaceBoton} onClick={() => void cargar()}>
          Actualizar estado
        </button>
        {" · "}
        <Link href="/" className={estilos.enlace}>
          Inicio TrustPay
        </Link>
      </p>
    </div>
  );
}
