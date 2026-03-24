"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ErrorApiTrustpay,
  actualizarUsuarioYo,
  cambiarContrasenaTrustpay,
  obtenerUsuarioYo,
} from "../../_lib/apiTrustpay";
import {
  actualizarUsuarioEnSesion,
  cerrarSesion,
  obtenerTokenSesion,
  type UsuarioSesion,
} from "../../demoAuth";
import BotonConexionWallet from "../../solana/BotonConexionWallet";
import estilos from "../../cliente/_componentes/desarrollador.module.css";
import ZonaSubidaLogoCloudinary from "./ZonaSubidaLogoCloudinary";
import SeccionCredencialesApiPublica from "./SeccionCredencialesApiPublica";

const CLAVE_LOGO_CUENTA = "trustpay_logo_cuenta_marca";

function normalizarCadenaNoVacia(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const v = valor.trim();
  return v.length > 0 ? v : null;
}

function extraerWalletAddressDesdeApi(datos: Record<string, unknown>): string | null {
  return (
    normalizarCadenaNoVacia(datos.walletAddress) ??
    normalizarCadenaNoVacia(datos.wallet_address) ??
    null
  );
}

function extraerLogoMarcaDesdeApi(datos: Record<string, unknown>): string | null {
  return (
    normalizarCadenaNoVacia(datos.logoUrl) ??
    normalizarCadenaNoVacia(datos.logo_url) ??
    normalizarCadenaNoVacia(datos.brandLogoUrl) ??
    normalizarCadenaNoVacia(datos.brand_logo_url) ??
    null
  );
}

