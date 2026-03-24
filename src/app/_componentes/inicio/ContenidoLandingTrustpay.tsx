import Link from "next/link";

import estilosHome from "../../home.module.css";
import { IconoCodigo, IconoEscrow } from "./IconosCompraSegura";
import {
  IconoBancoFriccion,
  IconoCheckCirculo,
  IconoCobroInstantaneo,
  IconoCuentaRapida,
  IconoCasaContrato,
  IconoGraficoMetricas,
  IconoLatamRed,
  IconoLibroDocs,
  IconoMascota,
  IconoPaquete,
  IconoPagoRechazado,
  IconoQrEnlace,
} from "./IconosLandingTrustpay";

const scroll = { scrollMarginTop: 88 } as const;

// Landing con jerarquía visual fuerte, iconos SVG propios y CTAs a documentación.
export default function ContenidoLandingTrustpay({
  onCrearCuentaGratis,
}: Readonly<{
  onCrearCuentaGratis: () => void;
}>) {
  return (
    <>
      <section id="problema" className={estilosHome.landingSeccion} style={scroll}>
        <div className={estilosHome.landingPanel}>
          <span className={estilosHome.landingPildora}>Por qué TrustPay</span>
          <h2 className={estilosHome.landingTituloXL}>
            Las pasarelas clásicas no llegaron a LATAM.
            <span className={estilosHome.landingTituloAcento}> Los bancos tampoco ayudan.</span>
          </h2>
          <p className={estilosHome.landingLead}>
            PayPal rechaza pagos cripto. Los bancos bloquean transferencias grandes. En muchos
            países de primer mundo, si ganaste el 60% con Bitcoin, le debés la mitad al Estado.
            En LATAM, mover dinero sin pasar por el banco es casi imposible — hasta ahora.
          </p>

          <div className={estilosHome.landingGridProblema}>
            <div className={estilosHome.landingTarjetaProblema}>
              <div className={estilosHome.landingIconoAro} data-variant="cyan">
                <IconoPagoRechazado color="var(--primario)" />
              </div>
              <h3 className={estilosHome.landingTarjetaTitulo}>
                PayPal y otras pasarelas cobran mucho y no habilitan cripto
              </h3>
              <p className={estilosHome.landingTarjetaTexto}>
                Con los agregadores tradicionales no podés cobrar en BTC, SOL ni USDC de forma nativa.
              </p>
            </div>
            <div className={estilosHome.landingTarjetaProblema}>
              <div className={estilosHome.landingIconoAro} data-variant="lima">
                <IconoBancoFriccion color="var(--estado-exito)" />
              </div>
              <h3 className={estilosHome.landingTarjetaTitulo}>Los bancos preguntan demasiado</h3>
              <p className={estilosHome.landingTarjetaTexto}>
                Grandes montos generan bloqueos, declaraciones y fricciones innecesarias.
              </p>
            </div>
            <div className={estilosHome.landingTarjetaProblema}>
              <div className={estilosHome.landingIconoAro} data-variant="fucsia">
                <IconoLatamRed color="#f472e8" />
              </div>
              <h3 className={estilosHome.landingTarjetaTitulo}>LATAM quedó fuera</h3>
              <p className={estilosHome.landingTarjetaTexto}>
                Bolivia, Perú, Venezuela y otros países siguen sin acceso real a pagos digitales
                modernos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className={estilosHome.landingSeccion} style={scroll}>
        <span className={estilosHome.landingPildora}>Cómo funciona</span>
        <h2 className={estilosHome.landingTituloSeccion}>Tres pasos para empezar a cobrar</h2>
        <p className={estilosHome.landingSubtituloSeccion}>
          Del registro al primer cobro: flujo pensado para comercios que no quieren depender del
          banco.
        </p>

        <div className={estilosHome.landingPasosPista}>
          <div className={estilosHome.landingPasoTarjeta}>
            <div className={estilosHome.landingPasoIcono}>
              <IconoCuentaRapida color="var(--primario)" />
            </div>
            <span className={estilosHome.landingPasoBadge}>01</span>
            <h3 className={estilosHome.landingPasoTitulo}>Creá tu cuenta</h3>
            <p className={estilosHome.landingPasoTexto}>
              Registrá tu negocio en minutos. Sin papeles, sin banco requerido.
            </p>
          </div>
          <div className={estilosHome.landingPasoTarjeta}>
            <div className={estilosHome.landingPasoIcono}>
              <IconoQrEnlace color="var(--estado-exito)" />
            </div>
            <span className={estilosHome.landingPasoBadge}>02</span>
            <h3 className={estilosHome.landingPasoTitulo}>Generá tu QR o link de pago</h3>
            <p className={estilosHome.landingPasoTexto}>
              Compartilo con tus clientes en persona o por redes.
            </p>
          </div>
          <div className={estilosHome.landingPasoTarjeta}>
            <div className={estilosHome.landingPasoIcono}>
              <IconoCobroInstantaneo color="var(--primario)" />
            </div>
            <span className={estilosHome.landingPasoBadge}>03</span>
            <h3 className={estilosHome.landingPasoTitulo}>Cobrás al instante</h3>
            <p className={estilosHome.landingPasoTexto}>
              El pago llega directo a tu wallet. Nosotros cobramos solo el 1%.
            </p>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className={estilosHome.landingSeccion} style={scroll}>
        <span className={estilosHome.landingPildora}>Producto</span>
        <h2 className={estilosHome.landingTituloSeccion}>Todo lo que necesitás para cobrar en cripto</h2>

        <div className={estilosHome.landingBento}>
          <article className={estilosHome.landingFeatureTarjeta}>
            <div className={estilosHome.landingFeatureCabecera}>
              <div className={estilosHome.landingFeatureIcono}>
                <IconoQrEnlace color="var(--primario)" tamano={26} />
              </div>
              <h3 className={estilosHome.landingFeatureTitulo}>Pagos con QR y links</h3>
            </div>
            <p className={estilosHome.landingFeatureTexto}>
              Generá un QR de Solana para tu negocio físico o un link de pago para tu tienda online.
              Tu cliente paga desde su wallet en segundos. USDC, SOL y más activos.
            </p>
            <div className={estilosHome.landingFeatureDecorQr} aria-hidden>
              <div className={estilosHome.landingMiniQr}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className={estilosHome.landingMiniQrCelda} />
                ))}
              </div>
            </div>
          </article>

          <article className={estilosHome.landingFeatureTarjeta}>
            <div className={estilosHome.landingFeatureCabecera}>
              <div className={estilosHome.landingFeatureIcono}>
                <IconoGraficoMetricas color="var(--estado-exito)" />
              </div>
              <h3 className={estilosHome.landingFeatureTitulo}>Dashboard con métricas</h3>
            </div>
            <p className={estilosHome.landingFeatureTexto}>
              Mirá cuánto ganaste hoy, esta semana o este mes. Varios negocios, varios paneles.
              Exportá reportes cuando quieras.
            </p>
            <div className={estilosHome.mockupDashboardMini} aria-hidden>
              <div className={estilosHome.mockupDashboardBarras}>
                {[50, 72, 48, 88, 64, 92, 58, 78].map((h, i) => (
                  <div key={i} className={estilosHome.mockupDashboardBarra} style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className={estilosHome.mockupDashboardLeyenda}>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>
          </article>

          <article className={`${estilosHome.landingFeatureTarjeta} ${estilosHome.landingFeatureAncho}`}>
            <div className={estilosHome.landingFeatureCabecera}>
              <div className={estilosHome.landingFeatureIcono}>
                <IconoEscrow color="var(--primario)" />
              </div>
              <h3 className={estilosHome.landingFeatureTitulo}>Pagos protegidos (Escrow)</h3>
            </div>
            <p className={estilosHome.landingFeatureTexto}>
              El dinero queda bloqueado en un contrato inteligente hasta cumplir condiciones. Se
              libera automáticamente. Sin intermediarios de confianza.
            </p>
            <div className={estilosHome.landingEscrowGrid}>
              <div className={estilosHome.landingEscrowItem}>
                <div className={estilosHome.landingEscrowIcono}>
                  <IconoMascota color="var(--primario)" />
                </div>
                <div>
                  <h4 className={estilosHome.landingEscrowItemTitulo}>Mascotas perdidas</h4>
                  <p className={estilosHome.landingEscrowItemTexto}>
                    Recompensa en cripto retenida; staking opcional hasta que alguien encuentre a tu
                    mascota.
                  </p>
                </div>
              </div>
              <div className={estilosHome.landingEscrowItem}>
                <div className={estilosHome.landingEscrowIcono}>
                  <IconoCasaContrato color="var(--estado-exito)" />
                </div>
                <div>
                  <h4 className={estilosHome.landingEscrowItemTitulo}>Anticrético</h4>
                  <p className={estilosHome.landingEscrowItemTexto}>
                    Monto bloqueado en contrato; al vencer el plazo, devolución automática. Sin
                    notaría cara.
                  </p>
                </div>
              </div>
              <div className={estilosHome.landingEscrowItem}>
                <div className={estilosHome.landingEscrowIcono}>
                  <IconoPaquete color="#f472e8" />
                </div>
                <div>
                  <h4 className={estilosHome.landingEscrowItemTitulo}>Entregas y acuerdos</h4>
                  <p className={estilosHome.landingEscrowItemTexto}>
                    El pago se libera solo cuando se cumple la condición que definiste.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className={estilosHome.landingFeatureTarjeta}>
            <div className={estilosHome.landingFeatureCabecera}>
              <div className={estilosHome.landingFeatureIcono}>
                <IconoCodigo color="var(--primario)" />
              </div>
              <h3 className={estilosHome.landingFeatureTitulo}>API y Sandbox</h3>
            </div>
            <p className={estilosHome.landingFeatureTexto}>
              Integrá TrustPay en tu web o app. Modo sandbox sin dinero real. Webhooks para
              automatizar. Pensado para equipos que necesitan documentación seria.
            </p>
            <div className={estilosHome.landingDocCta}>
              <Link href="/api-docs" className={estilosHome.landingDocBoton}>
                <IconoLibroDocs color="currentColor" tamano={20} />
                Ver documentación para integrar
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section id="casos-uso" className={estilosHome.landingSeccion} style={scroll}>
        <span className={estilosHome.landingPildora}>Historias</span>
        <h2 className={estilosHome.landingTituloSeccion}>Pensado para negocios reales en LATAM</h2>

        <div className={estilosHome.landingCasosGrid}>
          <figure className={estilosHome.landingHistoria}>
            <div className={estilosHome.landingHistoriaPerfil} aria-hidden>
              M
            </div>
            <figcaption className={estilosHome.landingHistoriaMeta}>María · e-commerce · Bolivia</figcaption>
            <blockquote className={estilosHome.landingHistoriaCita}>
              Ahora acepta USDC sin tocar un banco. Sus clientes pagan escaneando un QR desde su
              wallet.
            </blockquote>
          </figure>
          <figure className={estilosHome.landingHistoria}>
            <div className={estilosHome.landingHistoriaPerfil} data-tone="lima" aria-hidden>
              J
            </div>
            <figcaption className={estilosHome.landingHistoriaMeta}>Juan · recompensa · Escrow</figcaption>
            <blockquote className={estilosHome.landingHistoriaCita}>
              Publicó una recompensa en cripto. El dinero quedó bloqueado hasta que alguien lo
              encontró — se liberó automáticamente.
            </blockquote>
          </figure>
          <figure className={estilosHome.landingHistoria}>
            <div className={estilosHome.landingHistoriaPerfil} data-tone="fucsia" aria-hidden>
              C
            </div>
            <figcaption className={estilosHome.landingHistoriaMeta}>Carlos · anticrético · Contrato</figcaption>
            <blockquote className={estilosHome.landingHistoriaCita}>
              $25,000 sin notaría. El contrato inteligente devolvió el dinero a los 3 años. Sin
              sorpresas.
            </blockquote>
          </figure>
        </div>
      </section>

      <section id="precios" className={estilosHome.landingSeccion} style={scroll}>
        <span className={estilosHome.landingPildora}>Precios</span>
        <h2 className={estilosHome.landingTituloSeccion}>Simple. Sin sorpresas.</h2>

        <div className={estilosHome.landingPreciosLayout}>
          <div className={estilosHome.landingPreciosHero}>
            <p className={estilosHome.landingPreciosEtiqueta}>Comisión por cobro</p>
            <p className={estilosHome.landingPreciosGigante}>1%</p>
            <p className={estilosHome.landingPreciosBajada}>
              Sin cuota mensual. Sin letra chica rara. Solo cuando vos cobrás, nosotros también.
            </p>
            <ul className={estilosHome.landingPreciosLista}>
              <li>Cuenta y sandbox gratis</li>
              <li>QR, links, dashboard y escrow incluidos</li>
            </ul>
          </div>
          <div className={estilosHome.landingPreciosTablaWrap}>
            <table className={estilosHome.landingTablaPrecios}>
              <thead>
                <tr>
                  <th scope="col">Incluido en tu cuenta</th>
                  <th scope="col">Plan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Crear cuenta</td>
                  <td>
                    <span className={estilosHome.landingCeldaOk}>
                      <IconoCheckCirculo color="var(--estado-exito)" tamano={16} /> Gratis
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Sandbox / modo dev</td>
                  <td>
                    <span className={estilosHome.landingCeldaOk}>
                      <IconoCheckCirculo color="var(--estado-exito)" tamano={16} /> Gratis
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Comisión por transacción</td>
                  <td className={estilosHome.landingCeldaDestacada}>1%</td>
                </tr>
                <tr>
                  <td>Pagos con QR</td>
                  <td>
                    <span className={estilosHome.landingCeldaOk}>
                      <IconoCheckCirculo color="var(--estado-exito)" tamano={16} /> Incluido
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Links de pago</td>
                  <td>
                    <span className={estilosHome.landingCeldaOk}>
                      <IconoCheckCirculo color="var(--estado-exito)" tamano={16} /> Incluido
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Dashboard con métricas</td>
                  <td>
                    <span className={estilosHome.landingCeldaOk}>
                      <IconoCheckCirculo color="var(--estado-exito)" tamano={16} /> Incluido
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Escrow / contratos</td>
                  <td>
                    <span className={estilosHome.landingCeldaOk}>
                      <IconoCheckCirculo color="var(--estado-exito)" tamano={16} /> Incluido
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Soporte</td>
                  <td>
                    <span className={estilosHome.landingCeldaOk}>
                      <IconoCheckCirculo color="var(--estado-exito)" tamano={16} /> Incluido
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className={estilosHome.landingPreciosNota}>
          Sin costos fijos mensuales. Solo pagás cuando cobrás.
        </p>
      </section>

      <section id="quienes-somos" className={estilosHome.landingSeccion} style={scroll}>
        <div className={estilosHome.landingEquipo}>
          <div>
            <span className={estilosHome.landingPildora}>Equipo</span>
            <h2 className={estilosHome.landingTituloSeccion}>Somos de LATAM. Vivimos el problema.</h2>
            <p className={estilosHome.landingEquipoTexto}>
              Somos un equipo cansado de que PayPal rechace pagos, los bancos hagan preguntas y los
              impuestos castiguen a quien trabaja con cripto. Construimos TrustPay para que cualquier
              negocio en Latinoamérica pueda cobrar en cripto de forma simple, rápida y segura.
            </p>
            <div className={estilosHome.landingEquipoAcciones}>
              <Link href="/api-docs" className={estilosHome.landingDocBotonSecundario}>
                Documentación técnica
              </Link>
            </div>
          </div>
          <div className={estilosHome.landingEquipoVisual} aria-hidden>
            <div className={estilosHome.landingEquipoMapa}>
              <span className={estilosHome.landingMapaPunto} style={{ top: "58%", left: "28%" }} />
              <span className={estilosHome.landingMapaPunto} style={{ top: "62%", left: "32%" }} />
              <span className={estilosHome.landingMapaPunto} style={{ top: "48%", left: "22%" }} />
              <span className={estilosHome.landingMapaPunto} style={{ top: "72%", left: "38%" }} />
            </div>
            <p className={estilosHome.landingEquipoMapaLeyenda}>Negocios conectados en la región</p>
          </div>
        </div>
      </section>

      <section className={estilosHome.seccionCtaFinal}>
        <h2 className={estilosHome.ctaFinalTitulo}>Empezá a cobrar hoy. Gratis.</h2>
        <p className={estilosHome.ctaFinalSub}>
          Unite a los primeros negocios en LATAM que cobran en cripto sin banco y sin burocracia.
        </p>
        <div className={estilosHome.landingCtaBotones}>
          <button
            type="button"
            className={estilosHome.botonPrimario}
            onClick={onCrearCuentaGratis}
          >
            Crear mi cuenta gratis
          </button>
          <Link
            href="/api-docs"
            className={`${estilosHome.botonSecundario} ${estilosHome.landingBotonLink}`}
          >
            Leer documentación
          </Link>
        </div>
      </section>
    </>
  );
}
