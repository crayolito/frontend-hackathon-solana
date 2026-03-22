import type { Adapter } from "@solana/wallet-adapter-base";
import { WalletNotSelectedError } from "@solana/wallet-adapter-react";
import {
  WalletAccountError,
  WalletConfigError,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletDisconnectionError,
  WalletError,
  WalletKeypairError,
  WalletLoadError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletPublicKeyError,
  WalletSendTransactionError,
  WalletSignInError,
  WalletSignMessageError,
  WalletSignTransactionError,
  WalletTimeoutError,
  WalletWindowBlockedError,
  WalletWindowClosedError,
} from "@solana/wallet-adapter-base";

/**
 * En desarrollo, imprime en consola el máximo detalle útil sobre errores de wallet.
 */
export function registrarErrorWalletDetallado(
  contexto: string,
  err: unknown,
  adapter?: Adapter | null,
): void {
  if (process.env.NODE_ENV !== "development") return;

  const e = err as WalletError & { cause?: unknown };
  const tiposWallet = {
    WalletError: err instanceof WalletError,
    WalletNotReadyError: err instanceof WalletNotReadyError,
    WalletConnectionError: err instanceof WalletConnectionError,
    WalletDisconnectedError: err instanceof WalletDisconnectedError,
    WalletDisconnectionError: err instanceof WalletDisconnectionError,
    WalletAccountError: err instanceof WalletAccountError,
    WalletPublicKeyError: err instanceof WalletPublicKeyError,
    WalletNotConnectedError: err instanceof WalletNotConnectedError,
    WalletNotSelectedError: err instanceof WalletNotSelectedError,
    WalletSendTransactionError: err instanceof WalletSendTransactionError,
    WalletSignTransactionError: err instanceof WalletSignTransactionError,
    WalletSignMessageError: err instanceof WalletSignMessageError,
    WalletSignInError: err instanceof WalletSignInError,
    WalletTimeoutError: err instanceof WalletTimeoutError,
    WalletWindowBlockedError: err instanceof WalletWindowBlockedError,
    WalletWindowClosedError: err instanceof WalletWindowClosedError,
    WalletLoadError: err instanceof WalletLoadError,
    WalletConfigError: err instanceof WalletConfigError,
    WalletKeypairError: err instanceof WalletKeypairError,
  };

  const explicacionUsuarioRechazo =
    err instanceof WalletConnectionError &&
    typeof e?.message === "string" &&
    /reject|rechaz|denied|cancel/i.test(e.message)
      ? "Suele ser: cerraste el popup de Phantom o pulsaste Rechazar / Cancelar."
      : null;

  console.groupCollapsed(`%c[Solana Wallet · ${contexto}]`, "color:#AB9FF2;font-weight:bold");
  console.error("Objeto error:", err);
  if (err instanceof Error) {
    console.log("name:", err.name);
    console.log("message:", err.message);
    console.log("stack:\n", err.stack);
  }
  if (e?.cause !== undefined) console.log("cause (Error.cause):", e.cause);
  if (err instanceof WalletError && err.error !== undefined) {
    console.log("walletAdapter.error (causa interna del adapter):", err.error);
  }
  if (adapter) {
    console.log("— adapter —");
    console.log("name:", adapter.name);
    console.log("url:", adapter.url);
    console.log("readyState:", adapter.readyState);
    console.log("connected:", adapter.connected);
    console.log("publicKey:", adapter.publicKey?.toBase58() ?? null);
  }
  console.log("instanceof (tipos):", tiposWallet);
  if (explicacionUsuarioRechazo) console.warn("Interpretación:", explicacionUsuarioRechazo);
  try {
    const props = err && typeof err === "object" ? Object.getOwnPropertyNames(err) : [];
    const plano: Record<string, unknown> = {};
    for (const k of props) {
      try {
        plano[k] = (err as Record<string, unknown>)[k];
      } catch {
        plano[k] = "[no serializable]";
      }
    }
    console.log("propiedades propias:", plano);
  } catch {
    /* empty */
  }
  console.groupEnd();
}
