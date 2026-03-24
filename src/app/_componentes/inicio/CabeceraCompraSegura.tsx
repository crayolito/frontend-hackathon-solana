"use client";

import estilosHome from "../../home.module.css";
import BotonConexionWallet from "../../solana/BotonConexionWallet";

// Barra superior del home TrustPay: Phantom, marca e inicio de sesión.
export default function CabeceraCompraSegura({
  onIniciarSesion,
}: Readonly<{
  onIniciarSesion: () => void;
}>) {
  return (
    <header className={estilosHome.header}>
      <div className={estilosHome.headerInner}>
        <div className={estilosHome.marca} aria-label="TrustPay">
          <div className={estilosHome.logoSolana}>
            <img
              className={estilosHome.logoImagen}
              src="/imagenes/logo1-solana.png"
              alt="Solana"
            />
          </div>
          <div className={estilosHome.tituloMarca}>TrustPay</div>
        </div>

        <div className={estilosHome.headerAcciones}>
          <div className={estilosHome.headerWalletSlot}>
            <BotonConexionWallet compacto />
          </div>
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

