"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cerrarSesion, obtenerSesion } from "../demoAuth";
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
  { href: "/cliente/documentacion", etiqueta: "Documentación", iconoSrc: "/iconos/icon-analytics.svg" },
];

function inicialesDesdeEmail(email: string) {
  const local = email.split("@")[0] ?? "?";
  if (local.length < 2) return `${local}`.toUpperCase().padEnd(2, "·");
  return local.slice(0, 2).toUpperCase();
}

// Misma base que admin (logo, badge, nav). Pie: correo + icono cerrar sesión (sin botón ancho duplicado).
// Colores vía `.temaComercio`; en pantallas pequeñas la barra es panel deslizante.
export default function DisposicionDeCliente({ children }: Readonly<{ children: ReactNode }>) {
  const rutaActual = usePathname();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [emailSesion, setEmailSesion] = useState<string | null>(null);

  useEffect(() => {
    const s = obtenerSesion();
    setEmailSesion(s?.email ?? null);
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
  }, [rutaActual]);

  const cerrarSesionYSalir = () => {
    cerrarSesion();
    router.push("/");
  };

  const esActivo = (opcion: OpcionCliente) => {
    if (opcion.esPanel) return rutaActual === "/cliente";
    return rutaActual?.startsWith(opcion.href) ?? false;
  };

  const etiquetaUsuario = useMemo(() => {
    if (emailSesion) return emailSesion;
    return "Sesión demo (comercio)";
  }, [emailSesion]);

  const iniciales = useMemo(
    () => inicialesDesdeEmail(emailSesion ?? "co@mercio.com"),
    [emailSesion],
  );

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
              <h2 className={estilosAdmin.titulo}>Compra Segura</h2>
              <div className={estilosAdmin.subtitulo}>Área del comercio</div>
            </div>
          </div>

          <div className={estilosAdmin.badgeRegion} aria-hidden="true">
            <span className={estilosAdmin.puntoRegion} />
            <span className={estilosAdmin.textoBadge}>Cuenta comercio</span>
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
        <header className={estilos.barraSitioMovil}>
          <button
            type="button"
            className={estilos.botonMenu}
            aria-expanded={menuAbierto}
            aria-controls="menu-cliente"
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span className={estilos.iconoMenu} />
          </button>
          <h1 className={estilos.tituloMovil}>Compra Segura</h1>
        </header>

        <main className={estilosAdmin.contenido} data-purpose="cliente-main">
          {children}
        </main>
      </div>
    </div>
  );
}
