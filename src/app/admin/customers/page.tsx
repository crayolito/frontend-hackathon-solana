"use client";

import { useMemo, useState } from "react";

import CabeceraDashboard from "../_componentes/dashboard/CabeceraDashboard";
import TablaListaClientes from "../_componentes/clientes/TablaListaClientes";
import TarjetasKpiClientes from "../_componentes/clientes/TarjetasKpiClientes";
import estilosLista from "../_componentes/clientes/lista-clientes.module.css";
import { clientesDemo } from "../_datos/datosCuentasAdminDemo";

// Listado de clientes con busqueda local y KPIs (demo tipo pasarela + cartera Solana).
export default function PaginaCustomers() {
  const [consulta, setConsulta] = useState("");

  const clientesFiltrados = useMemo(() => {
    const q = consulta.trim().toLowerCase();
    if (!q) return clientesDemo;
    return clientesDemo.filter(
      (c) =>
        c.alias.toLowerCase().includes(q) ||
        c.correo.toLowerCase().includes(q) ||
        c.cartera.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q),
    );
  }, [consulta]);

  const exportarCsv = () => {
    const lineas = [
      "id,alias,correo,cartera,estado,transacciones,volumen_sol,volumen_usdc,ultima_actividad",
      ...clientesFiltrados.map(
        (c) =>
          `${c.id},"${c.alias}",${c.correo},${c.cartera},${c.estado},${c.transaccionesTotal},${c.volumenSolEtiqueta},${c.volumenUsdcEtiqueta},${c.ultimaActividad}`,
      ),
    ];
    const blob = new Blob([lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "compra-segura-clientes.csv";
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CabeceraDashboard
        alExportar={exportarCsv}
        titulo="Clientes"
        subtitulo="Cuentas que operan con cartera Solana, escrow y pagos (vista tipo pasarela)."
      />
      <TarjetasKpiClientes />
      <div className={estilosLista.barraHerramientas}>
        <input
          type="search"
          className={estilosLista.campoBusqueda}
          placeholder="Buscar por nombre, correo, ID o cartera…"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          aria-label="Buscar clientes"
        />
      </div>
      <TablaListaClientes clientes={clientesFiltrados} />
    </>
  );
}
