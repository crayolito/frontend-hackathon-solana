"use client";

import type { WalletName } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo } from "react";
import { flushSync } from "react-dom";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import estilosHome from "../home.module.css";
import { registrarErrorWalletDetallado } from "./registroWalletConsola";

const NOMBRE_PHANTOM = "Phantom" as WalletName;

function acortarDireccion(base58: string) {
  if (base58.length <= 12) return base58;
  return `${base58.slice(0, 4)}…${base58.slice(-4)}`;
}

/**
 * Phantom con logo del proyecto, texto claro y logs en consola (solo desarrollo).
 * `className` opcional para adaptar el botón al layout (p. ej. barra lateral ancho completo).
 */
export default function BotonConexionWallet({
  className: claseExtra,
}: Readonly<{ className?: string }> = {}) {
  const { connection } = useConnection();
  const { select, disconnect, connecting, connected, publicKey, wallet, wallets } = useWallet();

  const entradaPhantom = useMemo(
    () =>
      wallets.find((w) => w.adapter.name === NOMBRE_PHANTOM) ??
      wallets.find((w) => /phantom/i.test(String(w.adapter.name))),
    [wallets],
  );

  useEffect(() => {
    if (!connected || !publicKey) return;
    if (process.env.NODE_ENV !== "development") return;

    const direccion = publicKey.toBase58();

    void (async () => {
      let balanceLamports: number | null = null;
      try {
        balanceLamports = await connection.getBalance(publicKey);
      } catch {
        balanceLamports = null;
      }

      const datos = {
        cartera: wallet?.adapter.name ?? "Phantom",
        direccionPublica: direccion,
        publicKeyBase58: direccion,
        publicKeyUint8: publicKey.toBytes(),
        conectado: true,
        rpc: connection.rpcEndpoint,
        balanceLamports,
        balanceSol:
          balanceLamports !== null ? Math.round((balanceLamports / LAMPORTS_PER_SOL) * 1e6) / 1e6 : null,
      };

      console.log("[Solana · Phantom] Datos de tu billetera:", datos);
      console.info(
        "[Solana · Phantom] En código: useWallet() → publicKey, signTransaction, sendTransaction, disconnect | useConnection() → getBalance, getAccountInfo, getLatestBlockhash, etc.",
      );
    })();
  }, [connected, connection, publicKey, wallet?.adapter.name]);

  const alternar = useCallback(async () => {
    if (connected) {
      await disconnect();
      return;
    }
    if (!entradaPhantom) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[Wallet] Phantom no está en la lista aún. ¿Extensión instalada? Carteras detectadas:",
          wallets.map((w) => w.adapter.name),
        );
      }
      return;
    }
    try {
      flushSync(() => {
        select(entradaPhantom.adapter.name as WalletName);
      });
      await entradaPhantom.adapter.connect();
    } catch (error) {
      registrarErrorWalletDetallado(
        "BotonConexionWallet.alternar (connect)",
        error,
        entradaPhantom.adapter,
      );
    }
  }, [connected, disconnect, entradaPhantom, select, wallets]);

  const tituloPrincipal = connecting
    ? "Conectando…"
    : connected
      ? "Cartera conectada · clic para desconectar"
      : "Conectar mi billetera";

  const subtitulo =
    connected && publicKey
      ? acortarDireccion(publicKey.toBase58())
      : "Phantom · red devnet";

  return (
    <button
      type="button"
      className={`${estilosHome.phantomCarteraBtn} ${connected ? estilosHome.phantomCarteraBtnConectado : ""} ${claseExtra ?? ""}`}
      onClick={() => void alternar()}
      disabled={connecting}
      aria-label={connected ? "Desconectar Phantom" : "Conectar mi billetera con Phantom"}
      title={connected && publicKey ? publicKey.toBase58() : "Usa Phantom en devnet"}
    >
      <img
        className={estilosHome.phantomCarteraImg}
        src="/imagenes/logo-phantom.svg"
        alt=""
        width={42}
        height={42}
        decoding="async"
      />
      <span className={estilosHome.phantomCarteraTextos}>
        <span className={estilosHome.phantomCarteraTitulo}>{tituloPrincipal}</span>
        <span className={estilosHome.phantomCarteraSub}>{subtitulo}</span>
      </span>
    </button>
  );
}
