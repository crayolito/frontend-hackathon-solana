import { estiloMascaraIcono } from "../../_utilidades/estiloMascaraIcono";
import estilosEncabezados from "../encabezados-seccion-dashboard.module.css";
import estilosMascara from "../iconos-mascara.module.css";
import estilos from "./tabla-acciones-criticas.module.css";

// Tabla de filas destacadas con estado y acciones (demo).
export default function TablaAccionesCriticas() {
  return (
    <section className={estilos.tarjetaTabla}>
      <div className={estilosEncabezados.cabeceraTarjetaAncha}>
        <h2 className={estilosEncabezados.tituloSeccion}>Acciones críticas del mes</h2>
        <a className={estilosEncabezados.enlaceSecundario} href="/admin/transactions">
          Ver registro de transacciones
        </a>
      </div>
      <div className={estilos.envoltorioTabla}>
        <table className={estilos.tabla}>
          <thead>
            <tr>
              <th>Entidad</th>
              <th>ID de transacción</th>
              <th className={estilos.thCentrado}>Índice</th>
              <th>Estado</th>
              <th className={estilos.thDerecha}>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={estilos.celdaEntidad}>
                  <div className={`${estilos.miniIcono} ${estilos.miniIconoNaranja}`}>
                    <span
                      className={`${estilosMascara.mascaraIcono} ${estilosMascara.mascaraIconoPequena}`}
                      style={estiloMascaraIcono("/iconos/icon-transacciones.svg")}
                      aria-hidden
                    />
                  </div>
                  <span className={estilos.nombreEntidad}>HyperSwap</span>
                </div>
              </td>
              <td className={estilos.celdaMuted}>#TX-9021-X</td>
              <td className={estilos.celdaCentrada}>★★★</td>
              <td>
                <span className={`${estilos.pillEstado} ${estilos.pillCompletado}`}>
                  Completada
                </span>
              </td>
              <td className={estilos.celdaDerecha}>
                <button type="button" className={estilos.botonTabla}>
                  Verificar ingreso
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div className={estilos.celdaEntidad}>
                  <div className={`${estilos.miniIcono} ${estilos.miniIconoRojo}`}>
                    <span
                      className={`${estilosMascara.mascaraIcono} ${estilosMascara.mascaraIconoPequena}`}
                      style={estiloMascaraIcono("/iconos/icon-exclamation.svg")}
                      aria-hidden
                    />
                  </div>
                  <span className={estilos.nombreEntidad}>NFT Void</span>
                </div>
              </td>
              <td className={estilos.celdaMuted}>#TX-8842-D</td>
              <td className={estilos.celdaCentrada}>★★</td>
              <td>
                <span className={`${estilos.pillEstado} ${estilos.pillDisputa}`}>
                  Disputa
                </span>
              </td>
              <td className={estilos.celdaDerecha}>
                <button type="button" className={estilos.botonTablaAlerta}>
                  Auditar socio
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
