import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ParticlesBackground from '../components/ParticlesBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Calendar, Users, Eye, CheckCircle, 
  X, Plus, Save, Loader2, Trash2, AlertTriangle
} from 'lucide-react';
import Header from '../components/Header';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para Modais
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventInscritos, setEventInscritos] = useState<any[]>([]);
  const [loadingInscritos, setLoadingInscritos] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form de Evento
  const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '', video_url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      const fullProfile = { ...session.user, ...profileData };
      setProfile(fullProfile);

      if (profileData?.role === 'admin') {
        const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
        setEvents(data || []);
      } else {
        const { data: userEvents } = await supabase.from('registrations').select('*, events(*)').eq('user_id', session.user.id);
        setEvents(userEvents?.map(r => r.events) || []);
      }
    }
    setLoading(false);
  };

  // --- Lógica de Admin ---

    const handleOpenEventModal = (event: any = null) => {
        if (event) {
            setSelectedEvent(event);
            
            // TRATAMENTO DA DATA:
            // O banco retorna "2026-10-15T19:00:00+00:00"
            // O input date precisa de "2026-10-15"
            const formattedDate = event.date ? event.date.split('T')[0] : '';

            setFormData({ 
            title: event.title, 
            date: formattedDate, // Agora o datepicker vai reconhecer!
            location: event.location, 
            description: event.description || '',
            video_url: event.video_url || ''
            });
        } else {
            setSelectedEvent(null);
            setFormData({ title: '', date: '', location: '', description: '', video_url: '' });
        }
        setIsEventModalOpen(true);
    };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Se for "Novo", o selectedEvent é null. Se for "Editar", ele tem o ID.
    const id = selectedEvent?.id;

    const dataToSave = {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        date: new Date(formData.date).toISOString()
    };

    const query = id 
        ? supabase.from('events').update(dataToSave).eq('id', id)
        : supabase.from('events').insert([dataToSave]);

    const { error } = await query;

    if (error) {
        console.error("Erro completo:", error);
        toast.error("Erro ao salvar: " + error.message);
    } else {
        toast.success(id ? "Evento atualizado!" : "Evento criado!");
        setIsEventModalOpen(false);
        fetchData(); // Recarrega a lista
    }
    };

    const handleViewInscritos = async (event: any) => {
      setSelectedEvent(event);
      setIsUsersModalOpen(true);
      setLoadingInscritos(true);
      
      try {
          const { data, error } = await supabase
          .from('registrations')
          .select(`
              created_at,
              profiles:user_id (
              full_name,
              email
              )
          `)
          .eq('event_id', event.id);
          
          if (error) throw error;

          // Se o console mostrar dados aqui, a função está OK!
          console.log("Inscritos encontrados:", data);
          setEventInscritos(data || []);
      } catch (err: any) {
          console.error("Erro ao buscar inscritos:", err);
          toast.error("Erro ao carregar lista.");
      } finally {
          setLoadingInscritos(false);
      }
    };

    const confirmDelete = (event: any) => {
      setSelectedEvent(event);
      setIsDeleteModalOpen(true);
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        setIsDeleting(true);

        try {
          const { error } = await supabase.from('events').delete().eq('id', selectedEvent.id);
          if (error) throw error;
          
          toast.success("Evento removido com sucesso!");
          setIsDeleteModalOpen(false);
          fetchData();
        } catch (error: any) {
          toast.error("Erro ao excluir: " + error.message);
        } finally {
          setIsDeleting(false);
        }
      };

  if (loading) return <div className="min-h-screen bg-[#0a061a] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a061a] text-white pt-28 pb-12 px-4 relative overflow-hidden">
      <ParticlesBackground />
      <Header />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER DO PERFIL (Mesmo código anterior) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-3xl font-black border-4 border-white/10">
            {profile?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
              <Mail size={14} /> {profile?.email}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${isAdmin ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'} font-bold text-xs uppercase tracking-widest`}>
            {isAdmin ? 'Acesso Administrativo' : 'Membro AWS'}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* COLUNA DE DADOS USUÁRIO (Omitida para focar no Admin) */}
          {!isAdmin && (
            <div className="space-y-6">
                {/* ... mesmo código anterior de Recursos AWS e Frequência ... */}
            </div>
          )}

          {/* LISTA DE EVENTOS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${isAdmin ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-6`}>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">{isAdmin ? 'Gerenciamento de eventos' : 'Minha Agenda'}</h3>
                {isAdmin && (
                  <button 
                    onClick={() => handleOpenEventModal()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Novo Evento
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {events.map((event) => (
                  <div key={event.id} className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-purple-500/40 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400"><Calendar size={32} /></div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-lg font-bold group-hover:text-purple-300 transition-colors">{event.title}</h4>
                      <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                    </div>
                    <div className="flex gap-3">
                      {isAdmin ? (
                        <>
                          <button onClick={() => handleViewInscritos(event)} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/5"><Users size={16} /> Inscritos</button>
                          <button onClick={() => handleOpenEventModal(event)} className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-3 rounded-xl text-xs font-bold transition-all border border-blue-500/20"><Eye size={16} /> Editar</button>
                          <button onClick={() => confirmDelete(event)} className="bg-red-500/20 hover:bg-red-500/30 text-red-500 p-3 rounded-xl transition-all border border-red-500/20"><Trash2 size={16} /></button>                        </>
                      ) : (
                        <div className="text-green-400 bg-green-400/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><CheckCircle size={14} /> Confirmado</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* LISTA DE RECURSOS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${isAdmin ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-6`}>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">{isAdmin ? 'Gerenciamento de Recursos' : 'Meus Recursos'}</h3>
                {isAdmin && (
                  <button 
                    onClick={() => handleOpenEventModal()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Novo Recurso
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {events.map((event) => (
                  <div key={event.id} className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-purple-500/40 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400"><Calendar size={32} /></div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-lg font-bold group-hover:text-purple-300 transition-colors">{event.title}</h4>
                      <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                    </div>
                    <div className="flex gap-3">
                      {isAdmin ? (
                        <>
                          <button onClick={() => handleViewInscritos(event)} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/5"><Users size={16} /> Inscritos</button>
                          <button onClick={() => handleOpenEventModal(event)} className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-3 rounded-xl text-xs font-bold transition-all border border-blue-500/20"><Eye size={16} /> Editar</button>
                        </>
                      ) : (
                        <div className="text-green-400 bg-green-400/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><CheckCircle size={14} /> Confirmado</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* LISTA DE Notícias */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${isAdmin ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-6`}>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">{isAdmin ? 'Gerenciamento de Notícias' : 'Minhas notícias salvas'}</h3>
                {isAdmin && (
                  <button 
                    onClick={() => handleOpenEventModal()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Nova Notícia
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {events.map((event) => (
                  <div key={event.id} className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-purple-500/40 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400"><Calendar size={32} /></div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-lg font-bold group-hover:text-purple-300 transition-colors">{event.title}</h4>
                      <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                    </div>
                    <div className="flex gap-3">
                      {isAdmin ? (
                        <>
                          <button onClick={() => handleViewInscritos(event)} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/5"><Users size={16} /> Inscritos</button>
                          <button onClick={() => handleOpenEventModal(event)} className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-3 rounded-xl text-xs font-bold transition-all border border-blue-500/20"><Eye size={16} /> Editar</button>
                        </>
                      ) : (
                        <div className="text-green-400 bg-green-400/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><CheckCircle size={14} /> Confirmado</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- MODAL DE CONFIRMAÇÃO DE DELEÇÃO (ESTILO APPLE/MODERNO) --- */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#1a1435] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm text-center shadow-3xl"
            >
              <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Excluir Evento?</h2>
              <p className="text-gray-400 text-sm mb-8">Esta ação é irreversível. O evento <span className="text-white font-bold">"{selectedEvent?.title}"</span> e todos os dados relacionados serão perdidos.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  disabled={isDeleting}
                  onClick={handleDeleteEvent}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Sim, excluir permanentemente"}
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl font-bold transition-all text-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DE EVENTO (CRIAR/EDITAR) --- */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEventModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.form 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleSaveEvent}
              className="relative bg-[#16112e] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">{selectedEvent ? 'Editar Evento' : 'Novo Evento'}</h2>
              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2">Título</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mt-1 focus:border-purple-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Data</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mt-1 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Local</label>
                    <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mt-1 focus:border-purple-500 outline-none" />
                  </div>
                </div>
                <div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Descrição</label>
                        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mt-1 focus:border-purple-500 outline-none h-40"/>
                    </div>
                </div>
                {/* Adicione este campo abaixo da Descrição */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Link do Vídeo (Opcional)</label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-purple-500 outline-none"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mt-4"><Save size={18} /> Salvar Evento</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DE INSCRITOS --- */}
      <AnimatePresence>
        {isUsersModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUsersModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="relative bg-[#16112e] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Inscritos: <span className="text-purple-400">{selectedEvent?.title}</span></h2>
                <button onClick={() => setIsUsersModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
              </div>
              
              {loadingInscritos ? <Loader2 className="animate-spin mx-auto my-10" /> : (
                <div className="space-y-3">
                  {eventInscritos.length > 0 ? eventInscritos.map((reg, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <p className="font-bold">{reg.profiles.full_name}</p>
                        <p className="text-xs text-gray-400">{reg.profiles.email}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase">{new Date(reg.created_at).toLocaleDateString()}</span>
                    </div>
                  )) : <p className="text-center text-gray-500 my-10">Ninguém inscrito ainda.</p>}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;