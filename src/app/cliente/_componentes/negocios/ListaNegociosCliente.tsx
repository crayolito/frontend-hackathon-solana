"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  crearNegocioTrustpay,
  ErrorApiTrustpay,
  listarNegociosTrustpay,
  type NegocioTrustpay,
} from "../../../_lib/apiTrustpay";
import ZonaSubidaLogoCloudinary from "../../../_componentes/cuenta/ZonaSubidaLogoCloudinary";
import { obtenerSesionTrustpay, obtenerTokenSesion } from "../../../demoAuth";
import CabeceraAreaCliente from "../CabeceraAreaCliente";
import { useNotificacion } from "../../../_componentes/ProveedorNotificaciones";
import estilosDev from "../desarrollador.module.css";
import estilos from "./negocios.module.css";
import { CATEGORIAS_NEGOCIO, etiquetaCategoriaNegocio } from "./categoriasNegocio";
import {
  MAX_NEGOCIOS_POR_COMERCIO,
  URL_IMAGEN_NEGOCIO_FALLBACK_LOCAL,
  urlVisualNegocio,
} from "./constantesNegocios";
import { resolverDireccionWalletNegocio } from "./resolverWalletNegocio";

function mensajeAmigableErrorApi(mensaje: string) {
  if (/simulation|blockchain|on-chain|program error|custom program/i.test(mensaje)) {
    return `La red Solana rechazó el registro (cuenta en uso u otro motivo on-chain). Detalle: ${mensaje}`;
  }
  return mensaje;
}

