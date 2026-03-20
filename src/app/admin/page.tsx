"use client";

import {
  semanasIngresosDemo,
  sociosRentabilidadDemo,
} from "./_datos/datosDashboardDemo";
import CabeceraDashboard from "./_componentes/dashboard/CabeceraDashboard";
import GraficoBarrasIngresos from "./_componentes/dashboard/GraficoBarrasIngresos";
import GraficoVolumenTransacciones from "./_componentes/dashboard/GraficoVolumenTransacciones";
import SeccionRentabilidadDashboard from "./_componentes/dashboard/SeccionRentabilidadDashboard";
import TablaAccionesCriticas from "./_componentes/dashboard/TablaAccionesCriticas";
import TarjetasKpiDashboard from "./_componentes/dashboard/TarjetasKpiDashboard";
import estilosLayout from "./_componentes/layout-dashboard.module.css";

// Pagina principal del admin: ensambla bloques del dashboard (componentes + datos demo).
export default function PaginaAdmin() {
  const exportarDatos = () => {
    const lineas = [
      "mes,ingresos_sol,transacciones,socios_activos,disputas",
      "Noviembre 2023,412850,1245,48,2",
    ];
    const blob = new Blob([lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "compra-segura-dashboard.csv";
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CabeceraDashboard alExportar={exportarDatos} />
      <TarjetasKpiDashboard />
      <div className={estilosLayout.filaGraficos}>
        <GraficoBarrasIngresos semanas={semanasIngresosDemo} />
        <GraficoVolumenTransacciones />
      </div>
      <SeccionRentabilidadDashboard socios={sociosRentabilidadDemo} />
      <TablaAccionesCriticas />
    </>
  );
}
