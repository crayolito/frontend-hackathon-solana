import type { SocioRentabilidadDemo } from "../../_datos/datosDashboardDemo";
import { estiloMascaraIcono } from "../../_utilidades/estiloMascaraIcono";
import estilosEncabezados from "../encabezados-seccion-dashboard.module.css";
import estilosMascara from "../iconos-mascara.module.css";
import estilos from "./seccion-rentabilidad-dashboard.module.css";

type Props = {
  socios: SocioRentabilidadDemo[];
};

// Lista de rentabilidad por socio y resumen en donut (datos demo).
export default function SeccionRentabilidadDashboard({ socios }: Props) {
  return (
    <section className={estilos.filaRentabilidad}>
      <div className={estilos.tarjetaAncha}>
        <div className={estilosEncabezados.cabeceraTarjetaAncha}>
          <div>
            <h2 className={estilosEncabezados.tituloSeccion}>Rentabilidad por socio</h2>
            <p className={estilosEncabezados.subtituloSeccion}>
              Mayores aportes de ingresos este mes
            </p>
          </div>
          <button type="button" className={estilosEncabezados.enlaceSecundario}>
            Ver analítica completa
          </button>
        </div>
        <div className={estilos.listaSocios}>
          {socios.map((s) => (
            <div key={s.nombre} className={estilos.filaSocio}>
              <div className={estilos.avatarSocio}>
                <span
                  className={estilosMascara.mascaraIconoAvatar}
                  style={estiloMascaraIcono(s.icono, s.color)}
                  aria-hidden
                />
              </div>
              <div className={estilos.datosSocio}>
                <div className={estilos.filaTituloMonto}>
                  <h4 className={estilos.nombreSocio}>{s.nombre}</h4>
                  <span className={estilos.montoSocio}>{s.monto}</span>
                </div>
                <div className={estilos.barraProgreso}>
                  <div
                    className={estilos.barraProgresoRelleno}
                    style={{ width: `${s.ancho}%`, background: s.color }}
                  />
                </div>
                <div className={estilos.filaMeta}>
                  <span className={estilos.metaSocio}>Participación en ingresos del mes</span>
                  <span className={estilos.porcSocio} style={{ color: s.color }}>
                    {s.ancho}% de aporte
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={estilos.tarjetaDonut}>
        <h2 className={estilosEncabezados.tituloSeccion}>Distribución de socios</h2>
        <div className={estilos.contenedorDonut}>
          <div className={estilos.donutVisual}>
            <div className={estilos.donutCentro}>
              <p className={estilos.numeroDonut}>48</p>
              <p className={estilos.textoDonut}>Socios</p>
            </div>
          </div>
        </div>
        <div className={estilos.leyendaDonut}>
          <div className={estilos.itemLeyenda}>
            <span className={estilos.puntoLeyenda} style={{ background: "#f97316" }} />
            <span>Alto valor</span>
          </div>
          <div className={estilos.itemLeyenda}>
            <span className={estilos.puntoLeyenda} style={{ background: "#3b82f6" }} />
            <span>Medio</span>
          </div>
          <div className={estilos.itemLeyenda}>
            <span className={estilos.puntoLeyenda} style={{ background: "#10b981" }} />
            <span>Bajo volumen</span>
          </div>
          <div className={estilos.itemLeyenda}>
            <span className={estilos.puntoLeyenda} style={{ background: "#a855f7" }} />
            <span>Nuevos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
