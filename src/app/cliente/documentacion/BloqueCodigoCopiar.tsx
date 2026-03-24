"use client";

import { useCallback, useState } from "react";
import estilos from "./documentacion-cliente.module.css";

type Props = {
  titulo: string;
  /** Texto exacto que se copia al portapapeles */
  children: string;
};

export default function BloqueCodigoCopiar({ titulo, children }: Props) {
  const [estado, setEstado] = useState<"idle" | "ok" | "err">("idle");

  const copiar = useCallback(async () => {
    const texto = children;
    try {
      await navigator.clipboard.writeText(texto);
      setEstado("ok");
      window.setTimeout(() => setEstado("idle"), 2000);
    } catch {
      setEstado("err");
      window.setTimeout(() => setEstado("idle"), 2500);
    }
  }, [children]);

  const etiquetaBoton =
    estado === "ok" ? "¡Copiado!" : estado === "err" ? "Error" : "Copiar";

  return (
    <figure className={estilos.figuraCodigo}>
      <div className={estilos.bloqueCodigoBarra}>
        <figcaption className={estilos.leyendaCodigo}>{titulo}</figcaption>
        <button
          type="button"
          className={estilos.botonCopiarCodigo}
          onClick={() => void copiar()}
          aria-label={`Copiar al portapapeles: ${titulo}`}
        >
          {etiquetaBoton}
        </button>
      </div>
      <pre className={estilos.codigo}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
