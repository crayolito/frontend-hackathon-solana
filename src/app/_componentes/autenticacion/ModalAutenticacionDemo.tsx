"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import estilosInicioSesion from "../../inicio-sesion.module.css";
import estilosHome from "../../home.module.css";
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

      const respuesta = await registrarUsuarioTrustpay({
        email: correo,
        password: contrasena,
        fullName: nombreCompleto.trim(),
        country: paisSeleccionado.etiqueta,
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
        className={estilosHome.modalContenedor}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <div className={estilosHome.modalBarra}>
          <div>
            <h2 id="titulo-modal" className={estilosInicioSesion.titulo}>
              {modoModal === "ingresar" ? "Inicia sesión" : "Crea tu cuenta"}
            </h2>
            <p className={estilosHome.modalSubtitulo}>
              {modoModal === "ingresar"
                ? "Accede con tu correo y contraseña (admin o comercio)."
                : "Regístrate como comercio con correo, contraseña, nombre y país."}
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

        {mensajeAuth && (
          <p className={estilosInicioSesion.mensajeAuth}>{mensajeAuth}</p>
        )}

        <form
          className={estilosInicioSesion.formulario}
          onSubmit={enviarFormulario}
        >
          <label className={estilosInicioSesion.label}>
            Correo electrónico
            <input
              className={estilosInicioSesion.input}
              type="email"
              name="correo"
              required
              placeholder="tu@correo.com"
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>

          <label className={estilosInicioSesion.label}>
            Contraseña
            <input
              className={estilosInicioSesion.input}
              type="password"
              name="contrasena"
              required
              placeholder="••••••••"
              autoComplete={
                modoModal === "ingresar" ? "current-password" : "new-password"
              }
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </label>

          {modoModal === "registrar" && (
            <>
              <label className={estilosInicioSesion.label}>
                Nombre completo
                <input
                  className={estilosInicioSesion.input}
                  type="text"
                  name="nombreCompleto"
                  required
                  placeholder="Tu nombre o razón social"
                  autoComplete="name"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                />
              </label>

              <label className={estilosInicioSesion.label}>
                País
                <div
                  ref={wrapperPaisRef}
                  className={estilosInicioSesion.dropdownControl}
                >
                  <button
                    type="button"
                    className={estilosInicioSesion.dropdownBoton}
                    aria-haspopup="listbox"
                    aria-expanded={paisDropdownAbierto}
                    onClick={() => setPaisDropdownAbierto((v) => !v)}
                  >
                    <span className={estilosInicioSesion.dropdownTexto}>
                      {paisSeleccionado.etiqueta}
                    </span>
                    <span
                      className={estilosInicioSesion.dropdownFlecha}
                      aria-hidden="true"
                    />
                  </button>

                  {paisDropdownAbierto && (
                    <div
                      className={estilosInicioSesion.dropdownMenu}
                      role="listbox"
                      aria-label="Seleccionar país"
                    >
                      {paisesRegistro.map((pais) => (
                        <button
                          key={pais.codigo}
                          type="button"
                          className={estilosInicioSesion.dropdownItem}
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
                  )}
                </div>
              </label>
            </>
          )}

          <button
            className={estilosInicioSesion.boton}
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Enviando..."
              : modoModal === "ingresar"
                ? "Entrar"
                : "Registrarse"}
          </button>

          <div className={estilosInicioSesion.enlaces}>
            <button
              type="button"
              className={estilosInicioSesion.enlace}
              onClick={() =>
                setModoModal(modoModal === "ingresar" ? "registrar" : "ingresar")
              }
              disabled={cargando}
            >
              {modoModal === "ingresar"
                ? "No tengo cuenta — Registrarme"
                : "Ya tengo cuenta — Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
