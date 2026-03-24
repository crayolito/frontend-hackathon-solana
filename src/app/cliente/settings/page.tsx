import ContenidoCuentaApiTrustpay from "../../_componentes/cuenta/ContenidoCuentaApiTrustpay";
import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";

export default function PaginaSettingsCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Cuenta"
        subtitulo="Perfil, credenciales de la API pública de pagos (API Key + Secret por negocio), wallet y más."
      />
      <ContenidoCuentaApiTrustpay />
    </>
  );
}
