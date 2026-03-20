"use client";

// ProveedorTemaPorRuta: define `data-area` según la ruta para que `globals.css`
// cambie el tema (variables CSS) entre `/`, `/admin` y `/cliente`.
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Determina en qué sección estamos para aplicar el tema correcto.
export default function ProveedorTemaPorRuta({
  children: hijos,
}: Readonly<{
  children: ReactNode;
}>) {
  const rutaActual = usePathname();

  let area: "principal" | "admin" | "cliente" = "principal";
  if (rutaActual?.startsWith("/admin")) area = "admin";
  else if (rutaActual?.startsWith("/cliente")) area = "cliente";

  return <div data-area={area}>{hijos}</div>;
}

