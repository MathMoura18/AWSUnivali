import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import LogoUnivali from '../assets/logo-mascote.png';

const Header: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const isExpanded = isHovered || isAtTop;

  useEffect(() => {
  const handleScroll = () => {
    setIsAtTop(window.scrollY === 0);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  return (
    <motion.header
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Animação de altura e fundo
      initial={false}
      animate={{ 
        height: isExpanded ? '80px' : '50px',
        backgroundColor: isExpanded ? 'rgba(10, 6, 26, 0.8)' : 'rgba(10, 6, 26, 0.3)',
        borderBottomColor: isExpanded ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.1)'
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-500 flex items-center shadow-lg"
    >
      <nav className="flex justify-between items-center px-10 w-full max-w-7xl mx-auto transition-all duration-500">
        
        {/* Logo que cresce levemente no hover */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img 
            initial={{ height: 28 }}
            animate={{ height: isExpanded ? 40 : 28 }}
            src={LogoUnivali} 
            className="w-auto transition-all" 
            alt="Logo AWS Univali" 
          />           
          <span className={`font-bold tracking-tight transition-all duration-300 ${isExpanded ? 'text-xl' : 'text-base'}`}>
            AWS <span className="text-purple-400">UNIVALI</span>
          </span>
        </Link>

        {/* Menu de Navegação */}
        <div className="flex items-center gap-8">
          <div className={`flex gap-8 text-sm font-medium text-gray-300 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-80'}`}>
            <Link to="/sobre" className="hover:text-purple-400 transition-colors">Sobre</Link>
            <a href="#" className="hidden sm:block hover:text-purple-400 transition-colors">Eventos</a>
            <a href="#" className="hidden sm:block hover:text-purple-400 transition-colors">Recursos</a>
          </div>

          {/* Botão que ganha destaque no hover */}
          <motion.button 
            animate={{ 
              scale: isExpanded ? 1 : 0.9,
              paddingLeft: isExpanded ? '24px' : '16px',
              paddingRight: isExpanded ? '24px' : '16px'
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white py-1.5 rounded-full font-bold text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            Participar
          </motion.button>
        </div>
      </nav>

      {/* Brilho sutil na borda inferior quando expandido */}
      {isExpanded && (
        <motion.div 
          layoutId="glow"
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"
        />
      )}
    </motion.header>
  );
};

export default Header;