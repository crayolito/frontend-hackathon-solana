import estilos from "./documentacion-cliente.module.css";

// Guía funcional para el comercio: flujos, cuenta y cobros (referencia de producto).
export default function ContenidoDocumentacionCliente() {
  return (
    <article className={estilos.prosa}>
      <h2>Qué es esta área</h2>
      <p>
        Desde el panel del <strong>comercio</strong> gestionás negocios, QRs, un listado de{" "}
        <strong>Transacciones</strong> (demo con datos fijos) y tu{" "}
        <strong>Cuenta</strong> (perfil, marca, wallet y avisos). El resto se conecta al backend cuando esté listo.
      </p>

      <h2>Flujo general</h2>
      <ol className={estilos.lista}>
        <li>El comprador paga y el fondo queda en escrow on-chain según tu reglas.</li>
        <li>En producción podrás recibir eventos en tu servidor (webhooks) cuando el backend lo exponga.</li>
        <li>
          En <strong>Developers &amp; API</strong> tenés una firma de eventos simulada para la demo de integración.
        </li>
        <li>Los cobros se asocian a la wallet de tu cuenta o a Phantom; revisala en <strong>Cuenta</strong>.</li>
      </ol>

      <h2>Transacciones en el panel</h2>
      <p>
        La pantalla <strong>Transacciones</strong> muestra KPIs y movimientos de ejemplo para la presentación. Cuando
        exista API de movimientos, reemplazamos esos datos por los reales sin cambiar el diseño base.
      </p>
      <div className={estilos.tarjetaInfo}>
        Los webhooks hacia tu URL siguen siendo parte del modelo de producto; en esta hackathon el foco está en el
        flujo de cobro y el panel del comercio.
      </div>

      <h2>Cuenta</h2>
      <p>
        Perfil sincronizado con el API, logo de marca (subida vía Cloudinary en el navegador), wallet de la cuenta,
        conexión Phantom y preferencias de avisos por transacción (hoy guardadas en local hasta exista endpoint).
      </p>
    </article>
  );
}
