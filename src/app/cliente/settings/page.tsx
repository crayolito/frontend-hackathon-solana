import ContenidoCuentaApiTrustpay from "../../_componentes/cuenta/ContenidoCuentaApiTrustpay";
import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";

export default function PaginaSettingsCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Ajustes de cuenta"
        subtitulo="Perfil vinculado al API TrustPay (nombre completo)."
      />
      <ContenidoCuentaApiTrustpay />
    </>
  );
}
