import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";
import ContenidoDocumentacionCliente from "./ContenidoDocumentacionCliente";

export default function PaginaDocumentacionCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Documentación"
        subtitulo="Cómo usar el panel del comercio: API, webhooks y cobros (guía funcional)."
      />
      <ContenidoDocumentacionCliente />
    </>
  );
}
