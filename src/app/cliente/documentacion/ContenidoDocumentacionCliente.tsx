import estilos from "./documentacion-cliente.module.css";
import { obtenerUrlBaseTrustpay } from "../../_lib/apiTrustpay";
import BloqueCodigoCopiar from "./BloqueCodigoCopiar";

type Props = {
  baseUrl?: string;
};

function Metodo({ verbo }: { verbo: "GET" | "POST" }) {
  const clase = verbo === "GET" ? estilos.metodoGet : estilos.metodoPost;
  return <span className={`${estilos.metodo} ${clase}`}>{verbo}</span>;
}

/** Referencia de integración: /api/payments + webhooks. */
export default function ContenidoDocumentacionCliente({ baseUrl: baseProp }: Props) {
  const base = baseProp ?? obtenerUrlBaseTrustpay();

  return (
    <article className={estilos.prosa}>
      <p className={estilos.intro}>
        Usá la <strong>URL base</strong> de abajo. Las rutas <code>/api/payments/...</code> y{" "}
        <code>/api/businesses</code> se autentican con <code>x-api-key</code> y <code>x-secret-key</code> — no
        uses <code>Authorization: Bearer</code>. Las claves son <strong>generales</strong> (mismas para todos tus
        negocios); las generás en TrustPay en <strong>Cuenta → Credenciales API</strong>. Red:{" "}
        <strong>devnet</strong>.
      </p>

      <div className={estilos.urlBase}>{base}</div>

      <nav className={estilos.toc} aria-label="Índice de la documentación">
        <h2 className={estilos.tocTitulo}>Contenidos</h2>
        <ol className={estilos.tocLista}>
          <li>
            <a href="#autenticacion">Headers</a>
          </li>
          <li>
            <a href="#negocios-api">Negocios (GET)</a>
          </li>
          <li>
            <a href="#crear-pago-qr">Crear pago (POST) — cURL</a>
          </li>
          <li>
            <a href="#estado-pago">Estado del pago (GET) — cURL</a>
          </li>
          <li>
            <a href="#confirmar-comprador">Confirmar recepción (comprador)</a>
          </li>
          <li>
            <a href="#webhooks">Webhooks</a>
          </li>
        </ol>
      </nav>

      <h2 id="autenticacion">Headers</h2>
      <p>
        En cada request autenticado a <code>/api/payments/...</code> (excepto el GET público de estado) y en{" "}
        <code>/api/businesses</code>:
      </p>
      <BloqueCodigoCopiar titulo="Headers">
        {`x-api-key: Api_Key
x-secret-key: Secret_Key
Content-Type: application/json`}
      </BloqueCodigoCopiar>

      <h2 id="negocios-api">Negocios (GET)</h2>
      <p>
        Para armar el body de <code>POST /api/payments/qr</code> necesitás el <code>businessId</code> (UUID) y
        conviene conocer <code>walletAddress</code> del negocio. Con las mismas claves que los pagos podés:
      </p>
      <ul style={{ marginBottom: 16 }}>
        <li>
          <strong>Listar</strong> negocios: <code>GET {base}/api/businesses</code> — devuelve{" "}
          <code>{`{ "data": [ { "id", "name", "walletAddress", "isVerified", ... } ] }`}</code>. Con{" "}
          <strong>credencial general</strong> ven todos los negocios activos de la cuenta; con clave ligada a un
          solo negocio, un único elemento.
        </li>
        <li>
          <strong>Obtener uno</strong> por id: <code>GET {base}/api/businesses/BUSINESS_UUID</code>.
        </li>
      </ul>
      <BloqueCodigoCopiar titulo="cURL — listar negocios">
        {`curl -sS "${base}/api/businesses" \\
  -H "x-api-key: Api_Key" \\
  -H "x-secret-key: Secret_Key"`}
      </BloqueCodigoCopiar>
      <BloqueCodigoCopiar titulo="cURL — un negocio por UUID">
        {`curl -sS "${base}/api/businesses/BUSINESS_UUID" \\
  -H "x-api-key: Api_Key" \\
  -H "x-secret-key: Secret_Key"`}
      </BloqueCodigoCopiar>
      <p className={estilos.nota}>
        El negocio debe estar <code>isVerified: true</code> para crear pagos escrow. Usá el <code>id</code> de la
        respuesta como <code>businessId</code> en el POST del QR.
      </p>

      <h2 id="crear-pago-qr">
        <Metodo verbo="POST" /> <code>/api/payments/qr</code>
      </h2>
      <p>
        Crea un intent de pago con QR. Sustituí <code>Api_Key</code> y <code>Secret_Key</code> por tus valores
        reales. Con <strong>credenciales generales</strong>, enviá <code>businessId</code> (UUID del negocio
        donde debe aplicarse el pago).
      </p>
      <BloqueCodigoCopiar titulo="cURL (bash / Git Bash / macOS / Linux)">
        {`curl -X POST "${base}/api/payments/qr" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: Api_Key" \\
  -H "x-secret-key: Secret_Key" \\
  -d '{
    "businessId": "UUID_DEL_NEGOCIO",
    "amount": 0.01,
    "orderId": "pedido-001",
    "sellerWallet": null,
    "webhookUrl": "https://tu-servidor.com/webhook",
    "expiresInMinutes": 15,
    "description": "Compra demo"
  }'`}
      </BloqueCodigoCopiar>
      <p className={estilos.nota}>
        <code>amount</code>: monto del pedido en SOL (&gt; 0), es decir lo que recibe el vendedor en escrow. El
        comprador paga <code>amount</code> + comisión de plataforma (configurable en el panel admin, p. ej. 1%).
        La respuesta incluye <code>commissionAmount</code>, <code>totalAmount</code>, <code>commissionBps</code> y{" "}
        <code>buyerConfirmUrl</code> (enlace web para que el comprador confirme recepción y libere el escrow).{" "}
        <code>businessId</code>: obligatorio con claves de cuenta. Si omitís <code>sellerWallet</code>, se usa la
        wallet del negocio indicado. Guardá el <code>id</code> del pago para el GET de estado.
      </p>

      <h2 id="estado-pago">
        <Metodo verbo="GET" /> <code>/api/payments/:paymentId/status</code>
      </h2>
      <p>Público: no lleva headers de API Key. Reemplazá <code>PAYMENT_ID</code> por el id del pago.</p>
      <BloqueCodigoCopiar titulo="cURL">
        {`curl -sS "${base}/api/payments/PAYMENT_ID/status"`}
      </BloqueCodigoCopiar>
      <p className={estilos.nota}>
        Podés repetir la llamada desde el navegador del comprador o desde tu backend para polling. La respuesta
        incluye <code>status</code>, <code>buyerWallet</code> (si ya pagó), <code>orderId</code>,{" "}
        <code>description</code> y <code>businessName</code>.
      </p>

      <h2 id="confirmar-comprador">Confirmar recepción (comprador)</h2>
      <p>
        Cuando el pago está en <code>escrow_locked</code> o <code>shipped</code>, el comprador puede liberar
        fondos al vendedor. La forma recomendada es abrir el enlace <code>buyerConfirmUrl</code> devuelto al crear
        el pago (el backend arma la URL con <code>FRONTEND_PUBLIC_URL</code>; por defecto incluye{" "}
        <code>/pago/PAYMENT_ID/confirmar</code> en el frontend TrustPay).
      </p>
      <p>
        En esa página el comprador conecta Phantom (misma wallet que pagó) y firma la transacción. Alternativa para
        integrar tu propia UI: <code>POST {base}/api/payments/PAYMENT_ID/confirm</code> con cuerpo{" "}
        <code>{"{ \"account\": \"WALLET_DEL_COMPRADOR\" }"}</code> — respuesta <code>transaction</code> (base64) +
        firma en wallet + envío a Solana.
      </p>

      <h2 id="webhooks">Webhooks</h2>
      <p>
        Configurás la URL del webhook y el secreto de firma desde el panel de TrustPay. Cuando hay un evento,
        recibís un <code>POST</code> con cuerpo JSON y estos headers:
      </p>
      <BloqueCodigoCopiar titulo="Headers de la petición entrante">
        {`Content-Type: application/json
X-TrustPay-Signature: <hex_hmac_sha256>
X-TrustPay-Event: <tipo_de_evento>`}
      </BloqueCodigoCopiar>
      <p>
        Verificá la firma: HMAC-SHA256 del <strong>cuerpo crudo</strong> (el mismo string JSON recibido) con tu{" "}
        <code>signingSecret</code> (te lo mostramos al crear el endpoint). Debe coincidir en hexadecimal con{" "}
        <code>X-TrustPay-Signature</code>.
      </p>
      <BloqueCodigoCopiar titulo="Ejemplo de cuerpo">
        {`{
  "type": "escrow.locked",
  "data": {},
  "created_at": "2026-03-23T12:00:00.000Z"
}`}
      </BloqueCodigoCopiar>
      <p className={estilos.nota}>
        Eventos típicos: <code>escrow.locked</code>, <code>escrow.released</code>, <code>payment.expired</code>,{" "}
        etc. Respondé HTTP 2xx si procesaste bien; si no, se reintenta.
      </p>
      <BloqueCodigoCopiar titulo="Verificar firma con OpenSSL (ejemplo local)">
        {`# Guardá el body en body.json y el secreto en SECRET (sin saltos extra al final)
echo -n "$(cat body.json)" | openssl dgst -sha256 -hmac "TU_SIGNING_SECRET" -hex`}
      </BloqueCodigoCopiar>
    </article>
  );
}
