import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';

import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // Use slim para performance

import { Cloud, Cpu, Database, Globe, Users, Calendar, ArrowRight } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';

// Variantes de animação para os cards
const cardVariants: Variants = {
  offscreen: { 
    y: 50, 
    opacity: 0 
  },
  onscreen: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      bounce: 0.4, 
      duration: 0.8 
    }
  }
};

const Home: React.FC = () => {
    const [ init, setInit ] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
        // loadSlim carrega os recursos básicos (estrelas, conexões, etc.)
        await loadSlim(engine);
        }).then(() => {
        setInit(true);
        });
    }, []);

    const particlesOptions: ISourceOptions = {
        background: {
        color: {
            value: "#0a061a", // Fundo ultra-dark espacial
        },
        },
        fpsLimit: 120,
        interactivity: {
        events: {
            onClick: {
            enable: true,
            mode: "push", // Cria mais estrelas ao clicar
            },
            onHover: {
            enable: true,
            mode: "grab", // Cria "conexões" (teia) que seguem o mouse
            },
        },
        modes: {
            push: {
            quantity: 4,
            },
            grab: {
            distance: 200, // Distância da teia do mouse
            links: {
                opacity: 0.3, // Opacidade das conexões
            },
            },
        },
        },
        particles: {
        color: {
            value: ["#ffffff", "#a855f7", "#60a5fa"], // Estrelas brancas, roxas e azuis
        },
        links: {
            color: "#a855f7", // Cor das conexões
            distance: 150,
            enable: true, // Habilita a "rede" de constelações
            opacity: 0.15,
            width: 1,
        },
        move: {
            direction: "none",
            enable: true, // Estrelas se movem suavemente
            outModes: {
            default: "bounce",
            },
            random: true,
            speed: 1, // Velocidade lenta e relaxante
            straight: false,
        },
        number: {
            density: {
            enable: true,
            },
            value: 120, // Quantidade de estrelas
        },
        opacity: {
            value: { min: 0.1, max: 0.8 }, // Brilho variável (cintilante)
            animation: {
            enable: true,
            speed: 1,
            sync: false,
            },
        },
        shape: {
            type: "circle",
        },
        size: {
            value: { min: 1, max: 3 }, // Tamanhos variados
        },
        },
        detectRetina: true,
    };

return (
    <div className="min-h-screen bg-[#0a061a] text-white font-sans selection:bg-purple-500/30">
        {init && (
            <Particles
            id="tsparticles"
            options={particlesOptions}
            className="fixed inset-0 z-0" // Garante que fique no fundo e fixo
            />
        )}

        {/* NEBULOSAS FIXAS (GRADIENTES BLUR) PARA PROFUNDIDADE */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/15 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[120px]" />
        </div>

      <Header />

    {/* Hero Section */}
    <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-500">
            Explore o Universo <br /> da Nuvem
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Conecte-se com a comunidade AWS na Univali. Aprenda computação em nuvem, 
            participe de workshops e impulsione sua carreira tech.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-[#0a061a] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-100 transition-all group">
              Começar Jornada <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-purple-500/50 bg-purple-500/10 px-8 py-4 rounded-xl font-bold hover:bg-purple-500/20 transition-all">
              Ver Agenda
            </button>
          </div>
        </motion.div>

        {/* Floating Elements Representing AWS Services */}
        <div className="relative mt-40 h-[400px] hidden lg:block max-w-6xl mx-auto">            
            <FloatingIcon icon={<Cpu size={120}/>} label="Compute" delay={0} x="-180px" y="0px" />
            <FloatingIcon icon={<Database size={120}/>} label="Network" delay={0.5} x="0px" y="-60px" />
            <FloatingIcon icon={<Globe size={120}/>} label="Storage" delay={1} x="180px" y="0px" />
        </div>
    </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Users className="text-purple-400" />}
            title="Networking"
            desc="Conecte-se com alunos e profissionais apaixonados por tecnologia AWS."
          />
          <FeatureCard 
            icon={<Calendar className="text-orange-400" />}
            title="Eventos Mensais"
            desc="Workshops práticos, meetups e maratonas de aprendizado (Jam Sessions)."
          />
          <FeatureCard 
            icon={<Cloud className="text-blue-400" />}
            title="Certificações"
            desc="Grupos de estudo focados em Cloud Practitioner e Solutions Architect."
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Sub-componente para Ícones Flutuantes
const FloatingIcon = ({ icon, label, delay, x, y }: any) => (
  <motion.div
    initial={{ x, y, opacity: 0 }}
    animate={{ 
      y: [y, (parseInt(y) - 30) + "px", y],
      opacity: 1 
    }}
    transition={{ 
      y: { duration: 4, repeat: Infinity, delay, ease: "easeInOut" },
      opacity: { duration: 1 }
    }}
    // absolute + left-1/2 + -translate-x-1/2 é o combo que centraliza
    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
    style={{ marginLeft: x }} // O X agora atua como um "offset" do centro
  >
    <div className="p-10 bg-purple-900/20 backdrop-blur-xl border border-purple-500/30 rounded-[3rem] shadow-[0_0_50px_rgba(168,85,247,0.2)] flex items-center justify-center text-purple-400">
      {icon}
    </div>
    <span className="text-lg font-bold font-mono text-purple-300 uppercase tracking-[0.4em]">{label}</span>
  </motion.div>
);

// Sub-componente para os Cards de Funcionalidades
const FeatureCard = ({ icon, title, desc }: any) => (
  <motion.div 
    variants={cardVariants}
    initial="offscreen"
    whileInView="onscreen"
    viewport={{ once: true, amount: 0.8 }}
    className="p-8 rounded-3xl bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/10 hover:border-purple-500/40 transition-all group"
  >
    <div className="mb-4 p-3 bg-gray-900/50 rounded-lg inline-block group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;