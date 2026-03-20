import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProveedorTemaPorRuta from "./tema/ProveedorTemaPorRuta";

const fuenteSans = Geist({
  variable: "--fuente-geist-sans",
  subsets: ["latin"],
});

const fuenteMono = Geist_Mono({
  variable: "--fuente-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aplicación Hackathon Solana",
  description: "Panel por rol: admin y cliente",
};

export default function LayoutRaiz({
  children: contenido,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fuenteSans.variable} ${fuenteMono.variable}`}>
      <body>
        <ProveedorTemaPorRuta>{contenido}</ProveedorTemaPorRuta>
      </body>
    </html>
  );
}
