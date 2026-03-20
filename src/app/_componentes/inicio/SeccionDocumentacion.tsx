import estilosHome from "../../home.module.css";
import { IconoCodigo, IconoEscrow, IconoVelocidad } from "./IconosCompraSegura";

// Sección “Compra rápida. Entrega garantizada.” con 3 cards informativas.
export default function SeccionDocumentacion() {
  return (
    <section id="documentacion" className={estilosHome.seccion}>
      <div className={estilosHome.seccionCabecera}>
        <h2 className={estilosHome.seccionTitulo}>
          Compra rápida. Entrega garantizada.
        </h2>
        <p className={estilosHome.seccionSubtitulo}>
          Tres piezas clave para construir pagos con seguridad y velocidad
          sobre Solana.
        </p>
      </div>

      <div className={estilosHome.gridCards}>
        <div className={estilosHome.glassCard}>
          <div
            className={`${estilosHome.cardIcono} ${estilosHome.iconoCian}`}
            aria-hidden="true"
          >
            <IconoEscrow color="#00f2ff" />
          </div>
          <div>
            <h3 className={estilosHome.cardTitulo}>Escrow Protection</h3>
            <p className={estilosHome.cardTexto}>
              Funds released only upon successful delivery. Safe for all.
            </p>
          </div>
        </div>

        <div className={estilosHome.glassCard}>
          <div
            className={`${estilosHome.cardIcono} ${estilosHome.iconoLima}`}
            aria-hidden="true"
          >
            <IconoVelocidad color="#aef400" />
          </div>
          <div>
            <h3 className={estilosHome.cardTitulo}>Solana Speed</h3>
            <p className={estilosHome.cardTexto}>
              Instant settlements with minimal fees. Built for global scale.
            </p>
          </div>
        </div>

        <div className={estilosHome.glassCard}>
          <div
            className={`${estilosHome.cardIcono} ${estilosHome.iconoFucsia}`}
            aria-hidden="true"
          >
            <IconoCodigo color="#f500dc" />
          </div>
          <div>
            <h3 className={estilosHome.cardTitulo}>Simple API</h3>
            <p className={estilosHome.cardTexto}>
              Easy no-code tools &amp; developer-friendly docs for any stack.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

