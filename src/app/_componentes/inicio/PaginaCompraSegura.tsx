"use client";

import { useEffect, useState } from "react";
import estilosHome from "../../home.module.css";
import ProveedorSolana from "../../solana/ProveedorSolana";
import type { ModoModal } from "../autenticacion/tiposAuth";
import CabeceraCompraSegura from "./CabeceraCompraSegura";
import ContenidoLandingTrustpay from "./ContenidoLandingTrustpay";
import HeroCompraSegura from "./HeroCompraSegura";
import PieDePaginaCompraSegura from "./PieDePaginaCompraSegura";
import ModalAutenticacionDemo from "../autenticacion/ModalAutenticacionDemo";

// Home público TrustPay y modal de login/registro contra el API.
export default function PaginaCompraSegura() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState<ModoModal>("ingresar");

  const abrirModal = (modo: ModoModal) => {
    setModoModal(modo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  // Tras cerrar sesión o volver al home, el scroll no debe quedar abajo del documento anterior.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <ProveedorSolana>
      <div className={estilosHome.contenedor}>
        <CabeceraCompraSegura onIniciarSesion={() => abrirModal("ingresar")} />

        <main id="inicio" className={estilosHome.main}>
          <HeroCompraSegura onEmpezarGratis={() => abrirModal("registrar")} />
          <ContenidoLandingTrustpay onCrearCuentaGratis={() => abrirModal("registrar")} />
        </main>

        <PieDePaginaCompraSegura />

        <ModalAutenticacionDemo
          abierta={modalAbierto}
          modoInicial={modoModal}
          alCerrar={cerrarModal}
        />
      </div>
    </ProveedorSolana>
  );
}

