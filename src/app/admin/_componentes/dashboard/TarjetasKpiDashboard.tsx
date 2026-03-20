import { estiloMascaraIcono } from "../../_utilidades/estiloMascaraIcono";
import estilosMascara from "../iconos-mascara.module.css";
import estilos from "./tarjetas-kpi-dashboard.module.css";

// Cuatro tarjetas de metricas clave (datos demo).
export default function TarjetasKpiDashboard() {
  return (
    <section className={estilos.gridTarjetas} data-purpose="admin-dashboard-kpis">
      <article className={estilos.tarjeta} data-tarjeta="ingresos">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoIndigo}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-money.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeExito}`}>+14,2%</span>
        </div>
        <p className={estilos.nombreTarjeta}>Ingresos del mes</p>
        <h3 className={estilos.valorTarjeta}>412.850 SOL</h3>
      </article>

      <article className={estilos.tarjeta} data-tarjeta="transacciones">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoAzul}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-transacciones.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeExito}`}>+8,1%</span>
        </div>
        <p className={estilos.nombreTarjeta}>Transacciones del mes</p>
        <h3 className={estilos.valorTarjeta}>1.245</h3>
      </article>

      <article className={estilos.tarjeta} data-tarjeta="socios">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoVioleta}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-persona-unidas.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeInfo}`}>Estable</span>
        </div>
        <p className={estilos.nombreTarjeta}>Socios activos</p>
        <h3 className={estilos.valorTarjeta}>48</h3>
      </article>

      <article className={estilos.tarjeta} data-tarjeta="disputas">
        <div className={estilos.cabeceraTarjeta}>
          <div className={`${estilos.iconoTarjeta} ${estilos.iconoFondoRojo}`}>
            <span
              className={estilosMascara.mascaraIcono}
              style={estiloMascaraIcono("/iconos/icon-exclamation.svg")}
              aria-hidden
            />
          </div>
          <span className={`${estilos.badge} ${estilos.badgeError}`}>-2 resueltas</span>
        </div>
        <p className={estilos.nombreTarjeta}>Disputas del mes</p>
        <h3 className={estilos.valorTarjeta}>2</h3>
      </article>
    </section>
  );
}
