import { redirect } from "next/navigation";

// Las claves API se retiraron del menú comercio; la configuración vive en Cuenta.
export default function PaginaApiKeysCliente() {
  redirect("/cliente/settings");
}
