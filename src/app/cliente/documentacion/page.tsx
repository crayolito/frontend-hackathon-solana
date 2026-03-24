import { redirect } from "next/navigation";

/** La documentación técnica vive en la vista dedicada `/api-docs` (mismo estilo que api-docs públicos tipo Vemper). */
export default function PaginaDocumentacionClienteRedirige() {
  redirect("/api-docs");
}
