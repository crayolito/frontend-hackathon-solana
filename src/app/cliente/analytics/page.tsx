"use client";

import ContenidoAnaliticaCentral from "../../admin/_componentes/analytics/ContenidoAnaliticaCentral";
import CabeceraDashboard from "../../admin/_componentes/dashboard/CabeceraDashboard";
import TarjetasKpiDashboard from "../../admin/_componentes/dashboard/TarjetasKpiDashboard";

// Misma experiencia que /admin/analytics: KPIs, exportación CSV y bloques de gráficos/tablas demo.
export default function PaginaAnaliticaCliente() {
  const exportarDatos = () => {
    const lineas = [
      "mes,ingresos_sol,transacciones,socios_activos,disputas",
      "Noviembre 2023,412850,1245,48,2",
    ];
    const blob = new Blob([lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "compra-segura-analitica.csv";
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CabeceraDashboard alExportar={exportarDatos} />
      <TarjetasKpiDashboard />
      <ContenidoAnaliticaCentral />
    </>
  );
}
