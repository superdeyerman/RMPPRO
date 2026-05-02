import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  Scissors, 
  Calendar, 
  ArrowUpRight, 
  Award, 
  Zap, 
  CheckCircle,
  BarChart3,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const MisGananciasView = () => {
  const current = 29;
  const targetPlat = 40;
  const pct = Math.min(Math.round((current/targetPlat)*100), 100);

  return (
    <div className="min-h-screen p-6 lg:p-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ── HEADER ── */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-border">
          <div>
             <div className="label text-gold mb-4">Partner Performance</div>
             <h1 className="editorial-title text-4xl lg:text-6xl">Mis Ganancias y <br /> <em className="text-gold italic">Crecimiento.</em></h1>
          </div>
          <button className="btn btn-dark !py-5 !px-12 group">
             Solicitar Liquidación <ChevronRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
        </header>

        {/* ── PARTNER TIER ── */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-char rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-2xl"
        >
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <div className="flex items-center gap-3 text-gold text-[0.6rem] tracking-[0.4em] font-bold uppercase">
                    <Award size={20} /> Estatus de Partner
                 </div>
                 <h2 className="editorial-title !text-white text-5xl">GOLD MEMBER</h2>
                 <p className="text-white/40 font-serif italic text-lg max-w-sm">
                    “Su desempeño excepcional le otorga un 70% de comisión neta y prioridad absoluta en hoteles 5 estrellas.”
                 </p>
                 <div className="space-y-4 max-w-sm">
                    <div className="flex justify-between text-[0.6rem] uppercase tracking-widest font-bold text-gold">
                       <span>Progreso a Nivel Platino</span>
                       <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-gold shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
                    </div>
                    <p className="text-[0.6rem] text-white/30 italic">Faltan {targetPlat - current} servicios para subir al 75% de comisión.</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                    <div className="text-[0.55rem] uppercase tracking-widest text-gold font-bold mb-4">Ingresos Abril</div>
                    <div className="font-serif text-3xl">$886.000</div>
                    <div className="mt-4 flex items-center gap-2 text-green-500 text-[0.6rem]">
                       <TrendingUp size={12} /> +12% ↑
                    </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                    <div className="text-[0.55rem] uppercase tracking-widest text-gold font-bold mb-4">Servicios Mes</div>
                    <div className="font-serif text-3xl">{current}</div>
                    <div className="mt-4 flex items-center gap-2 text-gold text-[0.6rem]">
                       <Sparkles size={12} /> Excelente Meta
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Decor */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        {/* ── METRICS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-10 rounded-[2.5rem] border border-border">
              <div className="text-[0.6rem] uppercase tracking-widest text-char/20 font-bold mb-4 text-center">Ticket Promedio Personal</div>
              <div className="font-serif text-4xl text-center">$30.550</div>
           </div>
           <div className="bg-white p-10 rounded-[2.5rem] border border-border">
              <div className="text-[0.6rem] uppercase tracking-widest text-char/20 font-bold mb-4 text-center">Fidelización Clientes</div>
              <div className="font-serif text-4xl text-center">88%</div>
           </div>
           <div className="bg-white p-10 rounded-[2.5rem] border border-border">
              <div className="text-[0.6rem] uppercase tracking-widest text-char/20 font-bold mb-4 text-center">Calificación Media</div>
              <div className="font-serif text-4xl text-center text-gold">4.92 ★</div>
           </div>
        </div>

        {/* ── PAYMENTS TABLE ── */}
        <section className="bg-white rounded-[3rem] border border-border overflow-hidden shadow-lux">
           <div className="p-12 border-b border-border flex justify-between items-center">
              <div>
                 <h2 className="font-serif text-3xl">Historial de Liquidaciones</h2>
                 <p className="text-[0.6rem] uppercase tracking-widest text-char/30 mt-2">Transparencia absoluta en cada uno de sus pagos</p>
              </div>
              <div className="flex gap-4">
                 <button className="btn btn-ghost text-[0.6rem] uppercase tracking-widest font-bold flex items-center gap-2">
                    Exportar Reporte <BarChart3 size={14} />
                 </button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-char/30 text-[0.6rem] uppercase tracking-[0.3em] font-bold border-b border-border">
                       <th className="px-12 py-6">Ciclo / Fecha</th>
                       <th className="px-12 py-6">Actividad</th>
                       <th className="px-12 py-6">Monto Bruto</th>
                       <th className="px-12 py-6">Comisión (70%)</th>
                       <th className="px-12 py-6 text-right">Monto Neto Pago</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50 font-serif">
                    <tr className="hover:bg-cream transition-colors group">
                       <td className="px-12 py-10">
                          <div className="font-serif text-xl">Abril 2025</div>
                          <div className="text-[0.55rem] uppercase tracking-widest text-gold font-bold mt-1 animate-pulse">Periodo en curso</div>
                       </td>
                       <td className="px-12 py-10">
                          <div className="text-lg">29 servicios</div>
                          <div className="text-[0.6rem] text-char/30 font-sans uppercase font-bold">14 Domicilio / 15 Hotel</div>
                       </td>
                       <td className="px-12 py-10 text-lg text-char/40">$886.000</td>
                       <td className="px-12 py-10 text-lg text-char/40">70%</td>
                       <td className="px-12 py-10 text-right">
                          <div className="text-2xl text-gold-d">$620.200</div>
                          <div className="text-[0.55rem] uppercase tracking-widest font-sans font-bold text-char/20">Pendiente de cierre</div>
                       </td>
                    </tr>
                    <tr className="hover:bg-cream transition-colors group">
                       <td className="px-12 py-10">
                          <div className="font-serif text-xl">Marzo 2025</div>
                       </td>
                       <td className="px-12 py-10 text-lg">25 servicios</td>
                       <td className="px-12 py-10 text-lg text-char/40">$825.000</td>
                       <td className="px-12 py-10 text-lg text-char/40">70%</td>
                       <td className="px-12 py-10 text-right">
                          <div className="text-2xl text-char">$577.500</div>
                          <div className="text-[0.55rem] uppercase tracking-widest font-sans font-bold text-green-500">Pagado con éxito</div>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </section>

      </div>
    </div>
  );
};

export default MisGananciasView;
