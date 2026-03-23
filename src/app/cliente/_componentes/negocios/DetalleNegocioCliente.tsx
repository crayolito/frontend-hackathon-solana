"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  actualizarNegocioTrustpay,
  eliminarNegocioTrustpay,
  ErrorApiTrustpay,
  listarNegociosTrustpay,
  listarQrCodesNegocioTrustpay,
  obtenerNegocioTrustpay,
  type NegocioTrustpay,
} from "../../../_lib/apiTrustpay";
import { obtenerTokenSesion } from "../../../demoAuth";
import estilosDev from "../desarrollador.module.css";
import { useNotificacion } from "../../../_componentes/ProveedorNotificaciones";
import estilos from "./negocios.module.css";
import { leerQrsLocalesNegocio } from "./almacenamientoQrLocal";
import FormularioCrearQr from "./FormularioCrearQr";
import MetricasNegocioMock from "./MetricasNegocioMock";
import VistaQrCodigo from "./VistaQrCodigo";

type Props = {
  idNegocio: string;
};

function mensajeAmigableErrorApi(mensaje: string) {
  if (/simulation|blockchain|on-chain|program error|custom program/i.test(mensaje)) {
    return `Error en cadena o servidor: ${mensaje}`;
  }
  return mensaje;
}

function etiquetaItemQrApi(item: unknown): string {
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    const l = o.label ?? o.name ?? o.title;
    if (typeof l === "string" && l.trim()) return l.trim();
    const id = o.id;
    if (typeof id === "string" && id.trim()) return id.trim().slice(0, 12) + "…";
  }
  return "Código QR";
}

function enlaceExploradorTx(firma: string) {
  return `https://solscan.io/tx/${encodeURIComponent(firma)}`;
}

function claveEstableQrApi(item: unknown, indice: number): string {
  if (item && typeof item === "object") {
    const id = (item as Record<string, unknown>).id;
    if (typeof id === "string" && id.length > 0) return id;
  }
  return `qr-api-${indice}`;
}

