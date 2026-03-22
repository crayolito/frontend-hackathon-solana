"use client";

import ContenidoCuentaApiTrustpay from "../../_componentes/cuenta/ContenidoCuentaApiTrustpay";
import CabeceraDashboard from "../_componentes/dashboard/CabeceraDashboard";
import ContenidoConfiguracionAdmin from "../_componentes/configuracion/ContenidoConfiguracionAdmin";

// Cuenta real (API) más ajustes de plataforma en modo demo.
export default function PaginaSettings() {
  return (
    <>
      <CabeceraDashboard
        titulo="Configuración"
        subtitulo="Tu cuenta TrustPay y parámetros del panel (parte demo hasta conectar todo al backend)."
        mostrarSelectorMes={false}
      />
      <ContenidoCuentaApiTrustpay />
      <ContenidoConfiguracionAdmin />
    </>
  );
}
