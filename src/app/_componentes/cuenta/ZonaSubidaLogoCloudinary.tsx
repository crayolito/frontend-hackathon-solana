"use client";

import { useCallback, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { subirImagenCloudinary } from "../../_lib/cloudinaryTrustpay";
import estilos from "./zonaSubidaLogoCloudinary.module.css";

const MAX_TAMANIO_MB = 8;
const TIPOS_ACEPTADOS = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const LOGO_DEFAULT_SRC = "/imagenes/negocio-default.svg";

type Props = {
  url: string;
  alCambiarUrl: (url: string) => void;
  etiqueta?: string;
  textoPlaceholder?: string;
  /** Clases extra para el botón secundario (p. ej. estilos del panel). */
  claseBotonSecundario?: string;
};

// Permite elegir imagen por clic en la zona o en "Elegir archivo", sube a Cloudinary y devuelve la URL segura.
export default function ZonaSubidaLogoCloudinary({
  url,
  alCambiarUrl,
  etiqueta = "Logo",
  textoPlaceholder = "Clic para elegir\no soltá aquí",
  claseBotonSecundario,
}: Readonly<Props>) {
  const idEntrada = useId();
  const refEntrada = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const procesarArchivo = useCallback(
    async (archivo: File | undefined) => {
      if (!archivo) return;
      setError(null);
      if (!TIPOS_ACEPTADOS.includes(archivo.type)) {
        setError("Usá JPG, PNG, WebP, GIF o SVG.");
        return;
      }
      if (archivo.size > MAX_TAMANIO_MB * 1024 * 1024) {
        setError(`Máximo ${MAX_TAMANIO_MB} MB.`);
        return;
      }
      setSubiendo(true);
      try {
        const nueva = await subirImagenCloudinary(archivo);
        alCambiarUrl(nueva);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al subir.");
      } finally {
        setSubiendo(false);
        if (refEntrada.current) refEntrada.current.value = "";
      }
    },
    [alCambiarUrl],
  );

  const alCambioEntrada = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const archivo = ev.target.files?.[0];
      void procesarArchivo(archivo);
    },
    [procesarArchivo],
  );

  const alSoltar = useCallback(
    (ev: DragEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      const archivo = ev.dataTransfer.files?.[0];
      void procesarArchivo(archivo);
    },
    [procesarArchivo],
  );

  return (
    <div>
      {etiqueta ? <span className={estilos.etiqueta}>{etiqueta}</span> : null}
      <div className={estilos.fila}>
        <input
          ref={refEntrada}
          id={idEntrada}
          className={estilos.inputOculto}
          type="file"
          accept={TIPOS_ACEPTADOS.join(",")}
          onChange={alCambioEntrada}
          aria-label={etiqueta}
        />
        <button
          type="button"
          className={estilos.zonaClic}
          disabled={subiendo}
          onClick={() => refEntrada.current?.click()}
          onDragOver={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          }}
          onDrop={alSoltar}
        >
          {url ? (
            <img className={estilos.imagenPreview} src={url} alt="" />
          ) : subiendo ? (
            <span className={estilos.placeholder}>Subiendo…</span>
          ) : (
            <img className={estilos.imagenPreview} src={LOGO_DEFAULT_SRC} alt="" />
          )}
        </button>
        <div className={estilos.acciones}>
          <button
            type="button"
            className={`${estilos.botonArchivo} ${claseBotonSecundario ?? ""}`.trim()}
            disabled={subiendo}
            onClick={() => refEntrada.current?.click()}
          >
            {subiendo ? "Subiendo…" : "Elegir archivo"}
          </button>
          {url ? (
            <button
              type="button"
              className={estilos.botonQuitar}
              disabled={subiendo}
              onClick={() => {
                alCambiarUrl("");
                setError(null);
              }}
            >
              Quitar imagen
            </button>
          ) : null}
          <p className={estilos.hint}>JPG, PNG, WebP hasta {MAX_TAMANIO_MB} MB.</p>
        </div>
      </div>
      {error ? <p className={estilos.error}>{error}</p> : null}
    </div>
  );
}
