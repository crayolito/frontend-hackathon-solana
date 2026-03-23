import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";
import ContenidoTransaccionesCliente from "../_componentes/ContenidoTransaccionesCliente";

export default function PaginaTransaccionesCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Transacciones"
        subtitulo="Resumen y listado de cobros (demo con datos fijos)."
      />
      <ContenidoTransaccionesCliente />
    </>
  );
}
