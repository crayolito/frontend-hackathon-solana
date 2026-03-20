"use client";

// Contenido central de Analitica: tendencias de volumen, embudo escrow, Bolivia y tabla top.
import GraficoVolumenTendenciasAnalitica from "./GraficoVolumenTendenciasAnalitica";
import estilos from "./contenido-analitica-central.module.css";

const pasosEmbudo = [
  { etiqueta: "Iniciadas", porcentaje: 100, cantidad: "1.240", opacidadColor: 1 },
  { etiqueta: "Fondos bloqueados", porcentaje: 85, cantidad: "1.054", opacidadColor: 0.88 },
  { etiqueta: "Entrega confirmada", porcentaje: 72, cantidad: "892", opacidadColor: 0.72 },
  { etiqueta: "Fondos liberados", porcentaje: 68, cantidad: "843", opacidadColor: 0.58 },
] as const;

const regionesBolivia = [
  { nombre: "Santa Cruz", porcentaje: "42%" },
  { nombre: "La Paz", porcentaje: "31%" },
  { nombre: "Cochabamba", porcentaje: "18%" },
  { nombre: "Otros", porcentaje: "9%" },
] as const;

const filasTopTransacciones = [
  {
    id: "0x8a…4b2",
    monto: "$4.500,00",
    activo: "USDC",
    estado: "completado" as const,
  },
  {
    id: "0x2d…9f1",
    monto: "120,50",
    activo: "SOL",
    estado: "bloqueado" as const,
  },
  {
    id: "0x5c…1a3",
    monto: "$2.250,00",
    activo: "USDC",
    estado: "completado" as const,
  },
] as const;

export default function ContenidoAnaliticaCentral() {
  return (
    <>
      <div className={estilos.filaSuperior}>
        <section className={`${estilos.tarjeta} ${estilos.graficoAncho}`} aria-labelledby="titulo-tendencias-volumen">
          <div className={estilos.cabeceraGrafico}>
            <h2 id="titulo-tendencias-volumen" className={estilos.tituloBloque}>
              Tendencias de volumen de transacciones
            </h2>
            <div className={estilos.leyendaGrafico}>
              <span className={estilos.leyendaPunto}>
                <span className={estilos.puntoSolana} aria-hidden />
                SOL
              </span>
              <span className={estilos.leyendaPunto}>
                <span className={estilos.puntoUsdc} aria-hidden />
                USDC
              </span>
            </div>
          </div>
          <GraficoVolumenTendenciasAnalitica />
        </section>

        <section className={estilos.tarjeta} aria-labelledby="titulo-embudo">
          <h2 id="titulo-embudo" className={estilos.tituloEmbudo}>
            Embudo de conversión (escrow)
          </h2>
          <div className={estilos.listaEmbudo}>
            {pasosEmbudo.map((paso) => (
              <div key={paso.etiqueta} className={estilos.filaEmbudo}>
                <div className={estilos.etiquetasEmbudo}>
                  <span>{paso.etiqueta}</span>
                  <span>{paso.porcentaje}%</span>
                </div>
                <div className={estilos.pistaEmbudo}>
                  <div
                    className={estilos.rellenoEmbudo}
                    style={{
                      width: `${paso.porcentaje}%`,
                      backgroundColor: `rgba(153, 69, 255, ${paso.opacidadColor})`,
                    }}
                  >
                    <span className={estilos.textoSobreBarra}>{paso.cantidad}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={estilos.filaInferior}>
        <section className={estilos.tarjeta} aria-labelledby="titulo-geo">
          <h2 id="titulo-geo" className={estilos.tituloSeccion}>
            Desglose geográfico: Bolivia
          </h2>
          <div className={estilos.filaGeo}>
            <div className={estilos.columnaMapa}>
              <div className={estilos.envoltorioMapa}>
                <svg
                  className={estilos.mapaSvg}
                  viewBox="0 0 100 120"
                  aria-hidden
                  focusable="false"
                >
                  <path d="M40 10 L60 15 L80 40 L75 80 L50 110 L20 90 L10 50 L25 20 Z" />
                </svg>
                <p className={estilos.etiquetaMapa}>Núcleo regional Bolivia</p>
              </div>
            </div>
            <div className={estilos.columnaLista}>
              <ul className={estilos.listaRegiones}>
                {regionesBolivia.map((r) => (
                  <li key={r.nombre} className={estilos.itemRegion}>
                    <span className={estilos.nombreRegion}>{r.nombre}</span>
                    <span className={estilos.porcionRegion}>{r.porcentaje}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={estilos.tarjeta} aria-labelledby="titulo-top-montos">
          <h2 id="titulo-top-montos" className={estilos.tituloSeccion}>
            Montos de transacción más altos
          </h2>
          <div className={estilos.tablaWrapper}>
            <table className={estilos.tabla}>
              <thead>
                <tr>
                  <th>ID transacción</th>
                  <th>Monto</th>
                  <th>Activo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filasTopTransacciones.map((fila) => (
                  <tr key={fila.id}>
                    <td className={estilos.idTransaccion}>{fila.id}</td>
                    <td className={estilos.montoDestacado}>{fila.monto}</td>
                    <td>{fila.activo}</td>
                    <td>
                      {fila.estado === "completado" ? (
                        <span className={`${estilos.pastillaEstado} ${estilos.pastillaCompletado}`}>
                          COMPLETADO
                        </span>
                      ) : (
                        <span className={`${estilos.pastillaEstado} ${estilos.pastillaBloqueado}`}>
                          BLOQUEADO
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
