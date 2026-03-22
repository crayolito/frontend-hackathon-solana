"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import estilosHome from "../../home.module.css";
import BotonConexionWallet from "../../solana/BotonConexionWallet";
import estilosModal from "./modal-autenticacion.module.css";
import {
  ErrorApiTrustpay,
  iniciarSesionTrustpay,
  registrarUsuarioTrustpay,
} from "../../_lib/apiTrustpay";
import { guardarSesionTrustpay } from "../../demoAuth";
import type { ModoModal } from "./tiposAuth";

type PaisRegistro = {
  codigo: string;
  etiqueta: string;
};

// Países con nombre tal como suele esperarse en el backend (string legible).
const paisesRegistro: PaisRegistro[] = [
  { codigo: "ar", etiqueta: "Argentina" },
  { codigo: "bo", etiqueta: "Bolivia" },
  { codigo: "cl", etiqueta: "Chile" },
  { codigo: "co", etiqueta: "Colombia" },
  { codigo: "ec", etiqueta: "Ecuador" },
  { codigo: "gt", etiqueta: "Guatemala" },
  { codigo: "mx", etiqueta: "Mexico" },
  { codigo: "pe", etiqueta: "Peru" },
  { codigo: "uy", etiqueta: "Uruguay" },
  { codigo: "ve", etiqueta: "Venezuela" },
];

