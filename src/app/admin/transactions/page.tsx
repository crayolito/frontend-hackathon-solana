import estilosAdmin from "../estilos-administracion.module.css";

// Vista placeholder para Transacciones.
export default function PaginaTransactions() {
  return (
    <div className={estilosAdmin.cabecera}>
      <h1>Transacciones</h1>
      <p>Aquí listaremos transacciones y estados (los datos se conectarán después).</p>
    </div>
  );
}

