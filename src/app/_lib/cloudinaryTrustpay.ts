// Subida de imágenes del comercio vía preset firmado de Cloudinary (sin API secret en el cliente).

export const CLOUDINARY_CLOUD_NAME = "dcvidtqlq";
export const CLOUDINARY_UPLOAD_PRESET = "sixx_store";
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

type RespuestaCloudinary = {
  secure_url?: string;
  error?: { message?: string };
};

// Envía el archivo al preset público y devuelve la URL https lista para guardar en el negocio o perfil.
export async function subirImagenCloudinary(archivo: File): Promise<string> {
  const cuerpo = new FormData();
  cuerpo.append("file", archivo);
  cuerpo.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const respuesta = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: cuerpo,
  });

  let datos: RespuestaCloudinary = {};
  try {
    datos = (await respuesta.json()) as RespuestaCloudinary;
  } catch {
    throw new Error("Respuesta inválida del servidor de imágenes.");
  }

  if (!respuesta.ok) {
    const detalle =
      datos.error?.message ??
      (typeof datos === "object" && datos !== null && "message" in datos
        ? String((datos as { message?: string }).message)
        : respuesta.statusText);
    throw new Error(detalle || "No se pudo subir la imagen.");
  }

  const url = datos.secure_url?.trim();
  if (!url) {
    throw new Error("Cloudinary no devolvió una URL de imagen.");
  }
  return url;
}
