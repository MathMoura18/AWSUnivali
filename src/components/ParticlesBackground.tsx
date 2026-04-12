import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const ParticlesBackground: React.FC = () => {
  const [init, setInit] = useState(false);

  // Inicializa o engine apenas uma vez na vida da aplicação
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // useMemo garante que o objeto de configuração não mude, 
  // evitando que as partículas reiniciem quando o estado de outros componentes mudar.
  const options: ISourceOptions = useMemo(() => ({
    background: {
      color: { value: "transparent" }, // Deixamos transparente para usar o BG do CSS
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 180,
          links: { opacity: 0.35 },
        },
      },
    },
    particles: {
      color: { value: ["#ffffff", "#a855f7", "#60a5fa"] },
      links: {
        color: "#a855f7",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
      number: {
        density: { enable: true, area: 800 },
        value: 200,
      },
      opacity: {
        value: { min: 0.1, max: 0.6 },
        animation: { enable: true, speed: 1, sync: false },
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

// React.memo evita re-renderizações desnecessárias
export default React.memo(ParticlesBackground);