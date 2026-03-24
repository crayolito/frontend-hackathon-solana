import { redirect } from "next/navigation";

/** Documentación unificada en `/api-docs` (vista dedicada estilo api-docs). */
export default function PaginaDocumentacionPublicaRedirige() {
  redirect("/api-docs");
}
