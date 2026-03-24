"use client";

import { useState } from "react";
import ContenidoAnaliticaCentral from "../../admin/_componentes/analytics/ContenidoAnaliticaCentral";
import CabeceraDashboard from "../../admin/_componentes/dashboard/CabeceraDashboard";
import TarjetasKpiComercio from "../_componentes/TarjetasKpiComercio";
import { obtenerTokenSesion } from "../../demoAuth";
import { generarCsvMetricasComercio } from "./exportarMetricasCsv";

// KPIs y series con GET /metrics/* (merchant), sin rutas /admin.
export default function PaginaAnaliticaCliente() {
  const [exportando, setExportando] = useState(false);

  const exportarDatos = () => {
    void (async () => {
      const token = obtenerTokenSesion();
      if (!token) {
        alert("Iniciá sesión para exportar.");
        return;
      }
      setExportando(true);
      try {
        const csv = await generarCsvMetricasComercio(token);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = `trustpay-analitica-${new Date().toISOString().slice(0, 10)}.csv`;
        enlace.click();
        URL.revokeObjectURL(url);
      } catch {
        alert("No se pudo generar el CSV. Revisá la conexión con el API.");
      } finally {
        setExportando(false);
      }
    })();
  };

  return (
    <>
      <CabeceraDashboard alExportar={exportarDatos} exportandoCsv={exportando} />
      <TarjetasKpiComercio />
      <ContenidoAnaliticaCentral variant="merchant" />
    </>
  );
}
