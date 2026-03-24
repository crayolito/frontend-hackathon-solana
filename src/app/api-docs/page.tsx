import Image from "next/image";
import Link from "next/link";

import ContenidoDocumentacionCliente from "../cliente/documentacion/ContenidoDocumentacionCliente";
import { obtenerUrlBaseTrustpay } from "../_lib/apiTrustpay";
import estilos from "./api-docs.module.css";

const FECHA_DOC = "23 de marzo, 2026";
const VERSION_API = "1.0";

export default function PaginaApiDocs() {
  const baseUrl = obtenerUrlBaseTrustpay();

  return (
    <div className={estilos.pagina}>
      <header className={estilos.barraSuperior}>
        <Link href="/" className={estilos.marca} style={{ textDecoration: "none", color: "inherit" }}>
          <Image src="/imagenes/logo1-solana.png" alt="" width={32} height={32} priority />
          <span>TrustPay</span>
        </Link>
        <nav className={estilos.navAcciones} aria-label="Navegación de la documentación">
          <Link href="/" className={estilos.enlaceSecundario}>
            Inicio
          </Link>
          <Link href="/cliente" className={estilos.volver}>
            ← Panel del comercio
          </Link>
        </nav>
      </header>

      <div className={estilos.contenedor}>
        <section className={estilos.hero} aria-labelledby="api-docs-titulo">
          <h1 id="api-docs-titulo" className={estilos.tituloPrincipal}>
            Documentación API
          </h1>
          <p className={estilos.subtituloHero}>
            Referencia de <code style={{ fontSize: "0.95em" }}>/api/payments</code> con ejemplos cURL. Claves
            en TrustPay → Cuenta.
          </p>
          <div className={estilos.metaFila}>
            <span className={estilos.pillVersion}>Versión {VERSION_API}</span>
            <span className={estilos.separadorMeta}>·</span>
            <span>Última modificación: {FECHA_DOC}</span>
            <span className={estilos.separadorMeta}>·</span>
            <span>
              Base URL: <code style={{ fontSize: "0.88em", color: "#0f172a" }}>{baseUrl}</code>
            </span>
          </div>
        </section>

        <div className={estilos.tarjetaContenido}>
          <div className={estilos.tarjetaInner}>
            <ContenidoDocumentacionCliente baseUrl={baseUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
