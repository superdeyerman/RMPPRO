import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hotel, 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

   const HotelPortalView = () => {
   const { userData } = useAuth();
   const [requests, setRequests] = useState<any[]>([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading]   = useState(true);
   const [services, setServices] = useState<any[]>([]);
   const [selectedRequest, setSelectedRequest] = useState<any>
  (null);
  
  const [simulator, setSimulator] = useState({
    rooms: 100,
    occupancy: 70,
    takeRate: 5, // 5% of guests book a service
  });

  const [newRequest, setNewRequest] = useState({
    guestName: '',
    room: '',
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
      });
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRequests(data.filter((b:any) => b.modality === 'Hotel' || b.hotelName));
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const svc = services.find(s => s.id === newRequest.serviceId);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: newRequest.guestName,
          roomNumber: newRequest.room,
          services: [newRequest.serviceId],
          totalPrice: svc?.price || 0,
          dateTime: `${newRequest.date}T${newRequest.time}:00Z`,
          modality: 'Hotel',
          hotelName: userData?.displayName || 'Hotel Aliado',
          notes: newRequest.notes
        })
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Simulation logic
  const avgServicePrice = 65000;
  const hotelCommission = 0.15; // 15%
  const monthlyServices = Math.round((simulator.rooms * (simulator.occupancy/100) * 30) * (simulator.takeRate/100));
  const estimatedRevenue = monthlyServices * avgServicePrice * hotelCommission;

  return (
    <div className="min-h-screen p-6 lg:p-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ── HEADER ── */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-border">
          <div>
             <div className="label text-gold mb-4">Corporate Alliances</div>
             <h1 className="editorial-title text-4xl lg:text-6xl">Plataforma de <br /> <em className="text-gold italic">Conciergerie.</em></h1>
             <p className="text-char/40 font-serif italic text-lg mt-4 max-w-xl">
                Gestión automatizada de bienestar para sus huéspedes. Sin costos operativos, con rentabilidad inmediata.
             </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-gold !py-5 !px-10 group"
          >
             <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" /> 
             Nueva Solicitud Habitación
          </button>
        </header>

        {/* ── METRICS GRID ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-char p-10 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="text-[0.6rem] uppercase tracking-widest text-gold font-bold mb-6">Comisiones este mes</div>
                 <div className="font-serif text-5xl text-gold">${estimatedRevenue.toLocaleString()}</div>
                 <div className="mt-6 flex items-center gap-2 text-white/40 text-[0.7rem]">
                    <TrendingUp size={14} className="text-green-500" /> +12% vs mes anterior
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px]"></div>
           </div>

           <div className="bg-white p-10 rounded-3xl border border-border">
              <div className="text-[0.6rem] uppercase tracking-widest text-char/20 font-bold mb-6">Solicitudes Activas</div>
              <div className="font-serif text-5xl">{requests.filter(r => r.status === 'PENDING').length}</div>
              <div className="mt-6 text-[0.7rem] text-char/40 flex items-center gap-2">
                 <Clock size={14} /> Próxima llegada: Hoy 14:00
              </div>
           </div>

           <div className="bg-white p-10 rounded-3xl border border-border">
              <div className="text-[0.6rem] uppercase tracking-widest text-char/20 font-bold mb-6">Estado Alianza</div>
              <div className="font-serif text-3xl">Premium Elite</div>
              <div className="mt-6 flex gap-2">
                 {Array.from({ length: 5 }).map((_, i) => <Award key={i} size={16} className="text-gold fill-gold" />)}
              </div>
           </div>
        </section>

        {/* ── B2B SIMULATOR ── */}
        <section className="bg-ivory p-12 lg:p-20 rounded-[4rem] border border-border/50 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <div className="label text-gold">Revenue Simulator</div>
              <h2 className="editorial-title text-4xl">Calcule su potencial <br /> de <em className="italic text-gold">ingresos.</em></h2>
              <p className="text-char/60 text-sm leading-relaxed max-w-sm">
                 Nuestra alianza no tiene costos fijos. Generamos ingresos adicionales a través de una comisión directa por cada tratamiento reservado por sus huéspedes.
              </p>
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[0.65rem] uppercase tracking-widest font-bold">
                       <span>Habitaciones</span>
                       <span className="text-gold">{simulator.rooms}</span>
                    </div>
                    <input type="range" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold" min="10" max="500" value={simulator.rooms} onChange={e => setSimulator({...simulator, rooms: parseInt(e.target.value)})} />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[0.65rem] uppercase tracking-widest font-bold">
                       <span>Ocupación (%)</span>
                       <span className="text-gold">{simulator.occupancy}%</span>
                    </div>
                    <input type="range" className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold" min="10" max="100" value={simulator.occupancy} onChange={e => setSimulator({...simulator, occupancy: parseInt(e.target.value)})} />
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-12 rounded-[3rem] shadow-lux text-center space-y-8 border border-border">
              <div className="w-16 h-16 rounded-full bg-gold/10 mx-auto flex items-center justify-center text-gold mb-4">
                 <Calculator size={32} />
              </div>
              <div className="space-y-2">
                 <div className="text-[0.65rem] uppercase tracking-widest text-char/30 font-bold">Retorno Mensual Estimado</div>
                 <div className="font-serif text-6xl text-gold-d">${estimatedRevenue.toLocaleString()}</div>
              </div>
              <div className="pt-8 border-t border-border grid grid-cols-2 gap-4">
                 <div>
                    <div className="text-[0.55rem] uppercase text-char/30 font-bold">Servicios / Mes</div>
                    <div className="font-serif text-2xl">{monthlyServices}</div>
                 </div>
                 <div>
                    <div className="text-[0.55rem] uppercase text-char/30 font-bold">SLA Garantizado</div>
                    <div className="font-serif text-2xl">99.8%</div>
                 </div>
              </div>
              <button className="btn btn-dark w-full py-5">Solicitar Upgrade de Alianza</button>
           </div>
        </section>

        {/* ── TABLE ── */}
        <section className="bg-white rounded-[3rem] border border-border overflow-hidden">
           <div className="p-12 border-b border-border flex justify-between items-center">
              <div>
                 <h2 className="font-serif text-3xl">Historial de Activaciones</h2>
                 <p className="text-[0.6rem] uppercase tracking-widest text-char/30 mt-2">Seguimiento de servicios realizados y comisiones</p>
              </div>
              <button className="btn btn-ghost text-[0.6rem] uppercase tracking-widest font-bold flex items-center gap-2">
                 Descargar Reporte <FileText size={14} />
              </button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-char/30 text-[0.65rem] uppercase tracking-[0.2em] font-bold border-b border-border">
                       <th className="px-12 py-6">Huésped</th>
                       <th className="px-12 py-6">Habitación</th>
                       <th className="px-12 py-6">Servicio / Status</th>
                       <th className="px-12 py-6">Fecha</th>
                       <th className="px-12 py-6 text-right">Comisión</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {requests.map(r => (
                      <tr key={r.id} onClick={() => setSelectedRequest(r)} className="hover:bg-cream transition-colors group cursor-pointer hover:shadow-sm">
                        <td className="px-12 py-8 font-serif text-xl">{r.guestName}</td>
                        <td className="px-12 py-8 font-serif text-lg text-char/40">{r.roomNumber || '—'}</td>
                        <td className="px-12 py-8">
                           <div className="flex items-center gap-4">
                              <span className={`w-2 h-2 rounded-full ${r.status === 'PENDING' ? 'bg-gold animate-pulse' : 'bg-char'}`}></span>
                              <div>
                                 <div className="text-[0.75rem] font-bold uppercase tracking-widest">{r.status}</div>
                                 <div className="text-[0.65rem] text-char/30">{r.servicesJson ? JSON.parse(r.servicesJson).length : 0} servicios</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-12 py-8 text-[0.7rem] uppercase tracking-widest font-bold text-char/30">
                           {new Date(r.dateTime).toLocaleDateString()}
                        </td>
                        <td className="px-12 py-8 text-right">
                           <div className="font-serif text-lg text-gold">${(r.totalPrice * 0.15).toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr><td colSpan={5} className="px-12 py-32 text-center font-serif italic text-char/20 text-3xl">Silencio editorial: sin actividad aún.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </section>
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
         {isModalOpen && (
           <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-char/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-2xl rounded-[3rem] p-12 relative shadow-2xl" 
                onClick={e => e.stopPropagation()}
              >
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-char/20 hover:text-char"><X /></button>
                 
                 <div className="mb-10">
                    <div className="label text-gold mb-4">Nueva Activación</div>
                    <h3 className="font-serif text-4xl">Solicitar para Huésped</h3>
                 </div>

                 <form onSubmit={handleAddRequest} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[0.65rem] uppercase tracking-widest font-bold">Nombre del Huésped</label>
                          <input required type="text" className="input-luxury w-full" onChange={e => setNewRequest({...newRequest, guestName: e.target.value})} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[0.65rem] uppercase tracking-widest font-bold">Número de Habitación</label>
                          <input required type="text" className="input-luxury w-full" onChange={e => setNewRequest({...newRequest, room: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[0.65rem] uppercase tracking-widest font-bold">Servicio Requerido</label>
                       <select required className="input-luxury w-full" onChange={e => setNewRequest({...newRequest, serviceId: e.target.value})}>
                          <option value="">Seleccione...</option>
                          {services.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price.toLocaleString()}</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[0.65rem] uppercase tracking-widest font-bold">Fecha</label>
                          <input required type="date" className="input-luxury w-full" onChange={e => setNewRequest({...newRequest, date: e.target.value})} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[0.65rem] uppercase tracking-widest font-bold">Hora</label>
                          <input required type="time" className="input-luxury w-full" onChange={e => setNewRequest({...newRequest, time: e.target.value})} />
                       </div>
                    </div>
                    <button type="submit" className="btn btn-dark w-full py-6 text-lg group">
                       Confirmar y Notificar a Majestad <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRequest && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-char/60 backdrop-blur-sm p-6"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl p-10"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedRequest(null)} className="absolute top-6 right-6 p-2 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10 border border-border">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
                <div className="w-16 h-16 rounded-full bg-gold-l flex items-center justify-center font-serif text-2xl text-gold-d border-2 border-white shadow-sm">
                  {selectedRequest.guestName?.charAt(0) || 'M'}
                </div>
                <div>
                  <h2 className="editorial-title text-3xl mb-1">{selectedRequest.guestName || "Huésped"}</h2>
                  <div className="text-[0.65rem] uppercase tracking-widest text-gold font-bold">Habitación: {selectedRequest.roomNumber || 'N/A'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-ivory border border-border p-5 rounded-2xl">
                   <div className="flex items-center gap-2 text-gold mb-2"><Calendar size={16} /> <span className="text-[0.65rem] uppercase tracking-widest font-bold">Fecha / Hora</span></div>
                   <div className="font-serif text-lg">{new Date(selectedRequest.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                </div>
                <div className="bg-ivory border border-border p-5 rounded-2xl">
                   <div className="flex items-center gap-2 text-gold mb-2"><Award size={16} /> <span className="text-[0.65rem] uppercase tracking-widest font-bold">Estado</span></div>
                   <div className="font-serif text-lg">{selectedRequest.status}</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray mb-3 font-bold">Servicios Contratados</h3>
                <div className="space-y-3">
                   {selectedRequest.services?.map((s:any, idx:number) => (
                     <div key={idx} className="flex justify-between items-center bg-cream px-4 py-3 rounded-xl border border-border">
                        <div className="font-medium text-char">{s.name}</div>
                        <div className="text-sm font-serif">${s.price?.toLocaleString()}</div>
                     </div>
                   )) || <div className="text-sm italic text-gray">Reserva sin desglose de servicios</div>}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-6 mb-8">
                <div className="text-[0.65rem] uppercase tracking-widest text-gray font-bold text-right w-full">Comisión MKT: <span className="text-gold-d font-bold">15%</span> · Total a facturar: <span className="font-serif text-xl ml-2">${((selectedRequest.totalPrice || 0) * 0.15).toLocaleString()}</span></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <button onClick={() => { setSelectedRequest(null); }} className="btn btn-outline py-3 w-full uppercase text-xs font-bold tracking-widest">Cerrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelPortalView;
