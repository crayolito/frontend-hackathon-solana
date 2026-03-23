import { redirect } from "next/navigation";

// Los cobros por API/pagos no están en el alcance actual; la cuenta unifica la configuración.
export default function PaginaPagosCliente() {
  redirect("/cliente/settings");
}
