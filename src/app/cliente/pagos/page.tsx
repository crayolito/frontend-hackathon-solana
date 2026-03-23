import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";
import ContenidoPagosCliente from "../_componentes/ContenidoPagosCliente";

// Pagos escrow del negocio (GET /businesses/:id/payments con JWT de merchant).
export default function PaginaPagosCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Pagos"
        subtitulo="Pagos escrow (Solana Pay / QR) de tus negocios, en tiempo real desde el backend."
      />
      <ContenidoPagosCliente />
    </>
  );
}
