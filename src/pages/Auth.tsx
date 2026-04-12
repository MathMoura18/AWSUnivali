import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

import { useNavigate } from 'react-router-dom';

import { Mail, Lock, User, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { toast } from 'sonner';
import { Rocket } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const translateError = (msg: string) => {
    if (msg.includes('Invalid login credentials')) return 'E-mail ou senha inválidos.';
    if (msg.includes('User already registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('Password should be at least 6 characters')) return 'A senha deve ter pelo menos 6 caracteres.';
    return 'Ocorreu um erro inesperado. Tente novamente.';
  };

  // Lógica de Autenticação
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('E-mail ou senha incorretos. Tente novamente.');
          } 

          throw error;
        }

        toast.success('Acesso Autorizado', {
          description: 'Bem-vindo de volta à base, comandante.',
          icon: <Rocket className="text-purple-400" size={20} />,
        });

        setTimeout(() => {
          navigate('/'); // Mude para o path da sua Home
        }, 2000);

      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;

        toast.info('Verifique seu E-mail', {
          description: 'Enviamos um link de ativação para sua órbita.',
          icon: <Mail className="text-blue-400" size={20} />,
        });

        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
        }, 1500);
      }
    } catch (err: any) {
      toast.error(translateError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a061a] text-white font-sans flex items-center justify-center p-4 overflow-hidden">
      <ParticlesBackground />

      {/* Brilho de Fundo Estilizado */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto relative z-10">
      {/* Botão Voltar */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
      >
        
        {/* Painel de Boas-Vindas (Esquerda) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-900/30 to-transparent">
          <motion.div
            key={isLogin ? 'txt-login' : 'txt-signup'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30 mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Sparkles className="text-purple-400" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              {isLogin ? "Sua jornada continua aqui." : "Explore o Universo Cloud."}
            </h2>
            <p className="text-gray-400 text-lg">
              {isLogin 
                ? "Conecte-se para acessar seus projetos e a comunidade AWS Univali." 
                : "Crie sua conta e comece a construir o futuro na nuvem conosco."}
            </p>
          </motion.div>
        </div>

        {/* Formulário (Direita) */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold">{isLogin ? "Login" : "Cadastro"}</h3>
            <p className="text-gray-400 text-sm">Insira seus dados para entrar na órbita.</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-purple-400">Nome</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-purple-400">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-purple-400">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group transition-all active:scale-95"
            >
              {loading ? "Processando..." : (isLogin ? "Acessar Plataforma" : "Criar Conta")}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 text-gray-600 text-xs uppercase font-bold">
              <div className="h-[1px] bg-white/10 flex-1"></div>
              <span>ou</span>
              <div className="h-[1px] bg-white/10 flex-1"></div>
            </div>

            <button 
              onClick={handleGithubLogin}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-3 transition-all group/gh"
            >
              <FontAwesomeIcon icon={faGithub} className="text-xl group-hover/gh:text-purple-400 transition-colors" />
              <span className="text-sm font-medium">Entrar com GitHub</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            {isLogin ? "Novo por aqui?" : "Já tem uma conta?"} {" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 font-bold hover:text-purple-300 transition-colors hover:underline"
            >
              {isLogin ? "Crie sua conta" : "Faça login"}
            </button>
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Auth;