import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, CheckCircle, Loader2, Play, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticlesBackground from '../components/ParticlesBackground';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  video_url?: string;
}

const Agenda: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Estados para o Modal de Vídeo
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Função para converter link do YouTube em link de Embed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    return url;
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: regData } = await supabase
          .from('registrations')
          .select('event_id')
          .eq('user_id', session.user.id);
        
        setUserRegistrations(regData?.map(r => r.event_id) || []);
      }
    } catch (error: any) {
      toast.error("Erro ao carregar agenda", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Acesso negado", { description: "Você precisa estar logado para participar." });
      return;
    }

    setSubmittingId(eventId);
    try {
      const { error } = await supabase
        .from('registrations')
        .insert([{ user_id: session.user.id, event_id: eventId }]);

      if (error) {
        if (error.code === '23505') throw new Error("Você já está inscrito neste evento!");
        throw error;
      }

      toast.success("Inscrição confirmada!", { description: "Nos vemos em breve na nuvem! 🚀" });
      setUserRegistrations([...userRegistrations, eventId]);
    } catch (error: any) {
      toast.error("Falha na inscrição", { description: error.message });
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a061a] text-white font-sans selection:bg-purple-500/30">
      <ParticlesBackground />
      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold pb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
            Agenda de Eventos
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Prepare-se para os próximos lançamentos e encontros da nossa comunidade.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
          ) : events.length > 0 ? (
            events.map((event, index) => {
              const isRegistered = userRegistrations.includes(event.id);
              const isPastEvent = new Date(event.date) < new Date();
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:bg-white/[0.05] transition-all group ${isPastEvent ? 'opacity-90' : ''}`}
                >
                  <div className={`${isPastEvent ? 'bg-gray-600/20 text-gray-500' : 'bg-purple-600/20 text-purple-400'} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <CalendarIcon size={32} />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <h3 className={`text-2xl font-bold ${isPastEvent ? 'text-gray-400' : ''}`}>{event.title}</h3>
                      {isPastEvent && (
                        <span className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-500 uppercase font-bold">Encerrado</span>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><Clock size={16} className={isPastEvent ? 'text-gray-600' : 'text-purple-400'} /> {new Date(event.date).toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={16} className={isPastEvent ? 'text-gray-600' : 'text-purple-400'} /> {event.location}</span>
                    </div>
                    <p className="mt-4 text-gray-500 text-sm max-w-2xl">{event.description}</p>
                  </div>

                  {isPastEvent ? (
                    event.video_url ? (
                      <button
                        onClick={() => {
                          setSelectedVideoUrl(event.video_url!);
                          setIsVideoModalOpen(true);
                        }}
                        className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        <Play size={18} /> Ver gravação
                      </button>
                    ) : (
                      <button disabled className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed">
                        Finalizado
                      </button>
                    )
                  ) : (
                    <button
                      disabled={isRegistered || submittingId === event.id}
                      onClick={() => handleRegister(event.id)}
                      className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isRegistered 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                        : 'bg-white text-black hover:bg-purple-400 hover:text-white active:scale-95'
                      }`}
                    >
                      {submittingId === event.id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : isRegistered ? (
                        <><CheckCircle size={18} /> Inscrito</>
                      ) : (
                        'Inscrever-se'
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-gray-500">Nenhum evento agendado no momento. Fique atento!</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE VÍDEO LIGHTBOX */}
      <AnimatePresence>
        {isVideoModalOpen && selectedVideoUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            {/* Background Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-[#0a061a]/95 backdrop-blur-md"
            />
            
            {/* Container do Player - Adicionamos 'relative' aqui para o botão se basear nele */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl shadow-2xl z-10"
            >
              {/* BOTÃO FECHAR (Agora fora do player) */}
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-all flex items-center gap-2 group mb-2"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Fechar</span>
                <div className="bg-white/5 p-2 rounded-full border border-white/10 group-hover:bg-white/10 group-hover:rotate-90 transition-all">
                  <X size={24} />
                </div>
              </button>

              {/* Wrapper do Iframe com bordas arredondadas */}
              <div className="w-full aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10">
                <iframe
                  src={getEmbedUrl(selectedVideoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Cloud Club Video Player"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Agenda;