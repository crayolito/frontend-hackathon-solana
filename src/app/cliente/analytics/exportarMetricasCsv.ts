import {
  agregarMetricasMisNegocios,
  obtenerEmbudoPagosMerchant,
  obtenerMetricasMisNegociosPagos,
  obtenerResumenEscrowMerchant,
} from "../../_lib/apiTrustpay";

/** CSV con KPIs, embudo y filas por negocio (datos reales del API). */
export async function generarCsvMetricasComercio(token: string): Promise<string> {
  const [agg, escrow, embudo, negocios] = await Promise.all([
    agregarMetricasMisNegocios(token),
    obtenerResumenEscrowMerchant(token),
    obtenerEmbudoPagosMerchant(token),
    obtenerMetricasMisNegociosPagos(token, { sort: "volume" }),
  ]);

  const lineas: string[] = [];
  lineas.push("seccion,campo,valor");
  lineas.push(`resumen,volumen_total_sol,${agg.volumenSol}`);
  lineas.push(`resumen,pagos_totales,${agg.totalPagos}`);
  lineas.push(`resumen,negocios_con_actividad,${agg.negociosConActividad}`);
  lineas.push(`resumen,negocios_registrados,${agg.totalNegocios}`);
  lineas.push(`escrow,sol_bloqueado,${escrow.totalLockedSol}`);
  lineas.push(`escrow,pagos_en_escrow,${escrow.paymentCount}`);

  for (const paso of embudo.steps) {
    lineas.push(
      `embudo,${paso.key}_count,${paso.count}`,
      `embudo,${paso.key}_pct_pipeline,${paso.percentOfFirst}`
    );
  }

  lineas.push("negocio,nombre,volumen_sol,cantidad_pagos");
  for (const n of negocios.data) {
    const nombre = n.businessName.replace(/"/g, '""');
    lineas.push(`negocio,"${nombre}",${n.volumeSol},${n.paymentCount}`);
  }

  return lineas.join("\n");
}
