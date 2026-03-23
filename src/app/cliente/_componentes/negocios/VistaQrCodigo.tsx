"use client";

import QRCode from "react-qr-code";

import { resolverVistaQr } from "../../../_lib/resolverVistaQr";
import estilos from "./negocios.module.css";

type Props = {
  respuesta: unknown;
  etiqueta: string;
};

// Pinta imagen remota, data URL o un QR generado desde texto según lo que devolvió el API.
export default function VistaQrCodigo({ respuesta, etiqueta }: Props) {
  const v = resolverVistaQr(respuesta, etiqueta);

  if (v.tipo === "imagen") {
    return (
      <div className={estilos.wrapQr}>
        <img src={v.src} alt={v.alt} width={160} height={160} style={{ objectFit: "contain" }} />
      </div>
    );
  }

  if (v.tipo === "texto") {
    return (
      <div className={estilos.wrapQr}>
        <QRCode value={v.valor} size={160} level="M" bgColor="#ffffff" fgColor="#0f172a" />
      </div>
    );
  }

  return <p className={estilos.alertaError}>{v.detalle}</p>;
}
