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
  crearUsuarioDemo,
  guardarSesion,
  inicializarUsuariosDemo,
  verificarCredenciales,
} from "../../demoAuth";
import type { ModoModal } from "./tiposAuth";

type PaisLatam = {
  codigo: string;
  etiqueta: string;
  prefijo: string;
  maximoDigitos: number;
};

const paisesLatam: PaisLatam[] = [
  { codigo: "ar", etiqueta: "Argentina", prefijo: "+54", maximoDigitos: 10 },
  { codigo: "bo", etiqueta: "Bolivia", prefijo: "+591", maximoDigitos: 8 },
  { codigo: "cl", etiqueta: "Chile", prefijo: "+56", maximoDigitos: 9 },
  { codigo: "co", etiqueta: "Colombia", prefijo: "+57", maximoDigitos: 10 },
  { codigo: "ec", etiqueta: "Ecuador", prefijo: "+593", maximoDigitos: 9 },
  { codigo: "gt", etiqueta: "Guatemala", prefijo: "+502", maximoDigitos: 8 },
  { codigo: "mx", etiqueta: "Mexico", prefijo: "+52", maximoDigitos: 10 },
  { codigo: "pe", etiqueta: "Peru", prefijo: "+51", maximoDigitos: 9 },
  { codigo: "uy", etiqueta: "Uruguay", prefijo: "+598", maximoDigitos: 8 },
  { codigo: "ve", etiqueta: "Venezuela", prefijo: "+58", maximoDigitos: 10 },
];

// Renderiza el modal de login/registro usando autenticación demo (localStorage).
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
  const [codigoPais, setCodigoPais] = useState("bo");
  const [telefono, setTelefono] = useState("");
  const [paisDropdownAbierto, setPaisDropdownAbierto] = useState(false);
  const wrapperPaisRef = useRef<HTMLDivElement | null>(null);

  const [cargando, setCargando] = useState(false);
  const [mensajeAuth, setMensajeAuth] = useState<string | null>(null);

  const paisSeleccionado = useMemo(() => {
    return paisesLatam.find((p) => p.codigo === codigoPais) ?? paisesLatam[0]!;
  }, [codigoPais]);

  useEffect(() => {
    // Si abren el modal en “registrar” o “ingresar”, alineamos el estado interno.
    if (!abierta) return;
    setModoModal(modoInicial);
  }, [abierta, modoInicial]);

  const cerrarModalInterno = () => {
    setCargando(false);
    alCerrar();
  };

  useEffect(() => {
    if (!abierta) return;

    // ESC cierra el modal (mejor UX)
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

    // Cierra el dropdown si el usuario hace click fuera (para que no se quede “pegado”)
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

  useEffect(() => {
    inicializarUsuariosDemo();
  }, []);

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (cargando) return;

    inicializarUsuariosDemo();
    setMensajeAuth(null);
    setCargando(true);

    // Dejamos el delay para que el UI se sienta "real" aunque sea demo.
    await new Promise((resolver) => setTimeout(resolver, 350));

    if (modoModal === "ingresar") {
      const rol = verificarCredenciales(correo, contrasena);
      setCargando(false);

      if (!rol) {
        setMensajeAuth("Credenciales inválidas. Revisa tu correo y contraseña.");
        return;
      }

      guardarSesion({ email: correo, rol });
      cerrarModalInterno();
      router.push(rol === "admin" ? "/admin" : "/cliente");
      return;
    }

    // FASE: registro demo (si el correo no existe)
    if (!telefono.trim()) {
      setCargando(false);
      setMensajeAuth("Falta el teléfono para registrarte.");
      return;
    }

    const creado = crearUsuarioDemo({
      email: correo,
      password: contrasena,
      rol: "cliente",
      pais: codigoPais,
      prefijo: paisSeleccionado.prefijo,
      telefono,
    });

    setCargando(false);
    if (!creado) {
      setMensajeAuth("Ese correo ya existe. Intenta iniciar sesión.");
      return;
    }

    guardarSesion({ email: correo, rol: "cliente" });
    cerrarModalInterno();
    router.push("/cliente");
  };

  const continuarConGoogle = async () => {
    if (cargando) return;
    inicializarUsuariosDemo();
    setMensajeAuth(null);
    setCargando(true);
    await new Promise((resolver) => setTimeout(resolver, 350));
    setCargando(false);

    // Login demo: si ya digitaste correo, usamos ese; si no, usamos el cliente demo.
    const email = correo.trim() ? correo.trim() : "cliente@gmail.com";
    guardarSesion({ email, rol: "cliente" });
    cerrarModalInterno();
    router.push("/cliente");
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
                ? "Accede con tu correo y contraseña o con Google."
                : "Regístrate con tu correo, contraseña y teléfono por país."}
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

        <div className={estilosHome.modalAccionesExternas}>
          <button
            type="button"
            className={estilosInicioSesion.botonGoogle}
            onClick={continuarConGoogle}
            disabled={cargando}
          >
            {cargando ? (
              "Procesando..."
            ) : (
              <>
                <img
                  className={estilosInicioSesion.iconoGoogle}
                  src="/imagenes/logo-google.svg"
                  alt="Google"
                />
              </>
            )}
          </button>

          <div className={estilosHome.modalSeparador}>o</div>
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
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </label>

          {modoModal === "registrar" && (
            <div className={estilosHome.telefonoFila}>
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
                    onClick={() =>
                      setPaisDropdownAbierto((valor) => !valor)
                    }
                  >
                    <span className={estilosInicioSesion.dropdownTexto}>
                      {paisSeleccionado.etiqueta} ({paisSeleccionado.prefijo})
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
                      {paisesLatam.map((pais) => (
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
                          {pais.etiqueta} ({pais.prefijo})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <label className={estilosHome.telefonoInput}>
                Teléfono
                <div className={estilosHome.telefonoFilaInterna}>
                  <span className={estilosHome.telefonoPrefijo}>
                    {paisSeleccionado.prefijo}
                  </span>
                  <input
                    className={`${estilosInicioSesion.input} ${estilosHome.telefonoCampo}`}
                    type="tel"
                    name="telefono"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    placeholder="987654321"
                    maxLength={paisSeleccionado.maximoDigitos}
                    value={telefono}
                    onChange={(e) => {
                      const soloDigitos = e.target.value.replace(/\D/g, "");
                      setTelefono(soloDigitos);
                    }}
                  />
                </div>
              </label>
            </div>
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

