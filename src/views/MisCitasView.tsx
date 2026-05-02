import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Scissors, 
  Star, 
  ChevronRight, 
  X,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MisCitasView = () => {
  const { userData } = useAuth();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCita, setSelectedCita] = useState<any>(null);

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           // Filter by current user email if logged in
           const userCitas = userData?.email 
             ? data.filter(b => b.guestEmail === userData.email)
             : data; // For demo show all if no user
           setCitas(userCitas);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      });
  }, [userData]);

  return (
    <div className="min-h-screen p-6 lg:p-16">
      <div className="max-w-5xl mx-auto">
        
        {/* ── HEADER ── */}
        <header className="mb-16">
           <div className="label text-gold mb-4">Concierge Personal</div>
           <h1 className="editorial-title text-4xl lg:text-6xl">Mi Historial de <br /> <em className="text-gold italic">Experiencias.</em></h1>
           <p className="text-char/40 font-serif italic text-lg mt-4">Gestión de sus citas exclusivas y registro de belleza.</p>
        </header>

        {/* ── CONTENT ── */}
        <div className="space-y-10">
           {loading ? (
             Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 loading-shimmer rounded-[3rem]"></div>)
           ) : citas.length > 0 ? citas.map((cita, i) => (
             
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={cita.id} 
            onClick={() => setSelectedCita(cita)}
            className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-border shadow-lux group hover:border-gold transition-all relative overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1"
             >
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10"> 
                   <div className="w-full lg:w-40 h-40 bg-cream rounded-[2.5rem] flex items-center justify-center text-gold border border-border/50 group-hover:scale-105 transition-transform">
                      <Star size={40} className="opacity-20" />
                   </div>
                   
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                         <span className={`text-[0.6rem] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full ${
                            cita.status === 'CONFIRMED' ? 'bg-char text-white' : 'bg-gold/10 text-gold-d'
                         }`}>
                           {cita.status}
                         </span>
                         <span className="text-[0.6rem] text-char/20 font-bold uppercase tracking-widest">REF: #{cita.id.slice(-6).toUpperCase()}</span>
                      </div>

                      <h3 className="font-serif text-3xl">{cita.servicesJson ? JSON.parse(cita.servicesJson).length : 1} Servicio(s) Majestad</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                         <div className="flex items-center gap-3">
                            <Calendar size={14} className="text-gold" />
                            <span className="text-[0.65rem] uppercase tracking-widest font-bold text-char/50">{new Date(cita.dateTime).toLocaleDateString()}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <Clock size={14} className="text-gold" />
                            <span className="text-[0.65rem] uppercase tracking-widest font-bold text-char/50">{new Date(cita.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hrs</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <MapPin size={14} className="text-gold" />
                            <span className="text-[0.65rem] uppercase tracking-widest font-bold text-char/50">{cita.modality}</span>
                         </div>
                      </div>
                   </div>

                   <div className="text-center lg:text-right space-y-4">
                      <div className="font-serif text-3xl text-gold">${cita.totalPrice?.toLocaleString()}</div>
                      <div className="flex gap-3 justify-center lg:justify-end">
                         <button className="btn btn-outline !py-3 !px-6 !text-[0.6rem]">Detalles</button>
                         <button className="btn btn-dark !py-3 !px-6 !text-[0.6rem]">Reagendar</button>
                      </div>
                   </div>
                </div>
                
                {/* Status indicator line */}
                <div className={`absolute bottom-0 left-0 h-1 transition-all group-hover:h-2 ${cita.status === 'CONFIRMED' ? 'w-full bg-char' : 'w-1/3 bg-gold'}`}></div>
             </motion.div>
           )) : (
             <div className="py-32 text-center space-y-8 bg-white rounded-[4rem] border border-border border-dashed">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto text-gold/30">
                   <Calendar size={40} />
                </div>
                <div className="space-y-2">
                   <h3 className="font-serif text-2xl italic">Sin actividad registrada.</h3>
                   <p className="text-char/30 text-[0.65rem] uppercase tracking-[0.2em] font-bold">Inicie su tratamiento curado hoy mismo.</p>
                </div>
                <button className="btn btn-gold !py-5 !px-12">Reservar ahora</button>
             </div>
           )}
        </div>

        {/* ── FOOTER HELP ── */}
        <div className="mt-20 p-10 bg-char text-white rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-gold">
                 <MessageSquare size={24} />
              </div>
              <div className="space-y-1">
                 <div className="text-[0.6rem] uppercase tracking-widest text-gold font-bold">Asesoría de Beauty</div>
                 <div className="font-serif text-xl">¿Dudas sobre su próximo servicio?</div>
              </div>
           </div>
           <button className="btn btn-gold !py-4 !px-10 font-bold uppercase tracking-widest text-[0.65rem]">Contactar Concierge</button>
        </div>

      </div>

      <AnimatePresence>
        {selectedCita && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-char/60 backdrop-blur-sm p-6"
            onClick={() => setSelectedCita(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-[3.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl p-10 lg:p-14 border border-border"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedCita(null)} className="absolute top-8 right-8 p-3 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10 border border-border">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-6 mb-10 border-b border-border pb-8">
                <div className="w-20 h-20 bg-cream rounded-[2.5rem] flex items-center justify-center text-gold border border-border/50">
                  <Star size={30} className="opacity-40" />
                </div>
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl mb-2">{selectedCita.guestName || "Majestad"}</h2>
                  <div className="text-[0.65rem] uppercase tracking-widest font-bold px-3 py-1 bg-gold/10 text-gold-d inline-block rounded-full">{selectedCita.status}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-ivory border border-border p-6 rounded-3xl">
                   <div className="flex items-center gap-3 text-gold mb-3"><Calendar size={18} /> <span className="text-[0.65rem] uppercase tracking-widest font-bold">Fecha / Hora</span></div>
                   <div className="font-serif text-xl">{new Date(selectedCita.dateTime).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</div>
                </div>
                <div className="bg-ivory border border-border p-6 rounded-3xl">
                   <div className="flex items-center gap-3 text-gold mb-3"><MapPin size={18} /> <span className="text-[0.65rem] uppercase tracking-widest font-bold">Modalidad</span></div>
                   <div className="font-serif text-xl">{selectedCita.modality}</div>
                   {selectedCita.address && <div className="text-xs text-gray mt-2">{selectedCita.address}</div>}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-[0.65rem] uppercase tracking-[0.2em] text-gray mb-4 font-bold">Servicios Contratados</h3>
                <div className="space-y-4">
                   {selectedCita.servicesJson ? JSON.parse(selectedCita.servicesJson).map((s:any, idx:number) => (
                     <div key={idx} className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-border shadow-sm">
                        <div className="font-medium text-char">{s.name}</div>
                        <div className="text-sm font-serif text-gold-d">${s.price?.toLocaleString()}</div>
                     </div>
                   )) : <div className="text-sm italic text-gray">Reserva sin desglose de servicios</div>}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-8 mb-10">
                <div className="text-[0.65rem] uppercase tracking-widest text-gray font-bold w-full flex justify-between items-center">
                  <span>Total a Pagar</span>
                  <span className="font-serif text-3xl text-char ml-6">${(selectedCita.totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button onClick={() => setSelectedCita(null)} className="btn btn-outline py-4 w-full uppercase text-xs font-bold tracking-widest">Cerrar Detalle</button>
                 <button className="btn btn-dark py-4 w-full uppercase text-xs font-bold tracking-widest">Reagendar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
   
    </div>
  );
};

export default MisCitasView;
