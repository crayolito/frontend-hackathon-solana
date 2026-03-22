import ContenidoCuentaApiTrustpay from "../../_componentes/cuenta/ContenidoCuentaApiTrustpay";
import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";

export default function PaginaSettingsCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Ajustes de cuenta"
        subtitulo="Perfil, contraseña y baja de cuenta vinculados al API TrustPay. Conectá Phantom arriba para operar on-chain."
      />
      <ContenidoCuentaApiTrustpay />
    </>
  );
}
