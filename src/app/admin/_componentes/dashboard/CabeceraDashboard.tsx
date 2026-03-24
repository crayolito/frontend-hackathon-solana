"use client";

import { estiloMascaraIcono } from "../../_utilidades/estiloMascaraIcono";
import estilosMascara from "../iconos-mascara.module.css";
import estilos from "./cabecera-dashboard.module.css";

// Cabecera del panel: titulo, filtro de mes y opcionalmente exportar CSV.
type Props = {
  /** Si se omite, no se muestra el boton de exportar. */
  alExportar?: () => void;
  /** Deshabilita el botón mientras se genera el CSV (p. ej. analítica comercio). */
  exportandoCsv?: boolean;
  titulo?: string;
  subtitulo?: string;
  /** Si es false, oculta el selector de mes (p. ej. Configuracion). */
  mostrarSelectorMes?: boolean;
};

export default function CabeceraDashboard({
  alExportar,
  exportandoCsv = false,
  titulo = "Rendimiento del negocio",
  subtitulo = "Visión mensual detallada para la gestión estratégica",
  mostrarSelectorMes = true,
}: Props) {
  const mostrarExportar = typeof alExportar === "function";
  return (
    <header className={estilos.cabeceraPrincipal}>
      <div>
        <h1 className={estilos.tituloPrincipal}>{titulo}</h1>
        <p className={estilos.subtituloPrincipal}>{subtitulo}</p>
      </div>
      <div className={estilos.accionesCabecera}>
        {mostrarSelectorMes ? (
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
        ) : null}
        {mostrarExportar ? (
          <button
            type="button"
            className={estilos.botonExportar}
            onClick={alExportar}
            disabled={exportandoCsv}
          >
            <span
              className={estilosMascara.iconoExportarMascara}
              style={estiloMascaraIcono("/file.svg")}
              aria-hidden
            />
            {exportandoCsv ? "Exportando…" : "Exportar datos"}
          </button>
        ) : null}
      </div>
    </header>
  );
}
