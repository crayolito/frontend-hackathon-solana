"use client";

import { useState } from "react";
import estilosHome from "../../home.module.css";
import type { ModoModal } from "../autenticacion/tiposAuth";
import CabeceraCompraSegura from "./CabeceraCompraSegura";
import HeroCompraSegura from "./HeroCompraSegura";
import SeccionDocumentacion from "./SeccionDocumentacion";
import PieDePaginaCompraSegura from "./PieDePaginaCompraSegura";
import ModalAutenticacionDemo from "../autenticacion/ModalAutenticacionDemo";

// Monta la UI del home de CompraSegura y controla el modal de autenticación demo.
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

  return (
    <div className={estilosHome.contenedor}>
      <CabeceraCompraSegura onIniciarSesion={() => abrirModal("ingresar")} />

      <main className={estilosHome.main}>
        <HeroCompraSegura onEmpezarGratis={() => abrirModal("registrar")} />
        <SeccionDocumentacion />
      </main>

      <PieDePaginaCompraSegura />

      <ModalAutenticacionDemo
        abierta={modalAbierto}
        modoInicial={modoModal}
        alCerrar={cerrarModal}
      />
    </div>
  );
}

