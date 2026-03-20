"use client";

import { estiloMascaraIcono } from "../../_utilidades/estiloMascaraIcono";
import estilosMascara from "../iconos-mascara.module.css";
import estilos from "./cabecera-dashboard.module.css";

// Cabecera del panel: titulo, filtro de mes y accion de exportar CSV.
type Props = {
  alExportar: () => void;
};

export default function CabeceraDashboard({ alExportar }: Props) {
  return (
    <header className={estilos.cabeceraPrincipal}>
      <div>
        <h1 className={estilos.tituloPrincipal}>Rendimiento del negocio</h1>
        <p className={estilos.subtituloPrincipal}>
          Visión mensual detallada para la gestión estratégica
        </p>
      </div>
      <div className={estilos.accionesCabecera}>
        <div className={estilos.envoltorioSelector}>
          <select
            className={estilos.selectorMes}
            defaultValue="noviembre-2023"
            aria-label="Seleccionar mes"
          >
            <option value="octubre-2023">Octubre 2023</option>
            <option value="noviembre-2023">Noviembre 2023</option>
            <option value="diciembre-2023">Diciembre 2023</option>
          </select>
          <span className={estilos.iconoExpandir} aria-hidden>
            ▼
          </span>
        </div>
        <button
          type="button"
          className={estilos.botonExportar}
          onClick={alExportar}
        >
          <span
            className={estilosMascara.iconoExportarMascara}
            style={estiloMascaraIcono("/file.svg")}
            aria-hidden
          />
          Exportar datos
        </button>
      </div>
    </header>
  );
}
