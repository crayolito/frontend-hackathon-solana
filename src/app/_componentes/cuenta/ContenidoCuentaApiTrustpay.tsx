"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ErrorApiTrustpay,
  actualizarUsuarioYo,
  cambiarContrasenaTrustpay,
  eliminarCuentaUsuarioYo,
  obtenerUsuarioYo,
  verificarContrasenaTrustpay,
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

// Formularios de perfil, contraseña y baja de cuenta contra el API TrustPay (admin o merchant).
export default function ContenidoCuentaApiTrustpay() {
  const router = useRouter();
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [mensajePerfil, setMensajePerfil] = useState<string | null>(null);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [mensajeContrasena, setMensajeContrasena] = useState<string | null>(null);
  const [guardandoContrasena, setGuardandoContrasena] = useState(false);

  const [contrasenaVerificar, setContrasenaVerificar] = useState("");
  const [mensajeVerificar, setMensajeVerificar] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);

  const [contrasenaBaja, setContrasenaBaja] = useState("");
  const [mensajeBaja, setMensajeBaja] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [logoMarcaUrl, setLogoMarcaUrl] = useState("");
  const [mensajeVerificacionCuenta, setMensajeVerificacionCuenta] = useState<string | null>(null);

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

  const enviarVerificacion = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) return;
    setMensajeVerificar(null);
    setVerificando(true);
    try {
      await verificarContrasenaTrustpay(token, contrasenaVerificar);
      setMensajeVerificar("Contraseña correcta.");
    } catch (error) {
      setMensajeVerificar(
        error instanceof ErrorApiTrustpay
          ? error.message
          : "No se pudo verificar."
      );
    } finally {
      setVerificando(false);
    }
  }, [contrasenaVerificar]);

  const enviarBaja = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) return;
    setMensajeBaja(null);
    setEliminando(true);
    try {
      await eliminarCuentaUsuarioYo(token, contrasenaBaja);
      cerrarSesion();
      router.replace("/");
    } catch (error) {
      setMensajeBaja(
        error instanceof ErrorApiTrustpay
          ? error.message
          : "No se pudo eliminar la cuenta."
      );
    } finally {
      setEliminando(false);
    }
  }, [contrasenaBaja, router]);

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

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Marca y wallet de la cuenta</h2>
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
                Es la dirección que registraste y la que usamos al crear negocios si Phantom no está conectada.
              </p>
              <span className={estilos.etiqueta}>Dirección en cuenta</span>
              <p
                style={{
                  margin: "6px 0 14px",
                  fontFamily: "var(--fuente-geist-mono, ui-monospace, monospace)",
                  fontSize: "0.82rem",
                  wordBreak: "break-all",
                  fontWeight: 600,
                }}
              >
                {usuario.walletAddress ?? "— Sin wallet guardada —"}
              </p>
              <span className={estilos.etiqueta}>Phantom (devnet)</span>
              <div style={{ marginTop: 8 }}>
                <BotonConexionWallet />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Estado de verificación</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <p className={estilos.subtituloTarjeta} style={{ marginTop: 0 }}>
            Este estado lo define el backend. Usá el botón para confirmar en pantalla.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {usuario.isVerified === true ? (
              <span className={estilos.badgeVerde}>Verificado</span>
            ) : (
              <span className={estilos.badgeGris}>No verificado</span>
            )}
            <button
              type="button"
              className={estilos.botonSecundario}
              onClick={() => {
                setMensajeVerificacionCuenta(
                  usuario.isVerified === true
                    ? "Confirmado: tu cuenta ya está verificada."
                    : "No aparece verificada todavía. Revisá el flujo de verificación y volvé a consultar."
                );
              }}
            >
              {usuario.isVerified === true ? "Confirmar verificado" : "Confirmar estado"}
            </button>
          </div>
          {mensajeVerificacionCuenta ? (
            <p style={{ marginTop: 14, fontSize: "0.9rem" }}>{mensajeVerificacionCuenta}</p>
          ) : null}
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
          {mensajeContrasena ? (
            <p style={{ marginTop: 14, fontSize: "0.9rem" }}>{mensajeContrasena}</p>
          ) : null}
        </div>
        <div className={estilos.pieTarjeta}>
          <button
            type="button"
            className={estilos.botonPrimario}
            disabled={guardandoContrasena}
            onClick={() => void enviarCambioContrasena()}
          >
            {guardandoContrasena ? "Enviando…" : "Actualizar contraseña"}
          </button>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Verificar contraseña</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <label className={estilos.etiqueta} htmlFor="pwd-verificar">
            Contraseña
          </label>
          <input
            id="pwd-verificar"
            type="password"
            className={estilos.input}
            autoComplete="current-password"
            value={contrasenaVerificar}
            onChange={(e) => setContrasenaVerificar(e.target.value)}
          />
          {mensajeVerificar ? (
            <p style={{ marginTop: 14, fontSize: "0.9rem" }}>{mensajeVerificar}</p>
          ) : null}
        </div>
        <div className={estilos.pieTarjeta}>
          <button
            type="button"
            className={estilos.botonSecundario}
            disabled={verificando}
            onClick={() => void enviarVerificacion()}
          >
            {verificando ? "Comprobando…" : "Verificar"}
          </button>
        </div>
      </section>

      <section className={estilos.tarjeta}>
        <div className={estilos.cabeceraTarjeta}>
          <h2 className={estilos.tituloTarjeta}>Eliminar cuenta</h2>
        </div>
        <div className={estilos.cuerpoTarjeta}>
          <p className={estilos.subtituloTarjeta}>
            Esta acción es permanente. Confirma con tu contraseña.
          </p>
          <label className={estilos.etiqueta} htmlFor="pwd-baja">
            Contraseña
          </label>
          <input
            id="pwd-baja"
            type="password"
            className={estilos.input}
            autoComplete="current-password"
            value={contrasenaBaja}
            onChange={(e) => setContrasenaBaja(e.target.value)}
          />
          {mensajeBaja ? (
            <p style={{ marginTop: 14, fontSize: "0.9rem", color: "#b91c1c" }}>
              {mensajeBaja}
            </p>
          ) : null}
        </div>
        <div className={estilos.pieTarjeta}>
          <button
            type="button"
            className={estilos.botonPeligro}
            disabled={eliminando}
            onClick={() => void enviarBaja()}
          >
            {eliminando ? "Eliminando…" : "Eliminar mi cuenta"}
          </button>
        </div>
      </section>
    </div>
  );
}