// Listado de negocios del comercio: tope por cuenta merchant; la wallet de cobro la resuelve el backend desde sesión o Phantom.
export default function ListaNegociosCliente() {
  const { mostrarNotificacion } = useNotificacion();
  const { publicKey } = useWallet();
  const [negocios, setNegocios] = useState<NegocioTrustpay[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [falloCargaLista, setFalloCargaLista] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("retail");
  const [descripcion, setDescripcion] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [creando, setCreando] = useState(false);

  const sesion = obtenerSesionTrustpay();
  const walletSesion = sesion?.user.walletAddress ?? null;
  const pk = publicKey?.toBase58() ?? null;

  const recargar = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) return;
    setCargando(true);
    try {
      const { negocios: lista, total: t } = await listarNegociosTrustpay(token, 1, 10);
      setNegocios(lista);
      setTotal(t);
      setFalloCargaLista(false);
    } catch (e) {
      const texto =
        e instanceof ErrorApiTrustpay ? e.message : "No se pudo cargar los negocios.";
      mostrarNotificacion(texto);
      setFalloCargaLista(true);
    } finally {
      setCargando(false);
    }
  }, [mostrarNotificacion]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const enviarCrear = async (ev: FormEvent) => {
    ev.preventDefault();
    if (creando) return;
    const token = obtenerTokenSesion();
    if (!token) {
      mostrarNotificacion("Sesión no válida.");
      return;
    }
    if (!nombre.trim()) {
      mostrarNotificacion("Indicá el nombre del negocio.");
      return;
    }

    const w = resolverDireccionWalletNegocio(pk, walletSesion);
    if (!w.ok) {
      mostrarNotificacion(w.mensaje);
      return;
    }

    if (total >= MAX_NEGOCIOS_POR_COMERCIO || negocios.length >= MAX_NEGOCIOS_POR_COMERCIO) {
      mostrarNotificacion(
        `Tu cuenta de comercio ya alcanzó el máximo de ${MAX_NEGOCIOS_POR_COMERCIO} negocios registrados.`,
      );
      return;
    }

    setCreando(true);
    try {
      await crearNegocioTrustpay(token, {
        name: nombre.trim(),
        description: descripcion.trim() ? descripcion.trim() : null,
        category: categoria,
        logoUrl: logoUrl.trim() ? logoUrl.trim() : null,
        walletAddress: w.direccion,
      });
      setModalAbierto(false);
      setNombre("");
      setDescripcion("");
      setLogoUrl("");
      setCategoria("retail");
      await recargar();
    } catch (e) {
      if (e instanceof ErrorApiTrustpay) {
        mostrarNotificacion(mensajeAmigableErrorApi(e.message), 16_000);
      } else {
        mostrarNotificacion("No se pudo crear el negocio.");
      }
    } finally {
      setCreando(false);
    }
  };

  const registradosMostrados =
    !cargando ? Math.max(total, negocios.length) : total;
  const topeAlcanzado =
    !cargando &&
    (total >= MAX_NEGOCIOS_POR_COMERCIO || negocios.length >= MAX_NEGOCIOS_POR_COMERCIO);

  return (
    <div className={estilos.contenedor}>
      <CabeceraAreaCliente
        titulo="Negocios"
        subtitulo={`Hasta ${MAX_NEGOCIOS_POR_COMERCIO} locales o marcas por cuenta, con QRs de cobro en Solana.`}
      />

      <section className={estilosDev.tarjeta}>
        <div className={estilosDev.cabeceraTarjeta}>
          <div>
            <h2 className={estilosDev.tituloTarjeta}>Tu catálogo</h2>
            <p className={estilosDev.subtituloTarjeta}>
              Mismo estilo que el resumen del panel: locales, QRs y detalle por negocio.
            </p>
          </div>
          <button
            type="button"
            className={estilosDev.botonPrimario}
            disabled={topeAlcanzado || cargando}
            onClick={() => setModalAbierto(true)}
          >
            {topeAlcanzado ? "Límite alcanzado" : "Registrar negocio"}
          </button>
        </div>
        <div className={estilosDev.cuerpoTarjeta}>
          <div className={estilos.accionesCabecera} style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, color: "var(--texto-secundario)", fontSize: "0.9rem" }}>
              {cargando ? "Cargando…" : `${registradosMostrados} de ${MAX_NEGOCIOS_POR_COMERCIO} negocios`}
            </p>
          </div>

          {cargando && negocios.length === 0 ? (
            <p style={{ color: "var(--texto-secundario)", marginTop: 0 }}>Cargando negocios…</p>
          ) : null}

          {!cargando && negocios.length === 0 && !falloCargaLista ? (
            <p style={{ color: "var(--texto-secundario)", marginTop: 0 }}>
              Todavía no tenés negocios. Registrá el primero para generar QRs.
            </p>
          ) : null}

          <div className={estilos.gridNegocios}>
            {negocios.map((n) => (
              <Link key={n.id} href={`/cliente/negocios/${n.id}`} className={estilos.tarjetaNegocio}>
                <div className={estilos.tarjetaNegocioImagen} aria-hidden="true">
                  <img
                    className={estilos.imagenCoverTarjetaNegocio}
                    src={urlVisualNegocio(n.logoUrl)}
                    alt=""
                    loading="lazy"
                    onError={(ev) => {
                      const el = ev.currentTarget;
                      el.src = URL_IMAGEN_NEGOCIO_FALLBACK_LOCAL;
                      el.style.objectFit = "contain";
                      el.style.padding = "14px";
                      el.style.background = "#f8fafc";
                    }}
                  />
                </div>
                <div className={estilos.tarjetaNegocioCuerpo}>
                  <h3 className={estilos.nombreNegocio}>{n.name}</h3>
                  <p className={estilos.metaNegocio}>{etiquetaCategoriaNegocio(n.category)}</p>
                  <div className={estilos.filaBadgesNegocio}>
                    {n.isVerified === true ? (
                      <span className={estilosDev.badgeVerde}>Verificado</span>
                    ) : null}
                    {n.isActive === false ? (
                      <span className={estilosDev.badgeRojo}>Inactivo</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {modalAbierto ? (
        <div
          className={estilos.modalFondo}
          role="presentation"
          onMouseDown={(ev) => {
            if (ev.target === ev.currentTarget) setModalAbierto(false);
          }}
        >
          <div
            className={estilos.modalCaja}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-negocio"
            onMouseDown={(ev) => ev.stopPropagation()}
          >
            <h2 id="titulo-modal-negocio" className={estilos.modalTitulo}>
              Registrar negocio
            </h2>
            <p className={estilos.hintModal}>
              La dirección de cobro se toma automáticamente de tu cuenta o de Phantom si está conectada. Podés revisarla en{" "}
              <Link href="/cliente/settings" className={estilos.enlaceVolver} style={{ marginBottom: 0, display: "inline" }}>
                Cuenta
              </Link>
              .
            </p>

            <form onSubmit={enviarCrear}>
              <label className={estilosDev.etiqueta} htmlFor="neg-nombre">
                Nombre
              </label>
              <input
                id="neg-nombre"
                className={estilosDev.input}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Mi tienda"
              />

              <div style={{ marginTop: 14 }}>
                <label className={estilosDev.etiqueta} htmlFor="neg-cat">
                  Categoría
                </label>
                <select
                  id="neg-cat"
                  className={estilos.select}
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {CATEGORIAS_NEGOCIO.map((c) => (
                    <option key={c.valor} value={c.valor}>
                      {c.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: 14 }}>
                <label className={estilosDev.etiqueta} htmlFor="neg-desc">
                  Descripción (opcional)
                </label>
                <textarea
                  id="neg-desc"
                  className={estilosDev.input}
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <ZonaSubidaLogoCloudinary
                  etiqueta="Logo del negocio (opcional)"
                  textoPlaceholder={"Clic o arrastrá\nimagen aquí"}
                  url={logoUrl}
                  alCambiarUrl={setLogoUrl}
                  claseBotonSecundario={estilosDev.botonSecundario}
                />
              </div>

              <div className={estilos.filaBotones}>
                <button
                  type="button"
                  className={estilosDev.botonSecundario}
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={estilosDev.botonPrimario} disabled={creando}>
                  {creando ? "Registrando…" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
