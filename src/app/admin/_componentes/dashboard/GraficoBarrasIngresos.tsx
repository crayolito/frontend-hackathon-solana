import type { SemanaIngresoDemo } from "../../_datos/datosDashboardDemo";
import estilosEncabezados from "../encabezados-seccion-dashboard.module.css";
import estilos from "./grafico-barras-ingresos.module.css";

type Props = {
  semanas: SemanaIngresoDemo[];
};

// Grafico de barras semanales (ingresos en SOL, datos demo).
export default function GraficoBarrasIngresos({ semanas }: Props) {
  return (
    <section className={estilos.tarjetaGrafico}>
      <div className={estilos.cabeceraGrafico}>
        <div>
          <h2 className={estilosEncabezados.tituloSeccion}>Detalle de ingresos del mes</h2>
          <p className={estilosEncabezados.subtituloSeccion}>
            Flujo de ingresos por semana (SOL)
          </p>
        </div>
        <div className={estilos.navegacionMes}>
          <button type="button" className={estilos.botonMini} aria-label="Mes anterior">
            ‹
          </button>
          <span className={estilos.etiquetaMes}>Noviembre 2023</span>
          <button type="button" className={estilos.botonMini} aria-label="Mes siguiente">
            ›
          </button>
        </div>
      </div>
      <div className={estilos.areaBarras}>
        {semanas.map((s) => (
          <div key={s.etiqueta} className={estilos.columnaBarra}>
            <div className={estilos.pistaBarra}>
              <div
                className={`${estilos.rellenoBarra} ${s.destacada ? estilos.rellenoBarraActiva : ""}`}
                style={{ height: `${s.porcentaje}%` }}
              />
              <div className={estilos.tooltipBarra}>{s.valor}</div>
            </div>
            <span
              className={`${estilos.etiquetaSemana} ${s.destacada ? estilos.etiquetaSemanaActiva : ""}`}
            >
              {s.etiqueta}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
