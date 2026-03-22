import estilos from "./documentacion-cliente.module.css";

// Guía funcional para el comercio: flujos, claves y webhooks (referencia de producto).
export default function ContenidoDocumentacionCliente() {
  return (
    <article className={estilos.prosa}>
      <h2>Qué es esta área</h2>
      <p>
        Desde el panel del <strong>comercio</strong> configurás la integración con TrustPay: cobros en Solana,
        claves de API, webhooks y datos de tu cuenta. Parte del panel sigue en modo demostración hasta conectar
        todos los servicios de backend.
      </p>

      <h2>Flujo general</h2>
      <ol className={estilos.lista}>
        <li>El comprador paga y el fondo queda en escrow on-chain según tu reglas.</li>
        <li>Recibís eventos en la URL de webhook que configures (por ejemplo escrow liberado).</li>
        <li>Validás la firma del cuerpo con el <strong>secreto de webhooks</strong> que ves en Claves API.</li>
        <li>Los cobros pueden liquidarse a la wallet SOL que cargues en Configuración.</li>
      </ol>

      <h2>Claves API</h2>
      <p>
        La clave <strong>publicable</strong> va en el front (checkout embebido). La <strong>secreta</strong>{" "}
        solo en tu servidor para crear cargos o consultar el API. Rotá la secreta si se filtra.
      </p>
      <code className={estilos.codigo}>
        Authorization: Bearer sk_test_…
      </code>

      <h2>Webhooks</h2>
      <p>
        Registrás una URL HTTPS. Elegís eventos (<code>escrow.created</code>, <code>payment.succeeded</code>,
        etc.). Cada entrega aparece en la tabla de logs con código HTTP para depurar.
      </p>
      <div className={estilos.tarjetaInfo}>
        Consejo: respondé 2xx rápido; procesá en cola interna. Si fallás con 5xx, reintentamos según política
        (demo no muestra reintentos reales).
      </div>

      <h2>Pagos</h2>
      <p>
        Aquí verás el listado de operaciones del comercio (mismo concepto que “transacciones” en el backoffice
        interno, pero filtrado a tu cuenta).
      </p>

      <h2>Configuración</h2>
      <p>
        Perfil comercial, dirección de cobro en Solana, notificaciones y equipo. Cambiar la wallet de cobro
        puede disparar una verificación extra antes de retiros.
      </p>
    </article>
  );
}
