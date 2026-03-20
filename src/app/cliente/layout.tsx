import estilos from "./estilos-cliente.module.css";

// Disposicion del area del cliente: barra lateral izquierda
// y contenido a la derecha.
export default function DisposicionDeCliente({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={estilos.contenedor}>
      <aside className={estilos.barra}>
        <div className={estilos.marca}>
          <h2 className={estilos.titulo}>Cliente</h2>
          <div className={estilos.subtitulo}>Panel del cliente</div>
        </div>

        <nav className={estilos.navegacion}>
          <a
            className={`${estilos.enlace} ${estilos.enlacePrincipal}`}
            href="/cliente"
          >
            Panel
          </a>
          <a className={estilos.enlace} href="/cliente/pamnets">
            Pagos
          </a>
          <a className={estilos.enlace} href="/cliente/apikeys">
            Claves API
          </a>
          <a className={estilos.enlace} href="/cliente/settings">
            Configuracion
          </a>
          <a className={estilos.enlace} href="/cliente/documentattion">
            Documentacion
          </a>
        </nav>
      </aside>

      <main className={estilos.contenido}>{children}</main>
    </div>
  );
}

