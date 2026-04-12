import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/Sobre';
import Agenda from './pages/Agenda';
import Auth from './pages/Auth';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';

export default function App() {
  //const [session, setSession] = useState<any>(null);
  //const [userRole, setUserRole] = useState<string | null>(null);

  // useEffect(() => {
  //   // Pega a sessão atual
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     //setSession(session);
  //     if (session) fetchProfile(session.user.id);
  //   });

  //   // Escuta mudanças (Login/Logout)
  //   // const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  //   //   //setSession(session);
  //   //   if (session) fetchProfile(session.user.id);
  //   // });

  //   return () => subscription.unsubscribe();
  // }, []);

  // const fetchProfile = async (userId: string) => {
  //   const { data } = await supabase
  //     .from('profiles')
  //     .select('role')
  //     .eq('id', userId)
  //     .single();
    
  //   if (data) setUserRole(data.role);
  // };

  return (
    <>
      <Toaster 
          theme="dark" 
          position="top-right" 
          richColors 
          toastOptions={{
            style: { 
              background: 'rgba(15, 10, 31, 0.8)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              color: '#fff'
            },
          }}
        />
      <Router basename="/AWSUnivali/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}