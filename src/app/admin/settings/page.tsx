"use client";

import CabeceraDashboard from "../_componentes/dashboard/CabeceraDashboard";
import ContenidoConfiguracionAdmin from "../_componentes/configuracion/ContenidoConfiguracionAdmin";

// Ajustes del comercio en admin: red, escrow, notificaciones y API (demo).
export default function PaginaSettings() {
  return (
    <>
      <CabeceraDashboard
        titulo="Configuración"
        subtitulo="Parámetros del comercio: red, escrow, avisos e integraciones (vista tipo pasarela)."
        mostrarSelectorMes={false}
      />
      <ContenidoConfiguracionAdmin />
    </>
  );
}
