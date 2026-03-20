import { resumenClientesDemo } from "../../_datos/datosCuentasAdminDemo";
import estilos from "./tarjetas-kpi-clientes.module.css";

// Resumen rapido de cartera de clientes (conteos demo alineados a datosCuentasAdminDemo).
export default function TarjetasKpiClientes() {
  const { total, activos, escrowAbiertos, disputasAbiertas } = resumenClientesDemo;

  return (
    <section className={estilos.gridTarjetas} data-purpose="admin-clientes-kpis">
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Clientes registrados</p>
        <h3 className={estilos.valorTarjeta}>{total}</h3>
        <p className={estilos.pieTarjeta}>Cuentas con cartera Solana vinculada</p>
      </article>
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Activos</p>
        <h3 className={estilos.valorTarjeta}>{activos}</h3>
        <p className={estilos.pieTarjeta}>Pueden iniciar pagos y escrow</p>
      </article>
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Escrow abiertos</p>
        <h3 className={estilos.valorTarjeta}>{escrowAbiertos}</h3>
        <p className={estilos.pieTarjeta}>Fondos bloqueados o pendientes de firma</p>
      </article>
      <article className={estilos.tarjeta}>
        <p className={estilos.nombreTarjeta}>Disputas</p>
        <h3 className={estilos.valorTarjeta}>{disputasAbiertas}</h3>
        <p className={estilos.pieTarjeta}>Requieren revision del equipo</p>
      </article>
    </section>
  );
}
