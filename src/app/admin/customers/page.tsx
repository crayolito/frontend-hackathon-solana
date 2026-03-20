import estilosAdmin from "../estilos-administracion.module.css";

// Vista placeholder para Clientes.
export default function PaginaCustomers() {
  return (
    <div className={estilosAdmin.cabecera}>
      <h1>Clientes</h1>
      <p>En esta sección mostraremos clientes y socios y su desempeño.</p>
    </div>
  );
}

