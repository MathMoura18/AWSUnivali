import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { User, Mail, Save, Loader2, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';
import ParticlesBackground from '../components/ParticlesBackground';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  
  // Estados dos Formulários
  const [profile, setProfile] = useState({ 
    full_name: '', 
    email: '', 
    role: '',
    provider: ''
    });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;

      setProfile({ 
        full_name: data.full_name || '', 
        email: session.user.email || '', 
        role: data.role || 'user',
        // Captura se o login foi 'github', 'google' ou 'email'
        provider: session.user.app_metadata.provider || 'email' 
      });
    }
  } catch (error: any) {
    toast.error("Erro ao carregar perfil");
  } finally { setLoading(false); }
}

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from('profiles').update({ full_name: profile.full_name }).eq('id', session?.user.id);
      if (error) throw error;
      toast.success("Nome atualizado!");
    } catch (error: any) {
      toast.error(error.message);
    } finally { setUpdating(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validação básica de campos
    if (passwords.next !== passwords.confirm) {
        toast.error("As novas senhas não coincidem!");
        return;
    }

    if (passwords.next.length < 6) {
        toast.error("A nova senha deve ter pelo menos 6 caracteres!");
        return;
    }

    setChangingPass(true);

    try {
        // 2. PASSO CRUCIAL: Reautenticação (Valida a senha atual)
        // Isso tenta fazer um "check" com o e-mail do usuário e a senha que ele digitou no campo 'current'
        const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: passwords.current,
        });

        if (reauthError) {
        throw new Error("A senha atual está incorreta. Verifique e tente novamente.");
        }

        // 3. Se passou pela reautenticação, agora sim atualizamos a senha
        const { error: updateError } = await supabase.auth.updateUser({ 
        password: passwords.next 
        });

        if (updateError) throw updateError;

        toast.success("Senha alterada com sucesso!");
        setPasswords({ current: '', next: '', confirm: '' }); // Limpa os campos

    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setChangingPass(false);
    }
    };

  if (loading) return <div className="min-h-screen bg-[#0a061a] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#0a061a] text-white pt-32 pb-12 px-4 relative overflow-hidden">
      <ParticlesBackground />
      <Header />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* COLUNA ESQUERDA: DADOS PESSOAIS */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-3xl font-black border border-white/10 shadow-xl">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name || 'Usuário'}</h1>
                <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">{profile.role}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase ml-2 mb-2"><User size={14}/> Nome Completo</label>
                <input required type="text" value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-purple-500 outline-none transition-all" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase ml-2 mb-2"><Mail size={14}/> E-mail</label>
                <input disabled type="email" value={profile.email} className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-gray-500 cursor-not-allowed outline-none" />
              </div>
              <button type="submit" disabled={updating} className="w-full bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                {updating ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Salvar Alterações</>}
              </button>
            </form>
          </motion.div>

          {/* COLUNA DIREITA: SEGURANÇA / SENHA */}
          {profile.provider === 'email' ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <Lock className="text-purple-400" size={24} /> Segurança da Conta
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Senha Atual</label>
                    <input required type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-red-500/50 outline-none transition-all mt-1" placeholder="••••••••" />
                </div>
                
                <div className="pt-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Nova Senha</label>
                    <input required type="password" value={passwords.next} onChange={(e) => setPasswords({...passwords, next: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-purple-500 outline-none transition-all mt-1" placeholder="Mínimo 6 caracteres" />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Confirmar Nova Senha</label>
                    <input required type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-purple-500 outline-none transition-all mt-1" placeholder="Repita a nova senha" />
                </div>

                <button type="submit" disabled={changingPass} className="w-full bg-transparent border border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mt-4">
                    {changingPass ? <Loader2 className="animate-spin" size={20} /> : <><Shield size={20} /> Atualizar Senha</>}
                </button>
                </form>

                <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3 items-start">
                <Shield size={18} className="text-blue-400 mt-1 shrink-0" />
                <p className="text-[11px] text-gray-400 leading-relaxed">
                    A sua senha deve ter pelo menos 6 caracteres e incluir símbolos para maior segurança. Ao alterar, você não será deslogado da sessão atual.
                </p>
                </div>
            </motion.div>
          ) : (
            <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl flex flex-col items-center text-center justify-center min-h-[400px]"
            >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Shield className="text-blue-400" size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">Login via {profile.provider}</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                Sua conta está vinculada ao **GitHub**. A gestão de senha e segurança é feita diretamente na plataforma externa.
                </p>
                <a 
                href="https://github.com/settings/security" 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest"
                >
                Configurações do GitHub →
                </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;