// Formularios de perfil (y opcionalmente contraseña / baja) contra el API TrustPay.
// Solo se muestra la tarjeta «Perfil»; el resto queda comentado a pedido de producto.
export default function ContenidoCuentaApiTrustpay() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [mensajePerfil, setMensajePerfil] = useState<string | null>(null);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [mensajeContrasena, setMensajeContrasena] = useState<string | null>(null);
  const [guardandoContrasena, setGuardandoContrasena] = useState(false);

  const [logoMarcaUrl, setLogoMarcaUrl] = useState("");

  const sincronizarUsuario = useCallback((u: UsuarioSesion) => {
    setUsuario(u);
    setNombreCompleto(u.fullName);
    actualizarUsuarioEnSesion(u);
  }, []);

  useEffect(() => {
    const token = obtenerTokenSesion();
    if (!token) {
      setCargandoPerfil(false);
      return;
    }

    let cancelado = false;
    void (async () => {
      try {
        const datos = await obtenerUsuarioYo(token);
        if (cancelado) return;
        const d = datos as unknown as Record<string, unknown>;
        const walletAddress = extraerWalletAddressDesdeApi(d);
        const isVerified = typeof d.isVerified === "boolean" ? d.isVerified : undefined;
        const isActive = typeof d.isActive === "boolean" ? d.isActive : undefined;
        const u: UsuarioSesion = {
          id: datos.id,
          fullName: datos.fullName,
          email: datos.email,
          role: datos.role,
          country: datos.country,
          walletAddress,
          isVerified,
          isActive,
        };
        sincronizarUsuario(u);
        try {
          const logoApi = extraerLogoMarcaDesdeApi(d);
          if (logoApi) {
            setLogoMarcaUrl(logoApi);
          } else {
            const logoGuardado = localStorage.getItem(CLAVE_LOGO_CUENTA);
            if (logoGuardado) setLogoMarcaUrl(logoGuardado);
          }
        } catch {
          /* ignore */
        }
      } catch (error) {
        if (cancelado) return;
        if (error instanceof ErrorApiTrustpay && error.codigoEstado === 401) {
          cerrarSesion();
          router.replace("/");
          return;
        }
        setMensajePerfil(
          error instanceof ErrorApiTrustpay
            ? error.message
            : "No se pudo cargar el perfil."
        );
      } finally {
        if (!cancelado) setCargandoPerfil(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [router, sincronizarUsuario]);

  const persistirLogoMarca = useCallback((url: string) => {
    setLogoMarcaUrl(url);
    try {
      if (url) localStorage.setItem(CLAVE_LOGO_CUENTA, url);
      else localStorage.removeItem(CLAVE_LOGO_CUENTA);
    } catch {
      /* ignore */
    }
  }, []);

  const acortarDireccion = useCallback((base58: string) => {
    if (base58.length <= 12) return base58;
    return `${base58.slice(0, 4)}…${base58.slice(-4)}`;
  }, []);

  const guardarPerfil = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token || !nombreCompleto.trim()) return;
    setMensajePerfil(null);
    setGuardandoPerfil(true);
    try {
      const actualizado = await actualizarUsuarioYo(token, {
        fullName: nombreCompleto.trim(),
      });
      sincronizarUsuario({
        id: actualizado.id,
        fullName: actualizado.fullName,
        email: actualizado.email,
        role: actualizado.role,
        country: actualizado.country,
        walletAddress: actualizado.walletAddress,
        isVerified: actualizado.isVerified,
        isActive: actualizado.isActive,
      });
      setMensajePerfil("Perfil actualizado.");
    } catch (error) {
      setMensajePerfil(
        error instanceof ErrorApiTrustpay
          ? error.message
          : "No se pudo guardar."
      );
    } finally {
      setGuardandoPerfil(false);
    }
  }, [nombreCompleto, sincronizarUsuario]);

  /*
  const enviarCambioContrasena = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) return;
    setMensajeContrasena(null);
    setGuardandoContrasena(true);
    try {
      await cambiarContrasenaTrustpay(token, contrasenaActual, contrasenaNueva);
      setContrasenaActual("");
      setContrasenaNueva("");
      setMensajeContrasena("Contraseña actualizada.");
    } catch (error) {
      setMensajeContrasena(
        error instanceof ErrorApiTrustpay
          ? error.message
          : "No se pudo cambiar la contraseña."
      );
    } finally {
      setGuardandoContrasena(false);
    }
  }, [contrasenaActual, contrasenaNueva]);
  */

  if (cargandoPerfil) {
    return (
      <p className={estilos.subtituloTarjeta} style={{ padding: "12px 0" }}>
        Cargando tu cuenta…
      </p>
    );
  }

  if (!usuario) {
    return (
      <p className={estilos.subtituloTarjeta}>
        {mensajePerfil ?? "No hay sesión activa."}
      </p>
    );
  }

  return (
    <div className={estilos.contenedor}>
      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Perfil</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <div className={estilos.grid2}>
            <div>
              <span className={estilos.etiqueta}>Correo</span>
              <p style={{ margin: 0, fontWeight: 700 }}>{usuario.email}</p>
            </div>
            <div>
              <span className={estilos.etiqueta}>Rol</span>
              <p style={{ margin: 0, fontWeight: 700 }}>{usuario.role}</p>
            </div>
            <div>
              <span className={estilos.etiqueta}>País</span>
              <p style={{ margin: 0, fontWeight: 700 }}>{usuario.country}</p>
            </div>
            <div>
              <label className={estilos.etiqueta} htmlFor="perfil-nombre">
                Nombre completo
              </label>
              <input
                id="perfil-nombre"
                className={estilos.input}
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
              />
            </div>
          </div>
          {mensajePerfil ? (
            <p style={{ marginTop: 14, fontSize: "0.9rem" }}>{mensajePerfil}</p>
          ) : null}
        </div>
        <div className={estilos.pieTarjeta}>
          <button
            type="button"
            className={estilos.botonPrimario}
            disabled={guardandoPerfil}
            onClick={() => void guardarPerfil()}
          >
            {guardandoPerfil ? "Guardando…" : "Guardar perfil"}
          </button>
        </div>
      </section>

      <SeccionCredencialesApiPublica />

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>
            <span className={estilos.walletTituloEmoji} aria-hidden>
              💎
            </span>
            Tu wallet
          </h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          {usuario.walletAddress ? (
            <div className={estilos.walletCajaDestacada}>
              <div className={estilos.walletCajaCabecera}>
                <span className={estilos.walletEmojiGrande} aria-hidden>
                  ✨
                </span>
                <span className={estilos.walletEtiquetaCaja}>Dirección en tu cuenta</span>
              </div>
              <p className={estilos.walletDireccionCompleta} title={usuario.walletAddress}>
                🔗 {usuario.walletAddress}
              </p>
              <button
                type="button"
                className={`${estilos.botonSecundario} ${estilos.walletBotonCopiar}`}
                onClick={async () => {
                  await navigator.clipboard.writeText(usuario.walletAddress as string);
                }}
              >
                📋 Copiar dirección
              </button>
            </div>
          ) : (
            <p className={estilos.walletSinDato}>
              <span aria-hidden>🔍 </span>
              Todavía no tenés una wallet guardada en el registro. Conectá Phantom abajo o
              completá el alta con tu dirección.
            </p>
          )}

          <div className={estilos.walletPhantomBloque}>
            <span className={estilos.etiqueta}>Phantom (devnet)</span>
            <div style={{ marginTop: 8 }}>
              <BotonConexionWallet compacto />
            </div>
            {connected && publicKey ? (
              <p className={estilos.walletPhantomActiva}>
                <span aria-hidden>🦄</span>
                <span>Conectada:</span>
                <span title={publicKey.toBase58()}>{acortarDireccion(publicKey.toBase58())}</span>
              </p>
            ) : (
              <p className={estilos.subtituloTarjeta} style={{ marginTop: 10, marginBottom: 0 }}>
                Conectá Phantom para firmar y crear negocios con esa dirección.
              </p>
            )}
          </div>
        </div>
      </section>

      {/*
      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Marca y wallets</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <div className={estilos.grid2}>
            <div>
              <p className={estilos.subtituloTarjeta} style={{ marginTop: 0 }}>
                Subí el logo con Cloudinary; se guarda en este navegador hasta que el API permita adjuntarlo al perfil.
              </p>
              <ZonaSubidaLogoCloudinary
                etiqueta="Logo"
                url={logoMarcaUrl}
                alCambiarUrl={persistirLogoMarca}
                claseBotonSecundario={estilos.botonSecundario}
              />
            </div>

            <div>
              <p className={estilos.subtituloTarjeta} style={{ marginTop: 0 }}>
                Acá ves tu wallet guardada y, si conectás Phantom, también la wallet "activa" para nuevos negocios.
              </p>
              <div style={{ marginBottom: 14 }}>
                <span className={estilos.etiqueta}>Wallet guardada</span>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontFamily: "var(--fuente-geist-mono, ui-monospace, monospace)",
                    fontSize: "0.82rem",
                    wordBreak: "break-all",
                    fontWeight: 600,
                  }}
                >
                  {usuario.walletAddress ?? "— Sin wallet guardada —"}
                </p>

                {usuario.walletAddress ? (
                  <div style={{ marginTop: 10 }}>
                    <button
                      type="button"
                      className={estilos.botonSecundario}
                      onClick={async () => {
                        await navigator.clipboard.writeText(usuario.walletAddress as string);
                      }}
                    >
                      Copiar wallet
                    </button>
                  </div>
                ) : null}
              </div>

              <div style={{ marginTop: 2 }}>
                <span className={estilos.etiqueta}>Phantom (devnet)</span>
                <div style={{ marginTop: 8 }}>
                  <BotonConexionWallet />
                </div>

                <p className={estilos.subtituloTarjeta} style={{ marginTop: 10 }}>
                  Si Phantom está conectada, los negocios nuevos usan esa wallet aunque la wallet guardada sea otra.
                </p>

                {connected && publicKey ? (
                  <p
                    style={{
                      margin: "0",
                      fontFamily: "var(--fuente-geist-mono, ui-monospace, monospace)",
                      fontSize: "0.82rem",
                      wordBreak: "break-all",
                      fontWeight: 700,
                    }}
                  >
                    Wallet Phantom activa: {acortarDireccion(publicKey.toBase58())}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Cambiar contraseña</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <div className={estilos.grid2}>
            <div>
              <label className={estilos.etiqueta} htmlFor="pwd-actual">
                Contraseña actual
              </label>
              <input
                id="pwd-actual"
                type="password"
                className={estilos.input}
                autoComplete="current-password"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
              />
            </div>
            <div>
              <label className={estilos.etiqueta} htmlFor="pwd-nueva">
                Contraseña nueva
              </label>
              <input
                id="pwd-nueva"
                type="password"
                className={estilos.input}
                autoComplete="new-password"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
              />
            </div>
          </div>
          <p className={estilos.subtituloTarjeta} style={{ marginTop: 14 }}>
            Se valida en el backend. Si falla, te mostramos el motivo.
          </p>
          {mensajeContrasena ? (
            <p style={{ marginTop: 14, fontSize: "0.9rem" }}>{mensajeContrasena}</p>
          ) : null}
        </div>
        <div className={estilos.pieTarjeta}>
          <button
            type="button"
            className={estilos.botonPrimario}
            disabled={guardandoContrasena || !contrasenaActual.trim() || !contrasenaNueva.trim()}
            onClick={() => void enviarCambioContrasena()}
          >
            {guardandoContrasena ? "Enviando…" : "Actualizar contraseña"}
          </button>
        </div>
      </section>
      */}
    </div>
  );
}