"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import estilos from "../estilos-cliente.module.css";

type Props = Readonly<{
  mensaje: string;
  /** Tiempo visible en ms; con hover el reloj se congela (sin texto extra). */
  duracionMs?: number;
}>;

// Toast superior: la barra refleja el tiempo real restante (Date.now + rAF). Pausa silenciosa al hover.
export default function NotificacionSuperiorCliente({
  mensaje,
  duracionMs = 12000,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [pausado, setPausado] = useState(false);
  const [restanteMs, setRestanteMs] = useState(duracionMs);

  const deadlineRef = useRef(Date.now() + duracionMs);
  const pausaRestanteRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    deadlineRef.current = Date.now() + duracionMs;
    pausaRestanteRef.current = null;
    setRestanteMs(duracionMs);
    setVisible(true);
  }, [duracionMs]);

  useEffect(() => {
    if (!visible) return;

    let frameId = 0;

    const tick = () => {
      if (pausado) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const r = Math.max(0, deadlineRef.current - Date.now());
      setRestanteMs(r);

      if (r <= 0) {
        setVisible(false);
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [visible, pausado]);

  const alEntrar = () => {
    const r = Math.max(0, deadlineRef.current - Date.now());
    pausaRestanteRef.current = r;
    setRestanteMs(r);
    setPausado(true);
  };

  const alSalir = () => {
    const guardado = pausaRestanteRef.current;
    if (guardado !== null && guardado > 0) {
      deadlineRef.current = Date.now() + guardado;
    }
    pausaRestanteRef.current = null;
    setPausado(false);
  };

  if (!visible) return null;

  const porcentaje =
    duracionMs > 0 ? Math.max(0, Math.min(100, (restanteMs / duracionMs) * 100)) : 0;

  return (
    <div
      className={estilos.notificacionTarjeta}
      role="status"
      onMouseEnter={alEntrar}
      onMouseLeave={alSalir}
    >
      <div className={estilos.notificacionCuerpo}>
        <span className={estilos.notificacionIcono} aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M12 8v5M12 16h.01"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <p className={estilos.notificacionTexto}>{mensaje}</p>
      </div>
      <div className={estilos.notificacionBarraFondo} aria-hidden>
        <div
          className={estilos.notificacionBarraRelleno}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  );
}
