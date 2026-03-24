"use client";

import { SolanaMobileWalletAdapterWalletName } from "@solana-mobile/wallet-adapter-mobile";
import type { WalletName } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNotificacion } from "../_componentes/ProveedorNotificaciones";
import estilosHome from "../home.module.css";
import { esClienteTelefonoOTablet } from "./entornoPhantomMovil";
import { registrarErrorWalletDetallado } from "./registroWalletConsola";

const NOMBRE_PHANTOM = "Phantom" as WalletName;

function acortarDireccion(base58: string) {
  if (base58.length <= 12) return base58;
  return `${base58.slice(0, 4)}…${base58.slice(-4)}`;
}

/**
 * Phantom con logo del proyecto. Escritorio: extensión; móvil: app inyectada o Mobile Wallet Adapter (Android).
 * Sin bloques extra bajo el botón: solo el mismo control, textos más cortos en pantallas chicas.
 */
export default function BotonConexionWallet({
  className: claseExtra,
  compacto = false,
}: Readonly<{ className?: string; compacto?: boolean }> = {}) {
  const { connection } = useConnection();
  const { select, disconnect, connecting, connected, publicKey, wallet, wallets } = useWallet();
  const { mostrarNotificacion } = useNotificacion();
  const [esMovil, setEsMovil] = useState(false);

  useEffect(() => {
    setEsMovil(esClienteTelefonoOTablet());
  }, []);

  const entradaPhantom = useMemo(
    () =>
      wallets.find((w) => w.adapter.name === NOMBRE_PHANTOM) ??
      wallets.find((w) => /phantom/i.test(String(w.adapter.name))),
    [wallets],
  );

  const entradaAdaptadorMovilSolana = useMemo(
    () => wallets.find((w) => w.adapter.name === SolanaMobileWalletAdapterWalletName) ?? null,
    [wallets],
  );

  const adaptadorParaConectar = entradaPhantom ?? entradaAdaptadorMovilSolana;

  const etiquetasCortas = compacto || esMovil;

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
    if (adaptadorParaConectar) {
      try {
        flushSync(() => {
          select(adaptadorParaConectar.adapter.name as WalletName);
        });
        await adaptadorParaConectar.adapter.connect();
      } catch (error) {
        registrarErrorWalletDetallado(
          "BotonConexionWallet.alternar (connect)",
          error,
          adaptadorParaConectar.adapter,
        );
        if (esClienteTelefonoOTablet()) {
          mostrarNotificacion("No se pudo abrir Phantom. ¿Tenés la app instalada?", 8000);
        }
      }
      return;
    }

    if (esClienteTelefonoOTablet()) {
      mostrarNotificacion("Instalá la app Phantom desde phantom.app.", 7000);
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[Wallet] Móvil: sin cartera disponible. Detectadas:",
          wallets.map((w) => w.adapter.name),
        );
      }
      return;
    }

    mostrarNotificacion(
      "Instalá la extensión Phantom desde phantom.app y recargá la página.",
      9000,
    );
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Wallet] Phantom no está en la lista. Carteras detectadas:",
        wallets.map((w) => w.adapter.name),
      );
    }
  }, [adaptadorParaConectar, connected, disconnect, mostrarNotificacion, select, wallets]);

  const tituloPrincipal = etiquetasCortas
    ? connecting
      ? "Conectando…"
      : connected
        ? "Conectado"
        : "Conectar"
    : connecting
      ? "Conectando…"
      : connected
        ? "Cartera conectada · clic para desconectar"
        : "Conectar mi billetera";

  const subtitulo =
    connected && publicKey
      ? acortarDireccion(publicKey.toBase58())
      : "Phantom · devnet";

  return (
    <div
      className={`${estilosHome.phantomCarteraEnvolver} ${compacto ? estilosHome.phantomCarteraEnvolverCompacto : ""}`}
    >
      <button
        type="button"
        className={`${estilosHome.phantomCarteraBtn} ${compacto ? estilosHome.phantomCarteraBtnCompacto : ""} ${connected ? estilosHome.phantomCarteraBtnConectado : ""} ${claseExtra ?? ""}`}
        onClick={() => void alternar()}
        disabled={connecting}
        aria-label={connected ? "Desconectar Phantom" : "Conectar mi billetera con Phantom"}
        title={connected && publicKey ? publicKey.toBase58() : "Usa Phantom en devnet"}
      >
        <img
          className={`${estilosHome.phantomCarteraImg} ${compacto ? estilosHome.phantomCarteraImgCompacto : ""}`}
          src="/imagenes/logo-phantom.svg"
          alt=""
          width={compacto ? 30 : 42}
          height={compacto ? 30 : 42}
          decoding="async"
        />
        <span className={estilosHome.phantomCarteraTextos}>
          <span
            className={`${estilosHome.phantomCarteraTitulo} ${compacto ? estilosHome.phantomCarteraTituloCompacto : ""}`}
          >
            {tituloPrincipal}
          </span>
          <span className={`${estilosHome.phantomCarteraSub} ${compacto ? estilosHome.phantomCarteraSubCompacto : ""}`}>
            {subtitulo}
          </span>
        </span>
      </button>
    </div>
  );
}
