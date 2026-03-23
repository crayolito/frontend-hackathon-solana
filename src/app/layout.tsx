import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import ProveedorNotificaciones from "./_componentes/ProveedorNotificaciones";
import "./globals.css";
import ProveedorTemaPorRuta from "./tema/ProveedorTemaPorRuta";

const fuenteSans = Space_Grotesk({
  variable: "--fuente-geist-sans",
  subsets: ["latin"],
});

const fuenteMono = JetBrains_Mono({
  variable: "--fuente-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustPay — Pasarela de pagos en Solana",
  description:
    "Cobra en cripto como una pasarela moderna: QR, enlaces y contratos para LATAM.",
};

export default function LayoutRaiz({
  children: contenido,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fuenteSans.variable} ${fuenteMono.variable}`}>
      <body suppressHydrationWarning>
        <ProveedorTemaPorRuta>
          <ProveedorNotificaciones>{contenido}</ProveedorNotificaciones>
        </ProveedorTemaPorRuta>
      </body>
    </html>
  );
}
