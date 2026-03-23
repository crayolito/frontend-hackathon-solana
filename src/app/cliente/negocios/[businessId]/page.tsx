import DetalleNegocioCliente from "../../_componentes/negocios/DetalleNegocioCliente";

type Props = {
  params: Promise<{ businessId: string }>;
};

export default async function PaginaDetalleNegocioCliente({ params }: Props) {
  const { businessId } = await params;
  return <DetalleNegocioCliente idNegocio={businessId} />;
}
