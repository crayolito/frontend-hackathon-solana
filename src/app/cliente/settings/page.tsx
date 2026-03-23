import ContenidoCuentaApiTrustpay from "../../_componentes/cuenta/ContenidoCuentaApiTrustpay";
import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";

export default function PaginaSettingsCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Cuenta"
        subtitulo="Perfil, marca, wallet, avisos de transacciones y seguridad. Los datos de perfil se sincronizan con el API TrustPay."
      />
      <ContenidoCuentaApiTrustpay />
    </>
  );
}
