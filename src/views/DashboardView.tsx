import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Activity, 
  DollarSign, 
  Search, 
  FileText, 
  Star, 
  MapPin, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  MoreHorizontal,
  Building,
  Mail,
  X,
  CreditCard,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardView: React.FC = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [alliances, setAlliances] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedAlliance, setSelectedAlliance] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, statsRes, alliancesRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/stats'),
          fetch('/api/alliances')
        ]);
        const bookingsData = await bookingsRes.json();
        const statsData = await statsRes.json();
        const alliancesData = await alliancesRes.json();
        
        if (Array.isArray(bookingsData)) setBookings(bookingsData);
        if (statsData && !statsData.error) setStatsData(statsData);
        if (Array.isArray(alliancesData)) setAlliances(alliancesData);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemindBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/remind`, { method: 'POST' });
      if (res.ok) {
        alert('Recordatorio enviado con éxito via WhatsApp.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "COMPLETED" } : b));
        alert("Reserva completada y automatización post-servicio enviada.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAllianceAction = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/alliances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAlliances(alliances.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 border-b border-border pb-10">
          <div>
             <div className="text-[0.6rem] uppercase tracking-[0.22em] text-gold mb-2 font-medium">Operational Command</div>
             <h1 className="editorial-title text-4xl lg:text-5xl">Estado de la <em className="text-gold italic font-light">Majestad.</em></h1>
          </div>
          <div className="flex gap-4">
             <button className="btn btn-outline text-[0.6rem] !px-6 border-gold/20 text-gold-d rounded-full">⌘K Command Center</button>
             <button className="btn btn-dark text-[0.6rem] !px-8 rounded-full shadow-lg shadow-char\/10">Generar Reporte Mensual</button>
          </div>
        </div>

        {/* ── INSIGHT CARD ── */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-gradient-to-br from-char to-[#2A2520] rounded-[2rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-2xl shadow-char/10"
        >
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-center">
              <div>
                 <div className="flex items-center gap-3 text-gold text-[0.6rem] tracking-[0.4em] font-medium uppercase mb-6 drop-shadow-sm">
                    <Sparkles size={16} className="animate-pulse-live" /> Insight Estratégico · IA
                 </div>
                 <h2 className="editorial-title !text-white text-3xl lg:text-4xl leading-tight mb-6 font-light">
                    Su tasa de fidelización <br /> ha subido un <em className="text-gold font-medium not-italic">22%</em> este trimestre.
                 </h2>
                 <p className="border-l-[3px] border-gold/30 pl-5 text-white/70 font-serif italic text-lg max-w-xl leading-relaxed">
                    “Los clientes que reservan en la modalidad 'Hotel' tienen un 45% más de probabilidad de contratar una membresía recurrente. Recomendamos fortalecer la presencia en el Hotel W y Mandarin Oriental.”
                 </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-inner">
                 <div className="text-[0.55rem] uppercase tracking-widest text-gold font-medium mb-4">Meta Mensual</div>
                 <div className="font-serif text-4xl mb-4 font-light text-white">78% <span className="text-lg text-white/30 italic font-serif">completado</span></div>
                 <div className="w-full bg-char/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} className="h-full bg-gradient-to-r from-gold-d to-gold-l"></motion.div>
                 </div>
              </div>
           </div>
           {/* Decor */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </motion.div>

        {/* ── STATS GRID ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
              { label: 'Revenue Bruto', val: statsData?.totalRevenue || 0, trend: '+14%', color: 'gold', icon: <DollarSign /> },
              { label: 'Reservas Activas', val: statsData?.totalBookings || 0, trend: '+8', color: 'char', icon: <Calendar /> },
              { label: 'Ticket Promedio', val: 82500, trend: '+$4.200', color: 'gold', icon: <TrendingUp /> },
              { label: 'Satisfacción NPS', val: '4.95', trend: 'Elite', color: 'char', icon: <Star /> }
           ].map((s, i) => (
             <div key={i} onClick={() => setSelectedMetric(s)} className="bg-white p-10 rounded-[2.5rem] border border-border shadow-lux group hover:-translate-y-2 transition-all cursor-pointer hover:border-gold relative overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-cream border border-border shadow-sm group-hover:bg-gold/10 group-hover:border-gold-l transition-all">
                   <div className="text-gold-d">{s.icon}</div>
                </div>
                <div className="relative z-10 text-[0.6rem] uppercase tracking-[0.2em] font-bold text-gray mb-2 group-hover:text-gold-d transition-colors">{s.label}</div>
                <div className="relative z-10 flex items-end justify-between">
                   <div className="font-serif text-3xl group-hover:text-char transition-colors">
                      {typeof s.val === 'number' ? `$${s.val.toLocaleString()}` : s.val}
                   </div>
                   <div className={`text-[0.65rem] font-bold ${s.trend.startsWith('+') ? 'text-green-600' : 'text-gold'}`}>{s.trend}</div>
                </div>
             </div>
           ))}
        </section>

        {/* ── ALLIANCE REQUESTS ── */}
        {alliances.length > 0 && (
          <section className="bg-white rounded-[3rem] border border-gold-l/30 overflow-hidden shadow-lux">
             <div className="p-10 lg:p-12 border-b border-border bg-ivory/30 flex justify-between items-center">
                <div>
                   <h2 className="font-serif text-3xl">Nuevas Alianzas B2B</h2>
                   <p className="text-[0.6rem] uppercase tracking-widest text-gold mt-2">Hoteles interesados en unirse a la red Majestad</p>
                </div>
                <div className="flex items-center gap-2 text-gold">
                   <Building size={20} /> <span className="font-serif text-xl">{alliances.length}</span>
                </div>
             </div>
             <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {alliances.map(a => (
                     <div key={a.id} onClick={() => setSelectedAlliance(a)} className="p-6 border border-border rounded-2xl hover:border-gold hover:shadow-lux cursor-pointer group transition-all bg-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex justify-between items-start mb-4">
                           <h4 className="font-serif text-xl">{a.hotelName}</h4>
                           <span className={`text-[0.55rem] px-2 py-1 rounded-full font-bold uppercase tracking-widest ${a.status === 'PENDING' ? 'bg-gold-l text-gold-d' : 'bg-char text-white'}`}>{a.status}</span>
                        </div>
                        <div className="text-[0.65rem] text-char/40 mb-4">{a.category} · {a.contactName}</div>
                        <p className="text-[0.7rem] text-char/60 line-clamp-2 mb-4 italic">"{a.message}"</p>
                        <div className="pt-4 border-t border-border flex justify-between items-center">
                           {a.status === 'PENDING' ? (
                             <div className="flex gap-2">
                               <button onClick={(e) => { e.stopPropagation(); handleAllianceAction(a.id, 'APPROVED'); }} className="text-green-600 font-bold text-[0.6rem] uppercase tracking-widest hover:underline">Aprobar</button>
                               <button onClick={(e) => { e.stopPropagation(); handleAllianceAction(a.id, 'REJECTED'); }} className="text-red-600 font-bold text-[0.6rem] uppercase tracking-widest hover:underline">Rechazar</button>
                             </div>
                           ) : (
                             <a onClick={(e) => e.stopPropagation()} href={`mailto:${a.email}`} className="text-gold font-bold text-[0.6rem] uppercase tracking-widest hover:underline flex items-center gap-1">Contactar <Mail size={12} /></a>
                           )}
                           <div className="text-[0.6rem] text-char/20 uppercase tracking-widest">{new Date(a.createdAt).toLocaleDateString()}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* ── RECENT BOOKINGS TABLE ── */}
        <section className="bg-white rounded-[3rem] border border-border overflow-hidden">
           <div className="p-10 lg:p-12 border-b border-border flex justify-between items-center">
              <div>
                 <h2 className="font-serif text-3xl">Agenda Operativa</h2>
                 <p className="text-[0.6rem] uppercase tracking-widest text-char/30 mt-2">Últimas 50 transacciones en tiempo real</p>
              </div>
              <div className="flex gap-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-char/20 w-4 h-4" />
                    <input type="text" className="input-luxury !pl-10 !py-3 !text-xs w-64" placeholder="Buscar transacción..." />
                 </div>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-char/30 text-[0.6rem] uppercase tracking-[0.3em] font-bold border-b border-border">
                       <th className="px-12 py-6">ID / Referencia</th>
                       <th className="px-12 py-6">Majestad (Cliente)</th>
                       <th className="px-12 py-6">Servicio / Status</th>
                       <th className="px-12 py-6">Fecha y Hora</th>
                       <th className="px-12 py-6 text-right">Inversión</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {bookings.slice(0, 10).map(b => (
                      <tr key={b.id} onClick={() => setSelectedBooking(b)} className="hover:bg-cream transition-colors group cursor-pointer hover:shadow-sm">
                        <td className="px-12 py-8">
                           <div className="text-[0.65rem] font-bold text-gold">#{b.id.slice(-6).toUpperCase()}</div>
                           <div className="text-[0.55rem] text-char/40 uppercase tracking-tighter mt-1">{b.modality}</div>
                        </td>
                        <td className="px-12 py-8">
                           <div className="font-serif text-xl">{b.guestName || "Anónimo"}</div>
                           <div className="text-[0.65rem] text-char/30">{b.guestEmail}</div>
                        </td>
                        <td className="px-12 py-8">
                           <div className="flex items-center gap-4 mb-2">
                              <div className={`w-2 h-2 rounded-full ${b.status === 'PENDING' ? 'bg-gold animate-pulse' : b.status === 'PAID' ? 'bg-green-500' : 'bg-char'}`}></div>
                              <span className={`text-[0.65rem] font-bold border border-border px-3 py-1 rounded-full ${b.status === 'PAID' ? 'bg-green-50 border-green-200 text-green-700' : ''}`}>{b.status}</span>
                           </div>
                           <div className="text-[0.7rem] font-medium text-char/60">
                             {b.services?.map((s:any) => s.name).join(' + ') || 'Experiencia RP'}
                           </div>
                        </td>
                        <td className="px-12 py-8 font-serif text-lg text-char/40">
                           {new Date(b.dateTime).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-12 py-8 text-right">
                           <div className="flex flex-col items-end gap-2">
                              <div className="font-serif text-2xl">${b.totalPrice?.toLocaleString()}</div>
                              <div className="flex gap-3">
                                {b.status === 'PAID' && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleCompleteBooking(b.id); }}
                                    className="text-[0.55rem] uppercase tracking-widest text-green-600 hover:text-green-800 transition-colors font-bold flex items-center gap-1"
                                  >
                                    Completar <CheckCircle size={10} />
                                  </button>
                                )}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleRemindBooking(b.id); }}
                                  className="text-[0.55rem] uppercase tracking-widest text-gold hover:text-gold-d transition-colors font-bold flex items-center gap-1"
                                >
                                  Recordar <Zap size={10} />
                                </button>
                              </div>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                       <tr><td colSpan={5} className="py-20 text-center font-serif text-2xl text-char/20">Esperando primeras reservaciones...</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </section>

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
                 <button onClick={() => { handleRemindBooking(selectedBooking.id); setSelectedBooking(null); }} className="btn btn-outline py-3 flex items-center justify-center gap-2 w-full"><Phone size={16} /> Enviar WhatsApp</button>
                 {selectedBooking.status === 'PAID' && (
                   <button onClick={() => { handleCompleteBooking(selectedBooking.id); setSelectedBooking(null); }} className="btn btn-gold py-3 flex items-center justify-center gap-2 w-full"><CheckCircle size={16} /> Marcar Completado</button>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedAlliance && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-char/60 backdrop-blur-sm p-6"
            onClick={() => setSelectedAlliance(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-lg relative shadow-2xl p-10 text-center"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedAlliance(null)} className="absolute top-6 right-6 p-2 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10 border border-border">
                <X size={20} />
              </button>
              
              <div className="w-20 h-20 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-6">
                 <Building size={32} />
              </div>

              <div className="text-[0.65rem] uppercase tracking-widest text-gold-d mb-2 font-bold">{selectedAlliance.category}</div>
              <h2 className="editorial-title text-4xl mb-4">{selectedAlliance.hotelName}</h2>
              <div className="text-sm text-gray mb-6 flex flex-col gap-1">
                 <span>Contacto: <strong className="text-char">{selectedAlliance.contactName}</strong></span>
                 <span>Email: <strong className="text-char">{selectedAlliance.email}</strong></span>
              </div>

              <div className="bg-cream border border-border p-6 rounded-2xl mb-8 text-left">
                 <h3 className="text-[0.65rem] uppercase tracking-widest text-gray font-bold mb-3">Mensaje del Hotel</h3>
                 <p className="font-serif text-lg italic text-char/80 leading-relaxed border-l-2 border-gold/40 pl-4">
                   "{selectedAlliance.message}"
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => { handleAllianceAction(selectedAlliance.id, 'APPROVED'); setSelectedAlliance(null); }} className="btn btn-gold py-3 flex items-center justify-center w-full uppercase tracking-widest font-bold text-xs">Aprobar</button>
                 <button onClick={() => { handleAllianceAction(selectedAlliance.id, 'REJECTED'); setSelectedAlliance(null); }} className="btn btn-outline border-red-200 text-red-600 hover:bg-red-50 py-3 flex items-center justify-center w-full uppercase tracking-widest font-bold text-xs">Rechazar</button>
              </div>

            </motion.div>
          </motion.div>
        )}

        {selectedMetric && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-char/60 backdrop-blur-sm p-6"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-sm relative shadow-2xl p-10 text-center"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedMetric(null)} className="absolute top-6 right-6 p-2 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10 border border-border">
                <X size={20} />
              </button>
              
              <div className="w-20 h-20 rounded-2xl bg-cream border border-border shadow-sm text-gold-d flex items-center justify-center mx-auto mb-6">
                 {selectedMetric.icon}
              </div>

              <div className="text-[0.65rem] uppercase tracking-widest text-gray mb-2 font-bold">{selectedMetric.label}</div>
              <h2 className="editorial-title text-4xl mb-4 text-char">
                {typeof selectedMetric.val === 'number' ? `$${selectedMetric.val.toLocaleString()}` : selectedMetric.val}
              </h2>
              
              <div className="inline-flex items-center gap-2 bg-cream px-4 py-2 rounded-full border border-border mb-8">
                 <TrendingUp size={14} className="text-gold" />
                 <span className={`text-[0.65rem] uppercase tracking-widest font-bold ${selectedMetric.trend.startsWith('+') ? 'text-green-600' : 'text-gold-d'}`}>
                    {selectedMetric.trend} vs MES ANTERIOR
                 </span>
              </div>

              <p className="text-sm text-gray font-light leading-relaxed mb-8">
                 Esta métrica representa el acumulado del mes en curso y su proyección según el modelo de crecimiento histórico de la plataforma Majestad.
              </p>

              <button onClick={() => setSelectedMetric(null)} className="btn btn-outline py-3 w-full text-xs font-bold uppercase tracking-widest">
                 Cerrar Detalle
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardView;
