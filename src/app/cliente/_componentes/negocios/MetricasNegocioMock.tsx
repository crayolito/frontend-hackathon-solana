"use client";

import {
  formatearLamportsComoSol,
  obtenerMetricasMockNegocio,
} from "../../../_lib/metricasNegocioMock";
import estilosDev from "../desarrollador.module.css";
import estilos from "./negocios.module.css";

type Props = {
  idNegocio: string;
};

// Cifras de demostración estables por negocio hasta exista endpoint de métricas.
export default function MetricasNegocioMock({ idNegocio }: Props) {
  const m = obtenerMetricasMockNegocio(idNegocio);

  return (
    <section className={estilosDev.tarjeta}>
      <div className={estilosDev.cabeceraTarjeta}>
        <div>
          <h2 className={estilosDev.tituloTarjeta}>Rendimiento (demostración)</h2>
          <p className={estilosDev.subtituloTarjeta}>
            Datos de demostración hasta conectar métricas reales con el backend.
          </p>
        </div>
      </div>
      <div className={estilosDev.cuerpoTarjeta}>
        <div className={estilos.gridMetricas}>
          <div className={estilos.celdaMetrica}>
            <p className={estilos.valorMetrica}>{m.ventasUltimos7Dias}</p>
            <p className={estilos.etiquetaMetrica}>Ventas 7 días</p>
          </div>
          <div className={estilos.celdaMetrica}>
            <p className={estilos.valorMetrica}>{m.ventasUltimos30Dias}</p>
            <p className={estilos.etiquetaMetrica}>Ventas 30 días</p>
          </div>
          <div className={estilos.celdaMetrica}>
            <p className={estilos.valorMetrica}>{formatearLamportsComoSol(m.ticketPromedioLamports)}</p>
            <p className={estilos.etiquetaMetrica}>Ticket promedio</p>
          </div>
          <div className={estilos.celdaMetrica}>
            <p className={estilos.valorMetrica}>{formatearLamportsComoSol(m.ingresosUltimos30DiasLamports)}</p>
            <p className={estilos.etiquetaMetrica}>Ingresos 30 días</p>
          </div>
        </div>
      </div>
    </section>
  );
}
