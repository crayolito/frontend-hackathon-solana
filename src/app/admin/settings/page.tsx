import estilosAdmin from "../estilos-administracion.module.css";

// Vista placeholder para Configuración.
export default function PaginaSettings() {
  return (
    <div className={estilosAdmin.cabecera}>
      <h1>Configuración</h1>
      <p>Aquí configuraremos preferencias y opciones del panel.</p>
    </div>
  );
}

