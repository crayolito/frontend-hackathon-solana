import Image from "next/image";
import estilos from "../estilos-cliente.module.css";

// Titulo de seccion del area cliente: sin exportar ni acciones extra (solo lectura / demo).
type Props = {
  titulo: string;
  subtitulo?: string;
};

export default function CabeceraAreaCliente({ titulo, subtitulo }: Props) {
  return (
    <div className={estilos.cabecera}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image
          src="/imagenes/logo1-solana.png"
          alt="Solana"
          width={30}
          height={30}
          priority
        />
        <span style={{ fontWeight: 900, color: "var(--texto-primario, #171717)" }}>TrustPay</span>
      </div>
      <h1>{titulo}</h1>
      {subtitulo ? <p>{subtitulo}</p> : null}
    </div>
  );
}
