"use client";

// Grafico de lineas (SOL + USDC) para la seccion Analitica; usa Chart.js en el cliente.
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import estilos from "./contenido-analitica-central.module.css";

export default function GraficoVolumenTendenciasAnalitica() {
  const referenciaCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = referenciaCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradienteSol = ctx.createLinearGradient(0, 0, 0, 300);
    gradienteSol.addColorStop(0, "rgba(153, 69, 255, 0.4)");
    gradienteSol.addColorStop(1, "rgba(153, 69, 255, 0)");

    const gradienteUsdc = ctx.createLinearGradient(0, 0, 0, 300);
    gradienteUsdc.addColorStop(0, "rgba(96, 165, 250, 0.4)");
    gradienteUsdc.addColorStop(1, "rgba(96, 165, 250, 0)");

    const grafico = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["01 ene", "05 ene", "10 ene", "15 ene", "20 ene", "25 ene", "30 ene"],
        datasets: [
          {
            label: "Volumen SOL",
            data: [450, 520, 480, 610, 590, 720, 680],
            borderColor: "#9945FF",
            backgroundColor: gradienteSol,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
          },
          {
            label: "Volumen USDC",
            data: [300, 350, 320, 450, 400, 550, 510],
            borderColor: "#60A5FA",
            backgroundColor: gradienteUsdc,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "#F3F4F6",
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });

    return () => {
      grafico.destroy();
    };
  }, []);

  return (
    <div className={estilos.contenedorCanvas}>
      <canvas ref={referenciaCanvas} />
    </div>
  );
}
