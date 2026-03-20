import estilos from "./estilos-cliente.module.css";

// Pagina principal del area del cliente.
export default function PaginaCliente() {
  return (
    <>
      <div className={estilos.cabecera}>
        <h1>Panel del cliente</h1>
        <p>Aqui cambiaran las secciones cuando armes las sub-rutas.</p>
      </div>

      <section>
        <h2 style={{ margin: 0, color: "var(--texto-primario)" }}>
          Resumen rapido
        </h2>
        <p style={{ marginTop: 10, color: "var(--texto-secundario)" }}>
          Vista basica: aun no hay informacion conectada.
        </p>
      </section>
    </>
  );
}

