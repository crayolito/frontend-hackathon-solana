import estilosHome from "../../home.module.css";
import LandingMockupHero from "./LandingMockupHero";

// Hero principal de la landing: copy del brief + mockup animado (QR, pago, métricas).
export default function HeroCompraSegura({
  onEmpezarGratis,
}: Readonly<{
  onEmpezarGratis: () => void;
}>) {
  return (
    <section className={estilosHome.hero}>
      <div className={estilosHome.heroTexto}>
        <h1 className={estilosHome.heroTitulo}>
          <span className={estilosHome.tituloNeonCyan}>
            El dinero no debería necesitar
          </span>
          <br />
          <span className={estilosHome.tituloNeonVerde}>un banco para moverse.</span>
        </h1>

        <p className={estilosHome.heroSubtexto}>
          TrustPay es la pasarela de pagos con cripto para negocios en Latinoamérica. Cobra
          con Solana y USDC, generá tu QR en minutos y pagá solo el 1% por transacción. Sin
          burocracia bancaria. Sin excusas.
        </p>

        <div className={estilosHome.botonesHero}>
          <button
            type="button"
            className={estilosHome.botonPrimario}
            onClick={onEmpezarGratis}
          >
            Abre tu cuenta gratis
          </button>
          <a className={estilosHome.botonSecundario} href="/documentacion">
            Ver documentación
          </a>
        </div>

        <p className={estilosHome.heroMensajesClave}>
          <span>
            &ldquo;Cobrá en cripto como con una pasarela clásica, pero en cadena. Sin banco, sin burocracia.&rdquo;
          </span>
          <span>&ldquo;Tu QR de Solana listo en 5 minutos para tu negocio.&rdquo;</span>
          <span>
            &ldquo;Contratos inteligentes para recompensas, anticréticos y pagos seguros.&rdquo;
          </span>
        </p>
      </div>

      <div className={estilosHome.heroVisual}>
        <LandingMockupHero />
      </div>
    </section>
  );
}
