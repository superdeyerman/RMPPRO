import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, User, Plus, X, ChevronLeft, ChevronRight, Phone, CheckCircle } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const AgendaView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBookings(data);
        else console.error('Invalid bookings data:', data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      });
  }, []);

  const todayBookings = bookings.filter(b => isSameDay(parseISO(b.dateTime), selectedDate));

  return (
    <div className="adm-sec active animate-fade-up">
      <div className="adm-header flex justify-between items-end mb-8">
        <div>
           <h2 className="font-serif text-3xl font-light">Agenda de Servicios</h2>
           <p className="text-[0.77rem] text-gray uppercase tracking-widest">Gestión de tiempos y logística</p>
        </div>
        <div className="flex gap-2">
           <button className="btn btn-outline btn-sm">Día</button>
           <button className="btn btn-dark btn-sm">Semana</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
         {/* MINI CALENDAR */}
         <div className="bg-white p-6 rounded-xl border border-border h-fit">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-[0.7rem] font-bold uppercase tracking-widest">{format(selectedDate, 'MMMM yyyy', { locale: es })}</h3>
               <div className="flex gap-1">
                  <button className="p-1 hover:text-gold"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-1 hover:text-gold"><ChevronRight className="w-4 h-4" /></button>
               </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[0.6rem] text-gray mb-2">
               {['D','L','M','X','J','V','S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
               {/* Simplified monthly view logic */}
               {Array.from({ length: 31 }).map((_, i) => (
                 <div 
                   key={i} 
                   onClick={() => setSelectedDate(new Date(2025, 3, i+1))}
                   className={`aspect-square flex items-center justify-center text-[0.75rem] rounded-lg cursor-pointer transition-all ${i+1 === selectedDate.getDate() ? 'bg-gold text-white font-bold' : 'hover:bg-cream'}`}
                 >
                   {i+1}
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border">
               <div className="text-[0.6rem] uppercase tracking-widest text-gray mb-4 font-bold">Resumen Diario</div>
               <div className="flex justify-between text-xs mb-2">
                  <span>Confirmadas</span>
                  <span className="font-bold">{todayBookings.length}</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span>Pendientes</span>
                  <span className="font-bold text-orange">2</span>
               </div>
            </div>
         </div>

         {/* TIMELINE */}
         <div className="bg-white rounded-xl border border-border shadow-sm p-8">
            <div className="flex justify-between items-center mb-10">
               <h3 className="font-serif text-xl italic">{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</h3>
               <button className="btn btn-gold btn-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Bloquear Horario</button>
            </div>

            <div className="timeline-wrap space-y-6 relative before:absolute before:left-[15px] before:top-4 before:bottom-4 before:w-[1px] before:bg-border">
               {todayBookings.length > 0 ? todayBookings.map((b, idx) => (
                 <div key={b.id} className="tl-item pl-10 relative group">
                    <div className="absolute left-[10px] top-1.5 w-3 h-3 rounded-full bg-gold border-2 border-white shadow-sm z-10 group-hover:scale-125 transition-transform"></div>
                    <div onClick={() => setSelectedBooking(b)} className="tl-card bg-cream/40 p-5 rounded-xl border border-border hover:border-gold/50 transition-all cursor-pointer hover:shadow-lux hover:-translate-y-1 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gold/5 opacity-0 hover:opacity-100 transition-opacity" />
                       <div className="relative z-10 flex justify-between items-start mb-2">
                          <div className="text-gold-d text-[0.62rem] font-bold tracking-widest uppercase flex items-center gap-2">
                             <Clock className="w-3 h-3" /> {format(parseISO(b.dateTime), 'HH:mm')} hrs
                          </div>
                          <span className={`badge ${b.status === 'PENDING' ? 'b-pend' : 'b-conf'}`}>{b.status}</span>
                       </div>
                       <div className="tl-title font-serif text-lg mb-1">{b.guestName || "Cliente"}</div>
                       <div className="tl-serv text-[0.72rem] text-char mb-3 font-medium">
                          {b.services?.length > 0 ? b.services.map((s:any)=>s.name).join(' + ') : 'Servicio Especial'}
                       </div>
                       <div className="flex gap-4 items-center">
                          <div className="text-[0.65rem] text-gray flex items-center gap-1.5 font-medium"><MapPin className="w-3 h-3" /> {b.modality} {b.roomNumber ? `(Room ${b.roomNumber})` : ''}</div>
                          <div className="text-[0.65rem] text-gray flex items-center gap-1.5 font-medium"><Phone className="w-3 h-3" /> WhatsApp enviada</div>
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-20">
                    <Calendar className="w-12 h-12 text-gray/10 mx-auto mb-4" />
                    <p className="text-gray text-[0.75rem] italic">No hay citas confirmadas para esta fecha.</p>
                 </div>
               )}
            </div>
         </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-char/60 backdrop-blur-sm p-6"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl p-10"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedBooking(null)} className="absolute top-6 right-6 p-2 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10 border border-border">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
                <div className="w-16 h-16 rounded-full bg-gold-l flex items-center justify-center font-serif text-2xl text-gold-d border-2 border-white shadow-sm">
                  {selectedBooking.guestName?.charAt(0) || 'M'}
                </div>
                <div>
                  <h2 className="editorial-title text-3xl mb-1">{selectedBooking.guestName || "Majestad Anónima"}</h2>
                  <div className="text-[0.65rem] uppercase tracking-widest text-gold font-bold">Ref: #{selectedBooking.id.slice(-8).toUpperCase()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-ivory border border-border p-5 rounded-2xl">
                   <div className="flex items-center gap-2 text-gold mb-2"><Calendar size={16} /> <span className="text-[0.65rem] uppercase tracking-widest font-bold">Fecha / Hora</span></div>
                   <div className="font-serif text-lg">{new Date(selectedBooking.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                </div>
                <div className="bg-ivory border border-border p-5 rounded-2xl">
                   <div className="flex items-center gap-2 text-gold mb-2"><MapPin size={16} /> <span className="text-[0.65rem] uppercase tracking-widest font-bold">Locación</span></div>
                   <div className="font-serif text-lg">{selectedBooking.modality}</div>
                   {selectedBooking.roomNumber && <div className="text-xs text-gray mt-1">Habitación: {selectedBooking.roomNumber}</div>}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray mb-3 font-bold">Servicios Contratados</h3>
                <div className="space-y-3">
                   {selectedBooking.services?.map((s:any, idx:number) => (
                     <div key={idx} className="flex justify-between items-center bg-cream px-4 py-3 rounded-xl border border-border">
                        <div className="font-medium text-char">{s.name}</div>
                        <div className="text-sm font-serif">${s.price?.toLocaleString()}</div>
                     </div>
                   )) || <div className="text-sm italic text-gray">Experiencia personalizada VIP</div>}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-6 mb-8">
                <div className="text-[0.65rem] uppercase tracking-widest text-gray font-bold">Total Inversión</div>
                <div className="font-serif text-3xl text-gold">${selectedBooking.totalPrice?.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => { setSelectedBooking(null); }} className="btn btn-outline py-3 flex items-center justify-center gap-2 w-full"><Phone size={16} /> Enviar WhatsApp</button>
                 <button onClick={() => { setSelectedBooking(null); }} className="btn btn-gold py-3 flex items-center justify-center gap-2 w-full"><CheckCircle size={16} /> Completar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AgendaView;
