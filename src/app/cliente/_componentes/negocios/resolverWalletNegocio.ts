// Elige la dirección que enviaremos al registrar un negocio: Phantom conectada primero, si no la de la sesión.

export type ResultadoWalletNegocio =
  | { ok: true; direccion: string; origen: "phantom" | "sesion" }
  | { ok: false; mensaje: string };

export function resolverDireccionWalletNegocio(
  publicKeyBase58: string | null | undefined,
  walletSesion: string | null | undefined
): ResultadoWalletNegocio {
  const dePhantom = publicKeyBase58?.trim();
  if (dePhantom) {
    return { ok: true, direccion: dePhantom, origen: "phantom" };
  }
  const deSesion = walletSesion?.trim();
  if (deSesion) {
    return { ok: true, direccion: deSesion, origen: "sesion" };
  }
  return {
    ok: false,
    mensaje:
      "Conectá Phantom (devnet) o usá una cuenta que tenga wallet guardada al registrarte.",
  };
}

export function walletsDistintas(
  publicKeyBase58: string | null | undefined,
  walletSesion: string | null | undefined
): boolean {
  const a = publicKeyBase58?.trim();
  const b = walletSesion?.trim();
  if (!a || !b) return false;
  return a !== b;
}
