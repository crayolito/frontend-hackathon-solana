import Link from "next/link";

import ContenidoDocumentacionCliente from "../cliente/documentacion/ContenidoDocumentacionCliente";
import estilos from "./documentacion-publica.module.css";

// Documentación pública reutilizable: enlazada desde el home para comercios y desarrolladores.
export default function PaginaDocumentacionPublica() {
  return (
    <div className={estilos.pagina}>
      <header className={estilos.cabecera}>
        <Link href="/" className={estilos.enlaceInicio}>
          ← Volver al inicio
        </Link>
        <h1 className={estilos.titulo}>Documentación TrustPay</h1>
        <p className={estilos.subtitulo}>
          Guía funcional: API, webhooks y cobros para integrar tu comercio.
        </p>
      </header>
      <div className={estilos.contenidoMax}>
        <ContenidoDocumentacionCliente />
      </div>
    </div>
  );
}
