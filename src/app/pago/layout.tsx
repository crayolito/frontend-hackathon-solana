"use client";

import type { ReactNode } from "react";
import ProveedorSolana from "../solana/ProveedorSolana";

/** Rutas públicas del comprador (p. ej. confirmar recepción del escrow). Incluye wallet Phantom en devnet. */
export default function LayoutPago({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ProveedorSolana>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(165deg, #0c0c12 0%, #151528 45%, #0a0a10 100%)",
          color: "#e8e8ed",
          padding: "24px 16px 48px",
        }}
      >
        {children}
      </div>
    </ProveedorSolana>
  );
}
