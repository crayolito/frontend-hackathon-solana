"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import DetalleClienteVista from "../../_componentes/clientes/DetalleClienteVista";
import { obtenerClientePorId } from "../../_datos/datosCuentasAdminDemo";

// Detalle de un cliente: ficha + transacciones demo enlazadas por id.
export default function PaginaDetalleCliente() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const cliente = obtenerClientePorId(id);

  if (!cliente) {
    return (
      <div>
        <p style={{ marginBottom: 16, fontWeight: 700 }}>No encontramos este cliente.</p>
        <Link href="/admin/customers" style={{ fontWeight: 800, color: "#6c63ff" }}>
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return <DetalleClienteVista cliente={cliente} />;
}
