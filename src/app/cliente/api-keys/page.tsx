import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";
import ContenidoApiKeysCliente from "../_componentes/ContenidoApiKeysCliente";

export default function PaginaApiKeysCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Developers & API"
        subtitulo="Claves publishable/secret, secreto de webhooks y permisos (demo)."
      />
      <ContenidoApiKeysCliente />
    </>
  );
}
