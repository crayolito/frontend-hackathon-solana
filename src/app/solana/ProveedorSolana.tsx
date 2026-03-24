"use client";

import { WalletAdapterNetwork, type Adapter, type WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { registrarErrorWalletDetallado } from "./registroWalletConsola";

export default function ProveedorSolana({
  children: hijos,
}: Readonly<{ children: ReactNode }>) {
  const red = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(red), [red]);

  const alErrorWallet = useCallback((error: WalletError, adapter?: Adapter) => {
    registrarErrorWalletDetallado("WalletProvider.onError", error, adapter ?? null);
  }, []);

  const carteras = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={carteras}
        autoConnect={false}
        onError={alErrorWallet}
      >
        {hijos}
      </WalletProvider>
    </ConnectionProvider>
  );
}