// Modal de login y registro contra el API TrustPay (admin o merchant).
export default function ModalAutenticacionDemo({
  abierta,
  modoInicial,
  alCerrar,
}: Readonly<{
  abierta: boolean;
  modoInicial: ModoModal;
  alCerrar: () => void;
}>) {
  const router = useRouter();
  const { connected, publicKey } = useWallet();

  const [modoModal, setModoModal] = useState<ModoModal>(modoInicial);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [codigoPais, setCodigoPais] = useState("bo");
  const [paisDropdownAbierto, setPaisDropdownAbierto] = useState(false);
  const wrapperPaisRef = useRef<HTMLDivElement | null>(null);

  const [cargando, setCargando] = useState(false);
  const [mensajeAuth, setMensajeAuth] = useState<string | null>(null);

  const paisSeleccionado = useMemo(() => {
    return paisesRegistro.find((p) => p.codigo === codigoPais) ?? paisesRegistro[0]!;
  }, [codigoPais]);

  useEffect(() => {
    if (!abierta) return;
    setModoModal(modoInicial);
  }, [abierta, modoInicial]);

  // Al cerrar el modal dejamos el formulario limpio para la próxima vez.
  useEffect(() => {
    if (abierta) return;
    setCorreo("");
    setContrasena("");
    setNombreCompleto("");
    setCodigoPais("bo");
    setMensajeAuth(null);
    setPaisDropdownAbierto(false);
  }, [abierta]);

  const cerrarModalInterno = () => {
    setCargando(false);
    alCerrar();
  };

  useEffect(() => {
    if (!abierta) return;

    const manejadorTeclado = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") cerrarModalInterno();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", manejadorTeclado);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", manejadorTeclado);
    };
  }, [abierta]);

  useEffect(() => {
    if (!paisDropdownAbierto) return;

    const manejarClickFuera = (evento: MouseEvent) => {
      const objetivo = evento.target as Node | null;
      if (!objetivo) return;
      if (!wrapperPaisRef.current?.contains(objetivo)) {
        setPaisDropdownAbierto(false);
      }
    };

    window.addEventListener("mousedown", manejarClickFuera);
    return () => window.removeEventListener("mousedown", manejarClickFuera);
  }, [paisDropdownAbierto]);

  const redirigirSegunRol = (rol: "admin" | "merchant") => {
    router.push(rol === "admin" ? "/admin" : "/cliente");
  };

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (cargando) return;

    setMensajeAuth(null);
    setCargando(true);

    try {
      if (modoModal === "ingresar") {
        const respuesta = await iniciarSesionTrustpay(correo, contrasena);
        guardarSesionTrustpay({
          token: respuesta.token,
          user: {
            id: respuesta.user.id,
            fullName: respuesta.user.fullName,
            email: respuesta.user.email,
            role: respuesta.user.role,
            country: respuesta.user.country,
            walletAddress: respuesta.user.walletAddress,
            isVerified: respuesta.user.isVerified,
            isActive: respuesta.user.isActive,
          },
        });
        cerrarModalInterno();
        redirigirSegunRol(respuesta.user.role);
        return;
      }

      if (!nombreCompleto.trim()) {
        setMensajeAuth("Indica tu nombre completo.");
        setCargando(false);
        return;
      }

      if (!connected || !publicKey) {
        setMensajeAuth("Conectá Phantom (devnet) para continuar.");
        setCargando(false);
        return;
      }

      const respuesta = await registrarUsuarioTrustpay({
        email: correo,
        password: contrasena,
        fullName: nombreCompleto.trim(),
        country: paisSeleccionado.etiqueta,
        walletAddress: publicKey.toBase58(),
      });

      guardarSesionTrustpay({
        token: respuesta.token,
        user: {
          id: respuesta.user.id,
          fullName: respuesta.user.fullName,
          email: respuesta.user.email,
          role: respuesta.user.role,
          country: respuesta.user.country,
          walletAddress: respuesta.user.walletAddress,
          isVerified: respuesta.user.isVerified,
          isActive: respuesta.user.isActive,
        },
      });
      cerrarModalInterno();
      redirigirSegunRol(respuesta.user.role);
    } catch (error) {
      if (error instanceof ErrorApiTrustpay) {
        setMensajeAuth(error.message);
      } else {
        setMensajeAuth("No pudimos completar la solicitud. Intenta de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  };

  if (!abierta) return null;

  const claseTamano =
    modoModal === "ingresar" ? estilosModal.tamanoIngresar : estilosModal.tamanoRegistro;

  return (
    <div
      className={estilosHome.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) cerrarModalInterno();
      }}
    >
      <div
        className={`${estilosHome.modalContenedor} ${claseTamano}`}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <div className={estilosModal.modalInterior}>
          <div className={estilosModal.modalScroll}>
            <div className={estilosModal.cabeceraCompacta}>
              <div>
                <h2 id="titulo-modal" className={estilosModal.tituloModal}>
                  {modoModal === "ingresar" ? "Entrá a TrustPay" : "Alta de comercio"}
                </h2>
                <p className={estilosModal.hintLinea}>
                  {modoModal === "ingresar"
                    ? "Correo y contraseña. Sin billetera."
                    : "Datos básicos + Phantom (devnet) en una sola pantalla."}
                </p>
              </div>
              <button
                type="button"
                className={estilosHome.modalCerrar}
                onClick={cerrarModalInterno}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>

            <div
              className={estilosModal.segmentoGrupo}
              role="tablist"
              aria-label="Elegir acceso"
            >
              <button
                type="button"
                role="tab"
                aria-selected={modoModal === "ingresar"}
                className={`${estilosModal.segmentoBoton} ${modoModal === "ingresar" ? estilosModal.segmentoBotonActivo : ""}`}
                disabled={cargando}
                onClick={() => {
                  setMensajeAuth(null);
                  setModoModal("ingresar");
                }}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={modoModal === "registrar"}
                className={`${estilosModal.segmentoBoton} ${modoModal === "registrar" ? estilosModal.segmentoBotonActivo : ""}`}
                disabled={cargando}
                onClick={() => {
                  setMensajeAuth(null);
                  setModoModal("registrar");
                }}
              >
                Crear cuenta
              </button>
            </div>

            {mensajeAuth ? (
              <p className={estilosModal.mensajeAuth} role="alert">
                {mensajeAuth}
              </p>
            ) : null}

            <form className={estilosModal.formulario} onSubmit={enviarFormulario}>
              {modoModal === "registrar" ? (
                <div className={estilosModal.gridRegistro}>
                  <label
                    className={`${estilosModal.etiqueta} ${estilosModal.campoLargo}`}
                  >
                    Correo
                    <input
                      className={estilosModal.input}
                      type="email"
                      name="correo"
                      required
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </label>

                  <label className={estilosModal.etiqueta}>
                    Contraseña
                    <input
                      className={estilosModal.input}
                      type="password"
                      name="contrasena"
                      required
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                    />
                  </label>

                  <label className={estilosModal.etiqueta}>
                    País
                    <div
                      ref={wrapperPaisRef}
                      className={estilosModal.dropdownControl}
                    >
                      <button
                        type="button"
                        className={estilosModal.dropdownBoton}
                        aria-haspopup="listbox"
                        aria-expanded={paisDropdownAbierto}
                        onClick={() => setPaisDropdownAbierto((v) => !v)}
                      >
                        <span className={estilosModal.dropdownTexto}>
                          {paisSeleccionado.etiqueta}
                        </span>
                        <span
                          className={estilosModal.dropdownFlecha}
                          aria-hidden="true"
                        />
                      </button>

                      {paisDropdownAbierto ? (
                        <div
                          className={estilosModal.dropdownMenu}
                          role="listbox"
                          aria-label="Seleccionar país"
                        >
                          {paisesRegistro.map((pais) => (
                            <button
                              key={pais.codigo}
                              type="button"
                              className={estilosModal.dropdownItem}
                              data-activo={pais.codigo === codigoPais}
                              aria-selected={pais.codigo === codigoPais}
                              onClick={() => {
                                setCodigoPais(pais.codigo);
                                setPaisDropdownAbierto(false);
                              }}
                            >
                              {pais.etiqueta}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </label>

                  <label
                    className={`${estilosModal.etiqueta} ${estilosModal.campoLargo}`}
                  >
                    Nombre o razón social
                    <input
                      className={estilosModal.input}
                      type="text"
                      name="nombreCompleto"
                      required
                      placeholder="Ej. Mi negocio SRL"
                      autoComplete="organization"
                      value={nombreCompleto}
                      onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                  </label>

                  <div
                    className={`${estilosModal.cintaWallet} ${estilosModal.campoLargo}`}
                  >
                    <div className={estilosModal.cintaWalletTextos}>
                      <p className={estilosModal.cintaWalletKicker}>Cobros en cadena</p>
                      <p className={estilosModal.cintaWalletDetalle}>
                        Vinculá Phantom para guardar tu dirección de cobro.
                      </p>
                      {connected && publicKey ? (
                        <span className={estilosModal.pillOk}>Listo para registrar</span>
                      ) : null}
                    </div>
                    <div className={estilosModal.cintaWalletAccion}>
                      <BotonConexionWallet compacto />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <label className={estilosModal.etiqueta}>
                    Correo
                    <input
                      className={estilosModal.input}
                      type="email"
                      name="correo"
                      required
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </label>

                  <label className={estilosModal.etiqueta}>
                    Contraseña
                    <input
                      className={estilosModal.input}
                      type="password"
                      name="contrasena"
                      required
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                    />
                  </label>
                </>
              )}

              <button
                className={estilosModal.botonEnviar}
                type="submit"
                disabled={cargando}
              >
                {cargando
                  ? "Procesando…"
                  : modoModal === "ingresar"
                    ? "Entrar"
                    : "Crear cuenta"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
