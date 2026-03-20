import estilosEncabezados from "../encabezados-seccion-dashboard.module.css";
import estilos from "./grafico-volumen-transacciones.module.css";

// Grafico de area con curva demo (sin libreria externa).
export default function GraficoVolumenTransacciones() {
  return (
    <section className={estilos.tarjetaGrafico}>
      <div className={estilos.cabeceraGrafico}>
        <div>
          <h2 className={estilosEncabezados.tituloSeccion}>Volumen de transacciones</h2>
          <p className={estilosEncabezados.subtituloSeccion}>
            Cantidad de custodias por estado
          </p>
        </div>
        <select className={estilos.selectorCompacto} defaultValue="todos" aria-label="Tipo">
          <option value="todos">Todos los tipos</option>
          <option value="nft">Ventas NFT</option>
          <option value="servicio">Tarifas de servicio</option>
        </select>
      </div>
      <div className={estilos.contenedorArea}>
        <svg className={estilos.svgArea} viewBox="0 0 400 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rellenoAreaVolumen" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(108, 99, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(108, 99, 255, 0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,160 L0,120 C40,110 80,140 120,100 C160,60 200,80 240,40 C280,0 320,60 360,20 L400,30 L400,160 Z"
            fill="url(#rellenoAreaVolumen)"
          />
          <path
            d="M0,120 C40,110 80,140 120,100 C160,60 200,80 240,40 C280,0 320,60 360,20 L400,30"
            fill="none"
            stroke="#6c63ff"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <div className={estilos.ejeFechas}>
          <span>01 nov</span>
          <span>08 nov</span>
          <span>15 nov</span>
          <span>22 nov</span>
          <span>30 nov</span>
        </div>
      </div>
    </section>
  );
}
