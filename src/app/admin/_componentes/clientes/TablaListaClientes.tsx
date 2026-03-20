import Link from "next/link";

import type { ClienteDemo } from "../../_datos/datosCuentasAdminDemo";
import { recortarCartera } from "../../_datos/datosCuentasAdminDemo";
import estilos from "./lista-clientes.module.css";

type Props = {
  clientes: ClienteDemo[];
};

function claseEstado(estado: ClienteDemo["estado"]) {
  switch (estado) {
    case "activo":
      return estilos.estadoActivo;
    case "pendiente":
      return estilos.estadoPendiente;
    case "suspendido":
      return estilos.estadoSuspendido;
    default:
      return estilos.estadoPendiente;
  }
}

function etiquetaEstado(estado: ClienteDemo["estado"]) {
  const mapa: Record<ClienteDemo["estado"], string> = {
    activo: "Activo",
    pendiente: "Pendiente",
    suspendido: "Suspendido",
  };
  return mapa[estado];
}

// Tabla principal de clientes con enlace al detalle (demo).
export default function TablaListaClientes({ clientes }: Props) {
  return (
    <div className={estilos.tarjetaTabla}>
      {clientes.length === 0 ? (
        <p className={estilos.vacio}>No hay resultados para esta búsqueda.</p>
      ) : (
        <div className={estilos.envoltorioTabla}>
          <table className={estilos.tabla}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Cartera</th>
                <th>Volumen (SOL / USDC)</th>
                <th>Tx</th>
                <th>Estado</th>
                <th>Última actividad</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className={estilos.celdaPrincipal}>{c.alias}</div>
                    <div className={estilos.celdaSecundaria}>{c.id}</div>
                  </td>
                  <td className={estilos.celdaSecundaria}>{c.correo}</td>
                  <td className={estilos.mono}>{recortarCartera(c.cartera)}</td>
                  <td className={estilos.celdaSecundaria}>
                    {c.volumenSolEtiqueta}
                    <br />
                    {c.volumenUsdcEtiqueta}
                  </td>
                  <td>{c.transaccionesTotal}</td>
                  <td>
                    <span className={`${estilos.pillEstado} ${claseEstado(c.estado)}`}>
                      {etiquetaEstado(c.estado)}
                    </span>
                  </td>
                  <td className={estilos.celdaSecundaria}>{c.ultimaActividad}</td>
                  <td>
                    <Link className={estilos.enlaceDetalle} href={`/admin/customers/${c.id}`}>
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
