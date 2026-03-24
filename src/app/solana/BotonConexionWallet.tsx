"use client";

import { SolanaMobileWalletAdapterWalletName } from "@solana-mobile/wallet-adapter-mobile";
import type { WalletName } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNotificacion } from "../_componentes/ProveedorNotificaciones";
import estilosHome from "../home.module.css";
import {
  enlaceAbrirSitioEnNavegadorPhantom,
  enlaceTiendaPhantomSegunDispositivo,
  esClienteTelefonoOTablet,
} from "./entornoPhantomMovil";
import { registrarErrorWalletDetallado } from "./registroWalletConsola";

const NOMBRE_PHANTOM = "Phantom" as WalletName;

function acortarDireccion(base58: string) {
  if (base58.length <= 12) return base58;
  return `${base58.slice(0, 4)}…${base58.slice(-4)}`;
}

/**
 * Phantom con logo del proyecto, texto claro y logs en consola (solo desarrollo).
 * En escritorio prioriza la extensión; en móvil intenta Phantom inyectada, luego Mobile Wallet Adapter (Android),
 * y muestra enlaces para instalar la app o abrir la dApp dentro de Phantom.
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

  const enlacesMovil = useMemo(() => {
    if (!esMovil || typeof window === "undefined") {
      return { abrirEnPhantom: null as string | null, tienda: "" };
    }
    return {
      abrirEnPhantom: enlaceAbrirSitioEnNavegadorPhantom(),
      tienda: enlaceTiendaPhantomSegunDispositivo(),
    };
  }, [esMovil]);

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
      }
      return;
    }

    if (esMovil) {
      mostrarNotificacion(
        "En el celular no hay extensión de Phantom. Instalá la app Phantom o abrí esta página desde el Explorador dentro de Phantom (enlace abajo del botón). En Android con Chrome también podés conectar si ya tenés Phantom instalada.",
        14_000,
      );
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[Wallet] Móvil: sin Phantom inyectada ni adaptador móvil Solana. Carteras detectadas:",
          wallets.map((w) => w.adapter.name),
        );
      }
      return;
    }

    mostrarNotificacion(
      "No encontramos la extensión Phantom en el navegador. Instalá el complemento desde phantom.app, recargá la página y volvé a intentar.",
      10_000,
    );
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Wallet] Phantom no está en la lista. ¿Extensión instalada? Carteras detectadas:",
        wallets.map((w) => w.adapter.name),
      );
    }
  }, [adaptadorParaConectar, connected, disconnect, esMovil, mostrarNotificacion, select, wallets]);

  const tituloPrincipal = compacto
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
      : compacto
        ? esMovil
          ? "Phantom · devnet (móvil)"
          : "Phantom · devnet"
        : esMovil
          ? "Phantom · devnet · móvil o extensión"
          : "Phantom · red devnet";

  const mostrarBloqueAyudaMovil = esMovil && !connected && Boolean(enlacesMovil.abrirEnPhantom);

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
      {mostrarBloqueAyudaMovil ? (
        <div className={estilosHome.phantomAyudaMovil}>
          <p className={estilosHome.phantomAyudaMovilTitulo}>En el celular</p>
          <div className={estilosHome.phantomAyudaMovilEnlaces}>
            <a
              className={estilosHome.phantomAyudaMovilEnlace}
              href={enlacesMovil.abrirEnPhantom ?? "#"}
              rel="noopener noreferrer"
            >
              Abrir esta página en Phantom
            </a>
            <a
              className={estilosHome.phantomAyudaMovilEnlace}
              href={enlacesMovil.tienda}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instalar Phantom (App Store / Play Store)
            </a>
          </div>
          <p className={estilosHome.phantomAyudaMovilNota}>
            En Android con Chrome, el botón Conectar puede abrir Phantom si la app está instalada. En iPhone, lo más
            fiable suele ser abrir el primer enlace.
          </p>
        </div>
      ) : null}
    </div>
  );
}
