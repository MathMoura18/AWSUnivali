import React, { useEffect, useState, useRef } from 'react';
import LogoUnivali from '../assets/logo-mascote.png'; 
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false); // Controle do Menu
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Busca sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setUserName(session.user.user_metadata?.full_name || 'Explorador');
      }
    });

    // Escuta mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setUserName(session?.user.user_metadata?.full_name ?? '');
    });

    // Fecha o menu ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a061a]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="flex items-center text-xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
          <motion.img 
            src={LogoUnivali} 
            className="w-10 transition-all mr-2" 
            alt="Logo AWS Univali" 
          />
          AWS <span className="text-purple-500 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 ml-1.5">CLOUD CLUB</span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-400">
            <Link to="/sobre" className="hover:text-purple-400 transition-colors">Sobre</Link>
            <Link to="/agenda" className="hover:text-purple-400 transition-colors">Agenda</Link>
            <Link to="/" className="hover:text-purple-400 transition-colors">Recursos</Link>
            <Link to="/" className="hover:text-purple-400 transition-colors">Equipe</Link>
            <Link to="/" className="hover:text-purple-400 transition-colors">Notícias</Link>
          </nav>

          {user ? (
            /* Menu Expandível do Usuário */
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 pr-4 rounded-full transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-purple-500/20">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-gray-200 hidden sm:block">
                  {userName.split(' ')[0]}
                </span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Animado */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-[#16112e] border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden backdrop-blur-xl"
                  >
                    <Link to="/perfil">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 rounded-xl transition-colors">
                      <User size={16} className="text-purple-400" /> Perfil
                    </button>
                    </Link>
                    
                    <Link to="/dashboard">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 rounded-xl transition-colors">
                        <LayoutDashboard size={16} className="text-blue-400" /> Dashboard
                      </button>
                    </Link>
                    <div className="h-[1px] bg-white/5 my-2 mx-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Sair da Base
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-[#0a061a] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              Participar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;