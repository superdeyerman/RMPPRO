import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  User, 
  Star, 
  MoreVertical,
  ShieldCheck,
  Heart,
  Crown,
  ChevronRight,
  MoreHorizontal,
  Clock,
  X
} from 'lucide-react';

const CRMView = () => {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Unique by email
          const uniqueClients = Array.from(new Set(data.map(b => b.guestEmail)))
            .map(email => {
              const b = data.find(x => x.guestEmail === email);
              return {
                id: email,
                name: b.guestName,
                email: email,
                phone: b.guestPhone,
                totalSpent: data.filter(x => x.guestEmail === email).reduce((acc, curr) => acc + curr.totalPrice, 0),
                visits: data.filter(x => x.guestEmail === email).length,
                lastVisit: b.dateTime
              };
            });
          setClients(uniqueClients);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 border-b border-border pb-10">
          <div>
             <div className="label text-gold mb-2">Majestad Database</div>
             <h1 className="editorial-title text-4xl lg:text-6xl">Relaciones de <br /> <em className="text-gold italic">Elite.</em></h1>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-char/20 w-4 h-4" />
                <input 
                  type="text" 
                  className="input-luxury !pl-10 !py-4 !text-xs w-72" 
                  placeholder="Buscar Majestad por nombre o email..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>
             <button className="btn btn-dark text-[0.6rem] !px-8">Añadir Nueva Majestad</button>
          </div>
        </div>

        {/* ── SEGMENTATION TABS ── */}
        <div className="flex gap-10 border-b border-border pb-1">
           {['Todas', 'VIP Elite', 'Recurrentes', 'Fuga en riesgo'].map((tab, i) => (
             <button key={tab} className={`pb-4 text-[0.65rem] uppercase tracking-widest font-bold relative transition-all ${i === 0 ? 'text-char' : 'text-char/30 hover:text-char'}`}>
                {tab}
                {i === 0 && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />}
             </button>
           ))}
        </div>

        {/* ── CLIENT GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {loading ? (
             Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 loading-shimmer rounded-[2.5rem]"></div>)
           ) : (
             clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())).map((c, i) => {
               const isVIP = c.visits >= 3;
               return (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   key={c.id} 
                   onClick={() => setSelectedClient(c)}
                   className="bg-white p-10 rounded-[2.5rem] border border-border shadow-lux relative group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all hover:border-gold relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-start mb-8">
                       <div className="w-16 h-16 rounded-full bg-cream border border-border flex items-center justify-center font-serif text-2xl text-gold overflow-hidden">
                          {c.name ? c.name[0] : 'M'}
                       </div>
                       <button className="text-char/10 hover:text-char transition-colors"><MoreHorizontal /></button>
                    </div>

                    <div className="space-y-1 mb-8">
                       <h3 className="font-serif text-2xl group-hover:text-gold transition-colors">{c.name || "Sin nombre"}</h3>
                       <div className="flex items-center gap-2">
                          <span className="text-[0.6rem] text-char/40 font-bold uppercase tracking-widest">{c.email}</span>
                          {isVIP && <Crown size={12} className="text-gold" />}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-8">
                       <div>
                          <div className="text-[0.5rem] uppercase tracking-widest text-char/20 font-bold mb-1">Inversión Total</div>
                          <div className="font-serif text-xl text-gold-d">${c.totalSpent?.toLocaleString()}</div>
                       </div>
                       <div>
                          <div className="text-[0.5rem] uppercase tracking-widest text-char/20 font-bold mb-1">Frecuencia</div>
                          <div className="font-serif text-xl">{c.visits} sesiones</div>
                       </div>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-border flex justify-between items-center text-[0.65rem] font-bold uppercase tracking-widest text-char/30">
                       <div className="flex items-center gap-2">
                          <Clock size={12} /> {new Date(c.lastVisit).toLocaleDateString()}
                       </div>
                       <div className="text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Ver Perfil <ChevronRight size={14} />
                       </div>
                    </div>

                    {isVIP && (
                       <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-white text-[0.5rem] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          Elite Member
                       </div>
                    )}
                 </motion.div>
               );
             })
           )}
        </div>

        {/* ── FOOTER STATS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-border/50">
           <div>
              <div className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-char/20 mb-2">Total Majestades</div>
              <div className="font-serif text-3xl">{clients.length}</div>
           </div>
           <div>
              <div className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-char/20 mb-2">Crecimiento Mensual</div>
              <div className="font-serif text-3xl text-green-500">+14%</div>
           </div>
           <div>
              <div className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-char/20 mb-2">LTV Promedio</div>
              <div className="font-serif text-3xl">$342.000</div>
           </div>
           <div>
              <div className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-char/20 mb-2">Churn Rate</div>
              <div className="font-serif text-3xl text-gold">2.1%</div>
           </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedClient && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-char/60 backdrop-blur-sm p-6"
            onClick={() => setSelectedClient(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl p-10"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedClient(null)} className="absolute top-6 right-6 p-2 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10 border border-border">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-6 mb-10 border-b border-border pb-8">
                <div className="w-24 h-24 rounded-full bg-cream border-2 border-gold flex items-center justify-center font-serif text-4xl text-gold overflow-hidden shadow-sm relative">
                  {selectedClient.name ? selectedClient.name[0] : 'M'}
                  {selectedClient.visits >= 3 && (
                    <div className="absolute bottom-0 bg-gold text-white text-[0.55rem] font-bold w-full text-center py-0.5 tracking-widest uppercase">
                       VIP
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="editorial-title text-4xl mb-2">{selectedClient.name || "Majestad Anónima"}</h2>
                  <div className="text-[0.65rem] uppercase tracking-widest text-gray font-bold">{selectedClient.email}</div>
                  <div className="text-[0.65rem] uppercase tracking-widest text-gray font-bold">{selectedClient.phone || 'Sin número de contacto'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-ivory border border-border p-5 rounded-2xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gold-d"><ShoppingBag size={20} /></div>
                   <div>
                     <div className="text-[0.65rem] uppercase tracking-widest font-bold text-gray">Inversión Total</div>
                     <div className="font-serif text-2xl text-char">${selectedClient.totalSpent?.toLocaleString()}</div>
                   </div>
                </div>
                <div className="bg-ivory border border-border p-5 rounded-2xl flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gold-d"><Calendar size={20} /></div>
                   <div>
                     <div className="text-[0.65rem] uppercase tracking-widest font-bold text-gray">Frecuencia</div>
                     <div className="font-serif text-2xl text-char">{selectedClient.visits} visitas</div>
                   </div>
                </div>
              </div>

              <div className="bg-cream p-6 rounded-2xl border border-border mb-8">
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray mb-4 font-bold flex items-center gap-2"><Star size={14} className="text-gold" /> Nivel de Fidelidad</h3>
                <div className="w-full bg-border h-2 rounded-full overflow-hidden mb-2">
                   <div className="bg-gold h-full" style={{ width: selectedClient.visits >= 3 ? '100%' : `${(selectedClient.visits / 3) * 100}%` }}></div>
                </div>
                <div className="text-[0.65rem] italic text-char/60 font-serif">
                   {selectedClient.visits >= 3 ? 'Majestad de categoría Elite. Posee beneficios de upgrade automáticos.' : `A ${3 - selectedClient.visits} visitas de alcanzar categoría Elite.`}
                </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setSelectedClient(null)} className="btn btn-outline py-4 flex items-center justify-center gap-2 w-full uppercase text-xs font-bold tracking-widest"><Phone size={16} /> Contactar</button>
                 <button onClick={() => setSelectedClient(null)} className="btn btn-gold py-4 flex items-center justify-center gap-2 w-full uppercase text-xs font-bold tracking-widest"><Calendar size={16} /> Ver Historial</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Internal Link Mock for reference
const Link = ({ children, to, className }: any) => <a href={to} className={className}>{children}</a>;

export default CRMView;
