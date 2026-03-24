import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";
import ContenidoTransaccionesCliente from "../_componentes/ContenidoTransaccionesCliente";

export default function PaginaTransaccionesCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Transacciones"
        subtitulo="Resumen y últimos pagos reales de tus negocios (API TrustPay)."
      />
      <ContenidoTransaccionesCliente />
    </>
  );
}
