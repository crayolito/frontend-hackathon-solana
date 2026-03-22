import type { UsuarioTrustpayRespuesta } from "../../../_lib/apiTrustpay";
import estilos from "./tarjetas-kpi-clientes.module.css";

type Props = {
  totalRegistros: number;
  usuariosPagina: UsuarioTrustpayRespuesta[];
};

// Resumen del listado admin: totales desde la API y conteos sobre la página actual.
export default function TarjetasKpiClientes({ totalRegistros, usuariosPagina }: Props) {
  const activos = usuariosPagina.filter((u) => u.isActive !== false).length;
  const comercios = usuariosPagina.filter((u) => u.role === "merchant").length;
  const administradores = usuariosPagina.filter((u) => u.role === "admin").length;

  return (
    <section className={estilos.gridTarjetas} data-purpose="admin-clientes-kpis">
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Usuarios totales</p>
        <h3 className={estilos.valorTarjeta}>{totalRegistros}</h3>
        <p className={estilos.pieTarjeta}>Registros que devuelve el API (paginado)</p>
      </article>
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Activos en esta página</p>
        <h3 className={estilos.valorTarjeta}>{activos}</h3>
        <p className={estilos.pieTarjeta}>Cuentas con cuenta habilitada</p>
      </article>
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Comercios (página)</p>
        <h3 className={estilos.valorTarjeta}>{comercios}</h3>
        <p className={estilos.pieTarjeta}>Rol merchant en la página actual</p>
      </article>
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Admins (página)</p>
        <h3 className={estilos.valorTarjeta}>{administradores}</h3>
        <p className={estilos.pieTarjeta}>Rol admin en la página actual</p>
      </article>
    </section>
  );
}
