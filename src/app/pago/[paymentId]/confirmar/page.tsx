import type { Metadata } from "next";
import ContenidoConfirmarRecepcion from "./ContenidoConfirmarRecepcion";

type Props = {
  params: Promise<{ paymentId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: "Confirmar recepción del pago · TrustPay",
    description: "Conectá Phantom y liberá el escrow al vendedor.",
  };
}

export default async function PaginaConfirmarRecepcion({ params }: Props) {
  const { paymentId } = await params;
  return <ContenidoConfirmarRecepcion paymentId={paymentId} />;
}
