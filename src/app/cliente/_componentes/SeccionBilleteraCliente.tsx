"use client";

import { useState } from "react";

import BotonConexionWallet from "../../solana/BotonConexionWallet";
import estilosAdmin from "../../admin/estilos-administracion.module.css";
import estilos from "../estilos-cliente.module.css";

// Acordeón en el menú lateral: un clic despliega la conexión Phantom (sin barra superior dedicada).
export default function SeccionBilleteraCliente() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className={estilos.seccionWallet}>
      <button
        type="button"
        className={`${estilosAdmin.enlace} ${estilos.botonAcordeonWallet}`}
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        <img
          className={estilos.iconoPhantomNav}
          src="/imagenes/logo-phantom.svg"
          alt=""
          width={22}
          height={22}
          decoding="async"
        />
        <span className={estilosAdmin.etiquetaEnlace}>Billetera Phantom</span>
        <span
          className={`${estilos.flechaAcordeon} ${abierto ? estilos.flechaAcordeonAbierta : ""}`}
          aria-hidden
        />
      </button>
      {abierto ? (
        <div className={estilos.panelWallet}>
          <BotonConexionWallet className={estilos.walletBotonAncho} />
        </div>
      ) : null}
    </div>
  );
}
