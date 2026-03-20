import estilos from "./estilos-cliente.module.css";

import CabeceraAreaCliente from "./_componentes/CabeceraAreaCliente";

// Resumen del panel del comercio (demo; sin exportar datos).
export default function PaginaCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Panel del comercio"
        subtitulo="Resumen de actividad; conecta backend cuando esté listo."
      />
      <section className={estilos.cabecera} style={{ marginTop: 8 }}>
        <h2 style={{ margin: 0, fontSize: "1.05rem", color: "var(--texto-primario)" }}>
          Estado
        </h2>
        <p style={{ marginTop: 10, color: "var(--texto-secundario)" }}>
          Datos de demostración: KPIs y gráficos se pueden enlazar aquí igual que en el admin.
        </p>
      </section>
    </>
  );
}
