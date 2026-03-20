import estilosHome from "../../home.module.css";

// Sección principal: mensaje de valor + CTA para registrarse.
export default function HeroCompraSegura({
  onEmpezarGratis,
}: Readonly<{
  onEmpezarGratis: () => void;
}>) {
  return (
    <section className={estilosHome.hero}>
      <div className={estilosHome.heroTexto}>
        <h1 className={estilosHome.heroTitulo}>
          <span className={estilosHome.tituloNeonCyan}>Accept payments</span>
          <br />
          <span className={estilosHome.tituloNeonVerde}>
            with delivery guarantee
          </span>
        </h1>

        <p className={estilosHome.heroSubtexto}>
          CompraSegura crea un método de pago tipo Stripe, pero usando la red
          de Solana. Por eso, tu dinero se libera solo con confirmación de
          entrega (escrow seguro).
        </p>

        <div className={estilosHome.botonesHero}>
          <button
            type="button"
            className={estilosHome.botonPrimario}
            onClick={onEmpezarGratis}
          >
            Empieza de forma gratis
          </button>
          <a
            className={estilosHome.botonSecundario}
            href="#documentacion"
          >
            Ver documentación
          </a>
        </div>
      </div>
    </section>
  );
}

