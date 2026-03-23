"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ErrorApiTrustpay,
  actualizarUsuarioAdmin,
  alternarActivoUsuarioAdmin,
  obtenerUsuarioAdminPorId,
  type RolTrustpayApi,
  type UsuarioTrustpayRespuesta,
} from "../../../_lib/apiTrustpay";
import { cerrarSesion, obtenerTokenSesion } from "../../../demoAuth";
import estilos from "./detalle-cliente.module.css";

type Props = {
  idUsuario: string;
  modoModal?: boolean;
  alActualizarLista?: () => void;
  mostrarConfiguracion?: boolean;
};

function claseActivo(activo: boolean | undefined) {
  if (activo === false) return estilos.estadoSuspendido;
  return estilos.estadoActivo;
}

function etiquetaActivo(activo: boolean | undefined) {
  if (activo === false) return "Inactivo";
  return "Activo";
}

// Ficha de usuario con GET /admin/users/:id, PATCH de rol/activo y POST toggle-active.
export default function VistaDetalleUsuarioAdmin({
  idUsuario,
  modoModal = false,
  alActualizarLista,
  mostrarConfiguracion = false,
}: Props) {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioTrustpayRespuesta | null>(null);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [rolEdit, setRolEdit] = useState<RolTrustpayApi>("merchant");
  const [activoEdit, setActivoEdit] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [alternando, setAlternando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const aplicarUsuario = useCallback((u: UsuarioTrustpayRespuesta) => {
    setUsuario(u);
    setRolEdit(u.role);
    setActivoEdit(u.isActive !== false);
  }, []);

  const recargar = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token || !idUsuario) return;
    setCargando(true);
    setErrorCarga(null);
    try {
      const u = await obtenerUsuarioAdminPorId(token, idUsuario);
      aplicarUsuario(u);
    } catch (e) {
      if (e instanceof ErrorApiTrustpay && e.codigoEstado === 401) {
        cerrarSesion();
        router.replace("/");
        return;
      }
      setErrorCarga(e instanceof ErrorApiTrustpay ? e.message : "No se pudo cargar el usuario.");
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, [aplicarUsuario, idUsuario, router]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const copiarCartera = useCallback(() => {
    if (usuario?.walletAddress) void navigator.clipboard.writeText(usuario.walletAddress);
  }, [usuario?.walletAddress]);

  const guardarCambios = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token || !idUsuario) return;
    setMensaje(null);
    setGuardando(true);
    try {
      const actualizado = await actualizarUsuarioAdmin(token, idUsuario, {
        role: rolEdit,
        isActive: activoEdit,
      });
      aplicarUsuario(actualizado);
      setMensaje("Cambios guardados.");
      alActualizarLista?.();
    } catch (e) {
      if (e instanceof ErrorApiTrustpay && e.codigoEstado === 401) {
        cerrarSesion();
        router.replace("/");
        return;
      }
      setMensaje(e instanceof ErrorApiTrustpay ? e.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }, [activoEdit, aplicarUsuario, idUsuario, rolEdit, router, alActualizarLista]);

  const ejecutarToggle = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token || !idUsuario) return;
    setMensaje(null);
    setAlternando(true);
    try {
      const respuesta = await alternarActivoUsuarioAdmin(token, idUsuario);
      if (respuesta && typeof respuesta === "object" && "id" in respuesta) {
        aplicarUsuario(respuesta);
      } else {
        await recargar();
      }
      setMensaje("Estado alternado en el servidor.");
      alActualizarLista?.();
    } catch (e) {
      if (e instanceof ErrorApiTrustpay && e.codigoEstado === 401) {
        cerrarSesion();
        router.replace("/");
        return;
      }
      setMensaje(e instanceof ErrorApiTrustpay ? e.message : "No se pudo alternar el estado.");
    } finally {
      setAlternando(false);
    }
  }, [aplicarUsuario, idUsuario, recargar, router, alActualizarLista]);

  if (cargando && !usuario) {
    return (
      <div>
        <p style={{ fontWeight: 700 }}>Cargando usuario…</p>
        {!modoModal ? (
          <Link
            href="/admin/customers"
            className={estilos.enlaceVolver}
            style={{ marginTop: 12, display: "inline-block" }}
          >
            ← Volver al listado
          </Link>
        ) : null}
      </div>
    );
  }

  if (errorCarga || !usuario) {
    return (
      <div>
        <p style={{ marginBottom: 16, fontWeight: 700 }}>
          {errorCarga ?? "No encontramos este usuario."}
        </p>
        {!modoModal ? (
          <Link href="/admin/customers" className={estilos.enlaceVolver}>
            ← Volver al listado
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {!modoModal ? (
        <div className={estilos.barraVolver}>
          <Link className={estilos.enlaceVolver} href="/admin/customers">
            ← Volver a clientes
          </Link>
        </div>
      ) : null}

      <section className={estilos.tarjetaFicha} aria-labelledby="titulo-usuario">
        <h1 id="titulo-usuario" className={estilos.tituloFicha}>
          {usuario.fullName}
        </h1>
        <p className={estilos.metaFicha}>
          <span className={`${estilos.pillEstado} ${claseActivo(usuario.isActive)}`}>
            {etiquetaActivo(usuario.isActive)}
          </span>
          {" · "}
          Rol actual: <strong>{usuario.role}</strong>
        </p>

        <div className={estilos.gridDatos}>
          <div>
            <p className={estilos.etiquetaCampo}>Correo</p>
            <p className={estilos.valorCampo}>{usuario.email}</p>
          </div>
          <div>
            <p className={estilos.etiquetaCampo}>ID</p>
            <p className={estilos.valorCampo}>{usuario.id}</p>
          </div>
          <div>
            <p className={estilos.etiquetaCampo}>País</p>
            <p className={estilos.valorCampo}>{usuario.country}</p>
          </div>
          <div className={estilos.campoAncho}>
            <p className={estilos.etiquetaCampo}>Cartera Solana</p>
            {usuario.walletAddress ? (
              <div className={estilos.filaCartera}>
                <span className={estilos.carteraCompleta}>{usuario.walletAddress}</span>
                <button type="button" className={estilos.botonCopiar} onClick={copiarCartera}>
                  Copiar
                </button>
              </div>
            ) : (
              <p className={estilos.valorCampo}>Sin vincular</p>
            )}
          </div>
        </div>

        {mostrarConfiguracion ? (
          <div className={estilos.formularioAdmin}>
            <p className={estilos.etiquetaCampo}>Gestionar cuenta (admin)</p>
            <div className={estilos.filaForm}>
              <label className={estilos.etiquetaSelect} htmlFor="rol-usuario">
                Rol
                <select
                  id="rol-usuario"
                  className={estilos.selectRol}
                  value={rolEdit}
                  onChange={(e) => setRolEdit(e.target.value as RolTrustpayApi)}
                >
                  <option value="merchant">merchant</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              <label className={estilos.checkActivo}>
                <input type="checkbox" checked={activoEdit} onChange={(e) => setActivoEdit(e.target.checked)} />
                Cuenta activa
              </label>
            </div>
            <div className={estilos.filaBotonesAccion}>
              <button
                type="button"
                className={estilos.botonGuardar}
                disabled={guardando}
                onClick={() => void guardarCambios()}
              >
                {guardando ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                className={estilos.botonAlternar}
                disabled={alternando}
                onClick={() => void ejecutarToggle()}
              >
                {alternando ? "Procesando…" : "Alternar estado"}
              </button>
            </div>
            {mensaje ? (
              <p
                className={`${estilos.mensajeForm} ${
                  mensaje.startsWith("No ") || mensaje.includes("Error") ? estilos.mensajeError : ""
                }`}
              >
                {mensaje}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  );
}
