import estilos from "../estilos-cliente.module.css";

// Titulo de seccion del area cliente: sin exportar ni acciones extra (solo lectura / demo).
type Props = {
  titulo: string;
  subtitulo?: string;
};

export default function CabeceraAreaCliente({ titulo, subtitulo }: Props) {
  return (
    <div className={estilos.cabecera}>
      <h1>{titulo}</h1>
      {subtitulo ? <p>{subtitulo}</p> : null}
    </div>
  );
}
