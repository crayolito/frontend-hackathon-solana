import { redirect } from "next/navigation";

// La documentación vive en la ruta pública `/documentacion` (CTA desde el home).
export default function PaginaDocumentacionClienteRedirige() {
  redirect("/documentacion");
}
