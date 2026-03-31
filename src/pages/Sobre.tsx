import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

import { Rocket, Target, Heart } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesOptions: ISourceOptions = {
        background: { color: { value: "#0a061a" } },
        fpsLimit: 120,
        particles: {
            color: { value: ["#ffffff", "#a855f7"] },
            links: { color: "#a855f7", distance: 150, enable: true, opacity: 0.1 },
            move: { enable: true, speed: 0.6 },
            number: { density: { enable: true }, value: 80 },
            opacity: { value: { min: 0.1, max: 0.5 } },
            size: { value: { min: 1, max: 2 } },
        },
        detectRetina: true,
    };

    return (
        <div className="min-h-screen bg-[#0a061a] text-white font-sans selection:bg-purple-500/30">
            {init && (
                <Particles id="tsparticles" options={particlesOptions} className="fixed inset-0 z-0" />
            )}

            {/* Nebulosas de Fundo */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-[100px]" />
            </div>

            <Header />

            <main className="relative z-10 pt-20">
                {/* Hero Section - Sobre Nós */}
                <section className="max-w-5xl mx-auto px-8 text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-purple-400 font-mono tracking-widest uppercase mb-4">Nossa Odisséia</h2>
                        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-400">
                            Expandindo Horizontes <br /> na Nuvem AWS
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
                            O Cloud Club Univali nasceu da paixão por tecnologia e do desejo de conectar 
                            estudantes ao ecossistema da AWS. Não somos apenas um grupo de estudos; somos 
                            uma tripulação focada em transformar curiosidade em carreira.
                        </p>
                    </motion.div>
                </section>

                {/* Seção de Valores/Missão */}
                <section className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
                                <Target className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Nossa Missão</h3>
                                <p className="text-gray-400">Democratizar o acesso ao conhecimento de computação em nuvem e preparar talentos para o mercado global.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                                <Heart className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Comunidade</h3>
                                <p className="text-gray-400">Acreditamos no aprendizado colaborativo. Juntos, superamos desafios técnicos e construímos soluções reais.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/40">
                                <Rocket className="text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Inovação</h3>
                                <p className="text-gray-400">Estar na vanguarda da tecnologia AWS, explorando IA, Serverless e Arquiteturas Escaláveis.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Lado Criativo - "Portal" */}
                    <motion.div 
                        initial={{ opacity: 0, rotate: -5 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                        className="relative p-1 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-[2rem] overflow-hidden"
                    >
                        <div className="bg-[#0a061a] rounded-[1.9rem] p-8 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-purple-600/5 group-hover:bg-purple-600/10 transition-colors" />
                            <h4 className="text-5xl font-black text-white/5 absolute -bottom-4 -right-4 select-none">UNIVALI</h4>
                            <p className="text-gray-300 italic text-lg relative z-10">
                                "Onde a teoria da sala de aula encontra o poder infinito da nuvem AWS."
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Call to Action Final */}
                <section className="max-w-4xl mx-auto px-8 py-24 text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-b from-purple-900/30 to-transparent border border-purple-500/20">
                        <h2 className="text-3xl font-bold mb-6">Pronto para decolar?</h2>
                        <p className="text-gray-400 mb-8">Nossa comunidade está sempre aberta para novos exploradores.</p>
                        <button className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                            Juntar-se ao Time
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;