import estilosHome from "../../home.module.css";

const soporteTelefono = "+51 900 123 456";
const soporteCorreo = "soporte@comprasegura.com";

// Pie de página del home.
export default function PieDePaginaCompraSegura() {
  return (
    <footer className={estilosHome.footer}>
      <div className={estilosHome.footerInner}>
        <div>
          <h3 className={estilosHome.footerTitulo}>Soporte</h3>
          <p className={estilosHome.footerSubtitulo}>
            Si tienes dudas sobre pagos, entregas o integración, escríbenos.
            Queremos ayudarte con lo que necesites.
          </p>

          <div className={estilosHome.footerContacto}>
            <div className={estilosHome.chipContacto}>
              <a href={`tel:${soporteTelefono.replaceAll(" ", "")}`}>
                Tel: {soporteTelefono}
              </a>
            </div>
            <div className={estilosHome.chipContacto}>
              <a href={`mailto:${soporteCorreo}`}>Correo: {soporteCorreo}</a>
            </div>
          </div>
        </div>

        <div className={estilosHome.footerCopy}>
          © {new Date().getFullYear()} CompraSegura. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}

