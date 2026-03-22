"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cerrarSesion, obtenerSesionTrustpay } from "../demoAuth";
import { estiloMascaraIcono } from "../admin/_utilidades/estiloMascaraIcono";
import estilosAdmin from "../admin/estilos-administracion.module.css";
import estilos from "./estilos-cliente.module.css";

type OpcionCliente = {
  href: string;
  etiqueta: string;
  iconoSrc: string;
  esPanel?: boolean;
};

const opcionesCliente: OpcionCliente[] = [
  { href: "/cliente", etiqueta: "Panel", iconoSrc: "/iconos/icon-dashboard.svg", esPanel: true },
  { href: "/cliente/pagos", etiqueta: "Pagos", iconoSrc: "/iconos/icon-money.svg" },
  { href: "/cliente/api-keys", etiqueta: "Claves API", iconoSrc: "/iconos/icon-llave.svg" },
  { href: "/cliente/webhooks", etiqueta: "Webhooks", iconoSrc: "/iconos/icon-webhook.svg" },
  { href: "/cliente/settings", etiqueta: "Configuración", iconoSrc: "/iconos/icon-settings.svg" },
];

function inicialesDesdeEmail(email: string) {
  const local = email.split("@")[0] ?? "?";
  if (local.length < 2) return `${local}`.toUpperCase().padEnd(2, "·");
  return local.slice(0, 2).toUpperCase();
}

function inicialesUsuario(nombreCompleto: string, email: string) {
  const partes = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length >= 2) {
    return `${partes[0]![0] ?? ""}${partes[1]![0] ?? ""}`.toUpperCase();
  }
  if (partes.length === 1 && partes[0]!.length >= 2) {
    return partes[0]!.slice(0, 2).toUpperCase();
  }
  return inicialesDesdeEmail(email);
}

// Shell del comercio (rol API `merchant`): navegación y guard de sesión. La billetera se enlaza al registrarse.
export default function DisposicionDeCliente({ children }: Readonly<{ children: ReactNode }>) {
  const rutaActual = usePathname();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sesionLista, setSesionLista] = useState(false);
  const [emailSesion, setEmailSesion] = useState<string | null>(null);
  const [nombreSesion, setNombreSesion] = useState("");

  useEffect(() => {
    const datos = obtenerSesionTrustpay();
    if (!datos) {
      router.replace("/");
      return;
    }
    if (datos.user.role !== "merchant") {
      router.replace("/admin");
      return;
    }
    setEmailSesion(datos.user.email);
    setNombreSesion(datos.user.fullName);
    setSesionLista(true);
  }, [router]);

  // Evita que el documento quede scrolleado abajo al montar el panel (p. ej. foco en el menú inferior).
  useLayoutEffect(() => {
    if (!sesionLista) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [sesionLista]);

  useEffect(() => {
    setMenuAbierto(false);
  }, [rutaActual]);

  const cerrarSesionYSalir = () => {
    cerrarSesion();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    router.push("/");
  };

  const esActivo = (opcion: OpcionCliente) => {
    if (opcion.esPanel) return rutaActual === "/cliente";
    return rutaActual?.startsWith(opcion.href) ?? false;
  };

  const etiquetaUsuario = useMemo(() => {
    if (nombreSesion.trim()) return nombreSesion.trim();
    if (emailSesion) return emailSesion;
    return "Comercio";
  }, [emailSesion, nombreSesion]);

  const iniciales = useMemo(
    () => inicialesUsuario(nombreSesion, emailSesion ?? "co@mercio.com"),
    [emailSesion, nombreSesion],
  );

  if (!sesionLista) {
    return (
      <div className={`${estilosAdmin.contenedor} ${estilos.temaComercio}`} style={{ padding: 28, fontWeight: 700 }}>
        Comprobando sesión…
      </div>
    );
  }

  return (
    <div className={`${estilosAdmin.contenedor} ${estilos.temaComercio}`}>
        {menuAbierto ? (
          <button
            type="button"
            className={estilos.fondoAtras}
            aria-label="Cerrar menú"
            onClick={() => setMenuAbierto(false)}
          />
        ) : null}

        <aside
          id="menu-cliente"
          className={`${estilosAdmin.barra} ${estilos.barraCliente} ${menuAbierto ? estilos.barraClienteAbierta : ""}`}
          data-purpose="cliente-sidebar"
        >
          <div className={estilos.columnaBarra}>
            <div className={estilosAdmin.encabezadoMarca}>
              <Image
                className={estilosAdmin.logoSolana}
                src="/imagenes/logo1-solana.png"
                alt="Solana"
                width={40}
                height={40}
                priority
              />
              <div className={estilosAdmin.marcaTexto}>
                <h2 className={estilosAdmin.titulo}>TrustPay</h2>
                <div className={estilosAdmin.subtitulo}>Área del comercio</div>
              </div>
            </div>

            <div className={estilosAdmin.badgeRegion} aria-hidden="true">
              <span className={estilosAdmin.puntoRegion} />
              <span className={estilosAdmin.textoBadge}>Merchant</span>
            </div>

            <nav className={estilosAdmin.navegacion}>
              {opcionesCliente.map((opcion) => (
                <Link
                  key={opcion.href}
                  href={opcion.href}
                  className={`${estilosAdmin.enlace} ${esActivo(opcion) ? estilosAdmin.enlacePrincipal : ""}`}
                >
                  <span
                    className={estilosAdmin.mascaraIconoNav}
                    style={estiloMascaraIcono(opcion.iconoSrc)}
                    aria-hidden
                  />
                  <span className={estilosAdmin.etiquetaEnlace}>{opcion.etiqueta}</span>
                </Link>
              ))}
            </nav>

            <div className={estilos.bloqueUsuario}>
              <div className={estilos.avatarUsuario}>{iniciales}</div>
              <div className={estilos.textoUsuario}>
                <div className={estilos.emailUsuario} title={etiquetaUsuario}>
                  {etiquetaUsuario}
                </div>
              </div>
              <button
                type="button"
                className={estilos.botonSalirIcono}
                onClick={cerrarSesionYSalir}
                aria-label="Cerrar sesión"
                data-purpose="cliente-logout"
              >
                <span
                  className={estilosAdmin.mascaraIconoNav}
                  style={estiloMascaraIcono("/iconos/icon-cerrar-sesion.svg")}
                  aria-hidden
                />
              </button>
            </div>
          </div>
        </aside>

        <div className={estilos.columnaPrincipal}>
          <header className={estilos.barraSuperiorCliente}>
            <div className={estilos.barraSuperiorIzquierda}>
              <button
                type="button"
                className={estilos.botonMenu}
                aria-expanded={menuAbierto}
                aria-controls="menu-cliente"
                onClick={() => setMenuAbierto((v) => !v)}
              >
                <span className={estilos.iconoMenu} />
              </button>
              <h1 className={estilos.tituloBarraCliente}>TrustPay · Comercio</h1>
            </div>
          </header>

          <main className={estilosAdmin.contenido} data-purpose="cliente-main">
            {children}
          </main>
        </div>
      </div>
  );
}
