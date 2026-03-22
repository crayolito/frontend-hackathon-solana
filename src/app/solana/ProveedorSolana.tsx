"use client";

import { WalletAdapterNetwork, type Adapter, type WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { registrarErrorWalletDetallado } from "./registroWalletConsola";

const carterasWalletStandard: Adapter[] = [];

export default function ProveedorSolana({
  children: hijos,
}: Readonly<{ children: ReactNode }>) {
  const red = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(red), [red]);

  const alErrorWallet = useCallback((error: WalletError, adapter?: Adapter) => {
    registrarErrorWalletDetallado("WalletProvider.onError", error, adapter ?? null);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={carterasWalletStandard}
        autoConnect={false}
        onError={alErrorWallet}
      >
        {hijos}
      </WalletProvider>
    </ConnectionProvider>
  );
}