// Detalle de un negocio: renombrar, eliminar, QRs generados y métricas demo.
export default function DetalleNegocioCliente({ idNegocio }: Props) {
  const { mostrarNotificacion } = useNotificacion();
  const router = useRouter();
  const [negocio, setNegocio] = useState<NegocioTrustpay | null | undefined>(undefined);
  const [cargando, setCargando] = useState(true);

  const [nombreEdit, setNombreEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [guardandoNombre, setGuardandoNombre] = useState(false);

  const [eliminando, setEliminando] = useState(false);
  const [tickQr, setTickQr] = useState(0);
  const [qrsApi, setQrsApi] = useState<unknown[]>([]);
  const [cargandoQrsApi, setCargandoQrsApi] = useState(false);

  const recargarQrsDesdeApi = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) return;
    setCargandoQrsApi(true);
    try {
      const { items } = await listarQrCodesNegocioTrustpay(token, idNegocio, 1, 20);
      setQrsApi(items);
    } catch {
      setQrsApi([]);
    } finally {
      setCargandoQrsApi(false);
    }
  }, [idNegocio]);

  const recargarNegocio = useCallback(async () => {
    const token = obtenerTokenSesion();
    if (!token) {
      setNegocio(null);
      setCargando(false);
      return;
    }
    setCargando(true);
    try {
      try {
        const uno = await obtenerNegocioTrustpay(token, idNegocio);
        setNegocio(uno);
        setNombreEdit(uno.name);
        setDescripcionEdit(uno.description ?? "");
      } catch (err) {
        if (err instanceof ErrorApiTrustpay && err.codigoEstado === 404) {
          const { negocios } = await listarNegociosTrustpay(token, 1, 100);
          const encontrado = negocios.find((n) => n.id === idNegocio) ?? null;
          setNegocio(encontrado);
          if (encontrado) {
            setNombreEdit(encontrado.name);
            setDescripcionEdit(encontrado.description ?? "");
          }
        } else {
          throw err;
        }
      }
    } catch (e) {
      const texto =
        e instanceof ErrorApiTrustpay ? e.message : "No se pudo cargar el negocio.";
      mostrarNotificacion(texto);
      setNegocio(null);
    } finally {
      setCargando(false);
    }
  }, [idNegocio, mostrarNotificacion]);

  useEffect(() => {
    void recargarNegocio();
  }, [recargarNegocio]);

  useEffect(() => {
    void recargarQrsDesdeApi();
  }, [recargarQrsDesdeApi]);

  const qrsLocales = leerQrsLocalesNegocio(idNegocio);

  const guardarNombre = async (ev: FormEvent) => {
    ev.preventDefault();
    const token = obtenerTokenSesion();
    if (!token || negocio == null) return;
    if (!nombreEdit.trim()) {
      mostrarNotificacion("El nombre no puede quedar vacío.");
      return;
    }
    setGuardandoNombre(true);
    try {
      const desc = descripcionEdit.trim();
      const actualizado = await actualizarNegocioTrustpay(token, idNegocio, {
        name: nombreEdit.trim(),
        description: desc.length > 0 ? desc : null,
      });
      setNegocio(actualizado);
      setNombreEdit(actualizado.name);
      setDescripcionEdit(actualizado.description ?? "");
    } catch (e) {
      if (e instanceof ErrorApiTrustpay) {
        mostrarNotificacion(mensajeAmigableErrorApi(e.message), 16_000);
      } else {
        mostrarNotificacion("No se pudo actualizar.");
      }
    } finally {
      setGuardandoNombre(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!window.confirm("¿Eliminar este negocio? Esta acción no se puede deshacer desde aquí.")) {
      return;
    }
    const token = obtenerTokenSesion();
    if (!token) return;
    setEliminando(true);
    try {
      await eliminarNegocioTrustpay(token, idNegocio);
      router.replace("/cliente/negocios");
    } catch (e) {
      if (e instanceof ErrorApiTrustpay) {
        mostrarNotificacion(mensajeAmigableErrorApi(e.message), 16_000);
      } else {
        mostrarNotificacion("No se pudo eliminar.");
      }
    } finally {
      setEliminando(false);
    }
  };

  if (cargando && negocio === undefined) {
    return (
      <div className={estilos.contenedor}>
        <p style={{ color: "var(--texto-secundario)" }}>Cargando negocio…</p>
      </div>
    );
  }

  if (negocio === null || negocio === undefined) {
    return (
      <div className={estilos.contenedor}>
        <p style={{ color: "var(--texto-secundario)" }}>No encontramos ese negocio.</p>
        <Link href="/cliente/negocios" className={estilos.enlaceVolver}>
          ← Volver a negocios
        </Link>
      </div>
    );
  }

  return (
    <div className={estilos.contenedor}>
      <Link href="/cliente/negocios" className={estilos.enlaceVolver}>
        ← Volver a negocios
      </Link>

      <section className={estilosDev.tarjeta}>
        <div className={estilosDev.cabeceraTarjeta}>
          <h2 className={estilosDev.tituloTarjeta} style={{ margin: 0 }}>
            {negocio.name}
          </h2>
          <button
            type="button"
            className={estilosDev.botonPeligro}
            disabled={eliminando}
            onClick={() => void confirmarEliminar()}
          >
            {eliminando ? "Eliminando…" : "Eliminar negocio"}
          </button>
        </div>
        <div className={estilosDev.cuerpoTarjeta}>
          <p className={estilosDev.subtituloTarjeta} style={{ marginTop: 0 }}>
            Categoría: <strong>{negocio.category}</strong>
            {negocio.isVerified === true ? (
              <>
                {" "}
                <span className={estilosDev.badgeVerde}>Verificado</span>
              </>
            ) : null}
            {negocio.isActive === false ? (
              <>
                {" "}
                <span className={estilosDev.badgeRojo}>Inactivo</span>
              </>
            ) : null}
            {negocio.description ? (
              <>
                <br />
                {negocio.description}
              </>
            ) : null}
          </p>
          {negocio.walletAddress ? (
            <p className={estilos.monoPeq} style={{ marginBottom: 0 }}>
              Wallet de cobro: {negocio.walletAddress}
            </p>
          ) : null}
          {negocio.solanaTxRegister ? (
            <p className={estilos.monoPeq} style={{ marginTop: 10, marginBottom: 0 }}>
              Registro on-chain:{" "}
              <a
                href={enlaceExploradorTx(negocio.solanaTxRegister)}
                target="_blank"
                rel="noopener noreferrer"
                className={estilos.enlaceVolver}
                style={{ marginBottom: 0, wordBreak: "break-all" }}
              >
                {negocio.solanaTxRegister}
              </a>
            </p>
          ) : null}
          {negocio.createdAt ? (
            <p className={estilos.monoPeq} style={{ marginTop: 8, marginBottom: 0, color: "#64748b" }}>
              Creado: {new Date(negocio.createdAt).toLocaleString()}
            </p>
          ) : null}

          <form onSubmit={guardarNombre} style={{ marginTop: 18 }}>
            <label className={estilosDev.etiqueta} htmlFor="edit-nombre">
              Nombre del negocio
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <input
                id="edit-nombre"
                className={estilosDev.input}
                style={{ flex: "1 1 200px", maxWidth: 360 }}
                value={nombreEdit}
                onChange={(e) => setNombreEdit(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <label className={estilosDev.etiqueta} htmlFor="edit-desc">
                Descripción
              </label>
              <textarea
                id="edit-desc"
                className={estilosDev.input}
                rows={2}
                value={descripcionEdit}
                onChange={(e) => setDescripcionEdit(e.target.value)}
                placeholder="Opcional"
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="submit" className={estilosDev.botonPrimario} disabled={guardandoNombre}>
                {guardandoNombre ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <MetricasNegocioMock idNegocio={idNegocio} />

      <FormularioCrearQr
        idNegocio={idNegocio}
        alCrear={() => {
          setTickQr((t) => t + 1);
          void recargarQrsDesdeApi();
        }}
      />

      <section className={estilosDev.tarjeta}>
        <div className={estilosDev.cabeceraTarjeta}>
          <h2 className={estilosDev.tituloTarjeta}>Códigos QR (servidor)</h2>
        </div>
        <div className={estilosDev.cuerpoTarjeta}>
          <p className={estilosDev.subtituloTarjeta} style={{ marginTop: 0 }}>
            Listado desde <code className={estilosDev.mono}>/businesses/…/qr-codes</code> (paginado).
          </p>
          {cargandoQrsApi ? (
            <p style={{ color: "var(--texto-secundario)" }}>Cargando QRs…</p>
          ) : null}
          {!cargandoQrsApi && qrsApi.length === 0 ? (
            <p style={{ color: "var(--texto-secundario)" }}>No hay códigos registrados en el servidor todavía.</p>
          ) : null}
          <div className={estilos.listaQr} aria-live="polite">
            {qrsApi.map((item, idx) => (
              <div key={claveEstableQrApi(item, idx)} className={estilos.itemQr}>
                <div className={estilos.cabeceraQr}>
                  <h3 className={estilos.tituloQr}>{etiquetaItemQrApi(item)}</h3>
                </div>
                <VistaQrCodigo respuesta={item} etiqueta={etiquetaItemQrApi(item)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={estilosDev.tarjeta}>
        <div className={estilosDev.cabeceraTarjeta}>
          <h2 className={estilosDev.tituloTarjeta}>Códigos QR de esta sesión</h2>
        </div>
        <div className={estilosDev.cuerpoTarjeta}>
          <p className={estilosDev.subtituloTarjeta} style={{ marginTop: 0 }}>
            Copia local en el navegador hasta cerrar la pestaña (útil si el POST acaba de devolver un QR).
          </p>
          {qrsLocales.length === 0 ? (
            <p style={{ color: "var(--texto-secundario)" }}>Todavía no generaste QRs en esta sesión.</p>
          ) : null}
          <div className={estilos.listaQr} key={tickQr} aria-live="polite">
            {qrsLocales.map((q) => (
              <div key={q.id} className={estilos.itemQr}>
                <div className={estilos.cabeceraQr}>
                  <h3 className={estilos.tituloQr}>{q.etiqueta}</h3>
                  <span className={estilosDev.badge}>
                    {q.montoVariable ? "Monto variable" : "Monto fijo"}
                  </span>
                </div>
                <VistaQrCodigo respuesta={q.respuesta} etiqueta={q.etiqueta} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
