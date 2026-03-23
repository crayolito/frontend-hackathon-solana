import { redirect } from "next/navigation";

// La sección de webhooks se reemplazó por transacciones demo; mantenemos la URL por enlaces viejos.
export default function PaginaWebhooksClienteRedirige() {
  redirect("/cliente/transacciones");
}
