import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";

// Pagos del comercio (placeholder; sin botón exportar).
export default function PaginaPagosCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Pagos"
        subtitulo="Listado de cobros y estados de escrow (contenido demo pendiente de enlazar)."
      />
      <p style={{ color: "var(--texto-secundario)", maxWidth: 560 }}>
        Aquí irá la tabla de pagos del comercio. No incluimos exportación CSV en esta cabecera por
        requisito de producto.
      </p>
    </>
  );
}
