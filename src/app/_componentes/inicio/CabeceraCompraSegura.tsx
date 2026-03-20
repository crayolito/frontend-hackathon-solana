import estilosHome from "../../home.module.css";

// Barra superior del home (marca + botón para abrir el modal de inicio de sesión).
export default function CabeceraCompraSegura({
  onIniciarSesion,
}: Readonly<{
  onIniciarSesion: () => void;
}>) {
  return (
    <header className={estilosHome.header}>
      <div className={estilosHome.headerInner}>
        <div className={estilosHome.marca} aria-label="CompraSegura">
          <div className={estilosHome.logoSolana}>
            <img
              className={estilosHome.logoImagen}
              src="/imagenes/logo1-solana.png"
              alt="Solana"
            />
          </div>
          <div className={estilosHome.tituloMarca}>CompraSegura</div>
        </div>

        <div className={estilosHome.headerAcciones}>
          <button
            type="button"
            className={estilosHome.botonHeader}
            onClick={onIniciarSesion}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

