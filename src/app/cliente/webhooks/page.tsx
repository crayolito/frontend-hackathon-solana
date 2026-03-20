import CabeceraAreaCliente from "../_componentes/CabeceraAreaCliente";
import ContenidoWebhooksCliente from "../_componentes/ContenidoWebhooksCliente";

export default function PaginaWebhooksCliente() {
  return (
    <>
      <CabeceraAreaCliente
        titulo="Webhooks"
        subtitulo="Endpoints, eventos y entregas recientes (demo)."
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
            background: "#d1fae5",
            color: "#047857",
          }}
        >
          Servicio: operativo
        </span>
      </div>
      <ContenidoWebhooksCliente />
    </>
  );
}
