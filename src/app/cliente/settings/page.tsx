import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";
import ContenidoCuentaSettingsCliente from "../_componentes/ContenidoCuentaSettingsCliente";

export default function PaginaSettingsCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Ajustes de cuenta"
        subtitulo="Perfil del negocio, wallet Solana, notificaciones y equipo."
      />
      <ContenidoCuentaSettingsCliente />
    </>
  );
}
