import LogoUnivali from '../assets/logo-mascote.png';


const Header: React.FC = () => {
    return (
    <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <img src={LogoUnivali} className="h-15 w-auto" alt="Logo AWS Univali" />          
            <span className="font-bold text-xl tracking-tight">AWS <span className="text-purple-400">UNIVALI</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-purple-400 transition-colors">Sobre</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Eventos</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Recursos</a>
            <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full transition-all transform hover:scale-105">
            Participar
            </button>
        </div>
    </nav>
    );
          
};

export default Header;