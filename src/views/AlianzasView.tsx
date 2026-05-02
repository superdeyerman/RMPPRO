import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  Award,
  Zap,
  BarChart3,
  X,
  ArrowRight
} from 'lucide-react';
import ItemDetailModal from '../components/ui/ItemDetailModal';

const partnerHotels = [
  { id: 1, name: 'The Ritz-Carlton', address: 'Las Condes, Santiago', type: 'hotel', price: 0 },
  { id: 2, name: 'Mandarin Oriental', address: 'Las Condes, Santiago', type: 'hotel', price: 0 },
  { id: 3, name: 'W Santiago', address: 'Las Condes, Santiago', type: 'hotel', price: 0 },
  { id: 4, name: 'Hotel Noi Vitacura', address: 'Vitacura, Santiago', type: 'hotel', price: 0 },
  { id: 5, name: 'The Singular Santiago', address: 'Lastarria, Santiago', type: 'hotel', price: 0 },
  { id: 6, name: 'Hotel Magnolia', address: 'Santiago Centro, Santiago', type: 'hotel', price: 0 },
];

const AlianzasView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('propuesta');
  const [simRoom, setSimRoom] = useState(80);
  const [simUsage, setSimUsage] = useState(8);
  const [simPrice, setSimPrice] = useState(70000);
  const [simComm, setSimComm] = useState(12);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [allianceForm, setAllianceForm] = useState({
    hotelName: '',
    category: '5 estrellas',
    contactName: '',
    email: '',
    message: ''
  });

  const handleAllianceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/alliances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allianceForm)
      });
      if (res.ok) {
        setShowSuccess(true);
        setAllianceForm({ hotelName: '', category: '5 estrellas', contactName: '', email: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcMonthlyRevenue = () => {
    const services = Math.round(simRoom * (simUsage / 100) * 30);
    const totalSales = services * simPrice;
    const commission = Math.round(totalSales * (simComm / 100));
    return { services, totalSales, commission };
  };

  const { services, totalSales, commission } = calcMonthlyRevenue();

  const tabs = [
    { id: 'propuesta', label: 'Propuesta de Valor' },
    { id: 'catalogo', label: 'Catálogo de Servicios B2B' },
    { id: 'portal', label: 'Portal de Solicitud' },
    { id: 'alianza', label: 'Solicitar Alianza' }
  ];

  return (
    <div className="bg-ivory animate-fade-up">
      {/* SUBNAV */}
      <div className="sticky top-[60px] z-[100] bg-white border-b border-border flex justify-center overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-6 lg:px-8 py-5 text-[0.62rem] lg:text-[0.68rem] tracking-[0.15em] uppercase font-bold transition-all border-b-2 whitespace-nowrap ${activeSubTab === tab.id ? 'border-char text-char' : 'border-transparent text-gray hover:text-char'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'propuesta' && (
          <motion.div key="prop" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {/* HERO */}
            <section className="bg-white text-char py-20 lg:py-32 px-6 lg:px-20 text-center relative overflow-hidden border-b border-border">
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_50px,rgba(201,169,110,0.02)_50px,rgba(201,169,110,0.02)_100px)]" />
               <div className="relative z-10 max-w-3xl mx-auto">
                 <div className="text-gold text-[0.6rem] tracking-[0.3em] uppercase font-bold mb-6">Alianzas exclusivas · Solo hoteles 5★ y boutique</div>
                 <h1 className="editorial-title text-4xl lg:text-6xl mb-8">El primer spa distribuido en<br />habitaciones 5★</h1>
                 <p className="text-gray text-lg mb-12 max-w-2xl mx-auto">Reverencia Majestad transforma cada habitación de su hotel en un santuario de bienestar en 30 minutos. Sin inversión, sin personal fijo, con ingresos pasivos para su hotel.</p>
                 <div className="flex flex-wrap justify-center gap-4">
                   <button onClick={() => setActiveSubTab('alianza')} className="btn btn-gold px-10">Solicitar alianza</button>
                   <button onClick={() => setActiveSubTab('portal')} className="btn btn-outline border-border">Ya soy aliado →</button>
                 </div>
               </div>
            </section>

            {/* DIFFERENTIATORS */}
            <section className="py-24 px-6 lg:px-20 bg-ivory">
               <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <div>
                    <div className="label mb-4">Por qué Reverencia Majestad</div>
                    <h2 className="editorial-title text-4xl lg:text-5xl mb-12">La diferencia que sus huéspedes recordarán</h2>
                    <div className="space-y-10">
                      {[
                        { n: 'I', t: 'Atención 100% personalizada', d: 'Cada servicio diseñado para ese huésped. No hay protocolos genéricos.' },
                        { n: 'II', t: 'Equipo certificado de élite', d: 'Profesionales con formación internacional, seleccionados por excelencia y discreción.' },
                        { n: 'III', t: 'El spa llega a la habitación', d: 'Equipamiento pro, productos premium y ambientación sensorial completa.' },
                        { n: 'IV', t: '60+ servicios exclusivos', d: 'Desde masajes hasta yoga, cocina, o entrenador personal. Todo para el huésped.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6">
                           <div className="w-12 h-12 border border-gold-l rounded-lg flex items-center justify-center font-serif text-gold text-xl shrink-0 bg-white">{item.n}</div>
                           <div>
                              <h4 className="font-serif text-xl mb-2">{item.t}</h4>
                              <p className="text-gray text-sm leading-relaxed">{item.d}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-10 lg:p-14 rounded-3xl border border-border shadow-sm">
                     <div className="label mb-8">RM vs Alternativas</div>
                     <div className="space-y-6">
                        {[
                          { label: 'Personalización 100%', rm: true, spa: 'par', std: false },
                          { label: 'Servicio en habitación', rm: true, spa: false, std: false },
                          { label: 'Sin costo para hotel', rm: true, spa: false, std: false },
                          { label: '60+ categorías', rm: true, spa: false, std: false },
                          { label: 'Ingresos pasivos', rm: true, spa: false, std: false },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center py-4 border-b border-border last:border-none">
                             <span className="text-xs font-medium text-char">{row.label}</span>
                             <div className="flex gap-10">
                                <div className="text-center w-10">
                                  {row.rm === true ? <CheckCircle2 size={18} className="text-green mx-auto" /> : <X size={18} className="text-red mx-auto" />}
                                </div>
                                <div className="text-center w-10 opacity-30">
                                  {row.spa === true ? <CheckCircle2 size={18} className="mx-auto" /> : row.spa === 'par' ? <div className="text-lg">~</div> : <X size={18} className="mx-auto" />}
                                </div>
                             </div>
                          </div>
                        ))}
                        <div className="flex justify-between text-[0.6rem] uppercase tracking-widest text-gray/40 pt-4 px-2">
                           <span />
                           <div className="flex gap-10">
                             <span className="w-10 text-center font-bold">RM</span>
                             <span className="w-10 text-center">SPA</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* HOTEL PARTNERS GRID */}
            <section className="py-24 px-6 lg:px-20 bg-white border-y border-border">
               <div className="max-w-6xl mx-auto">
                 <div className="text-center mb-16">
                   <div className="label mb-4">Hoteles Aliados</div>
                   <h2 className="editorial-title text-4xl lg:text-5xl">Integrados a nuestra red de bienestar</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {partnerHotels.map((h: any) => (
                     <div key={h.id} onClick={() => setSelectedItem(h)} className="bg-ivory p-8 rounded-2xl border border-border shadow-sm flex items-start gap-4 hover:border-gold transition-colors cursor-pointer group hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gold-d text-lg shadow-sm group-hover:scale-110 transition-transform relative z-10"><Building size={20} /></div>
                        <div className="relative z-10">
                          <h4 className="font-serif text-lg group-hover:text-gold-d transition-colors">{h.name}</h4>
                          <p className="text-[0.7rem] text-gray uppercase tracking-widest">{h.address}</p>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            </section>
            
            {/* MODEL */}
            <section className="py-24 px-6 lg:px-20 bg-ivory text-char">
              <div className="label text-gold mb-4 text-center">El modelo</div>
              <h2 className="editorial-title text-4xl lg:text-5xl mb-16 text-center">Así funciona la alianza</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden shadow-sm">
                {[
                  { n: '01', t: 'Firma del acuerdo', d: 'Sin costo, sin exclusividad. Acceso al portal en 24h.' },
                  { n: '02', t: 'El concierge solicita', d: 'Portal propio: huésped, habitación, servicio y hora. 2 minutos.' },
                  { n: '03', t: 'RM coordina', d: 'Confirmación en <30 min. Profesional puntual y equipado.' },
                  { n: '04', t: 'Liquidación mensual', d: 'Comisión 10–15% liquidada automáticamente cada mes.' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-12 hover:bg-cream transition-colors">
                    <div className="font-serif text-6xl text-gold/30 mb-4">{s.n}</div>
                    <h4 className="font-serif text-xl mb-3 text-gold-d">{s.t}</h4>
                    <p className="text-gray text-xs leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SIMULATOR */}
            <section className="py-24 px-6 lg:px-20 bg-white">
               <div className="max-w-5xl mx-auto">
                 <div className="label text-center mb-4">Simulador</div>
                 <h2 className="editorial-title text-4xl lg:text-5xl text-center mb-16">¿Cuánto puede generar su hotel?</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-ivory p-8 lg:p-12 rounded-3xl border border-border shadow-sm">
                   <div className="space-y-8">
                     <div>
                       <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-gray mb-4">
                         <span>Habitaciones ocupadas/día</span>
                         <span className="font-bold text-char">{simRoom}</span>
                       </div>
                       <input type="range" min="10" max="300" value={simRoom} onChange={(e)=>setSimRoom(+e.target.value)} className="w-full h-1.5 bg-border rounded-full appearance-none accent-gold cursor-pointer" />
                     </div>
                     <div>
                       <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-gray mb-4">
                         <span>% huéspedes que usan servicio</span>
                         <span className="font-bold text-char">{simUsage}%</span>
                       </div>
                       <input type="range" min="1" max="30" value={simUsage} onChange={(e)=>setSimUsage(+e.target.value)} className="w-full h-1.5 bg-border rounded-full appearance-none accent-gold cursor-pointer" />
                     </div>
                     <div>
                       <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-gray mb-4">
                         <span>Ticket promedio</span>
                         <span className="font-bold text-char">${simPrice.toLocaleString('es-CL')}</span>
                       </div>
                       <input type="range" min="30000" max="200000" step="5000" value={simPrice} onChange={(e)=>setSimPrice(+e.target.value)} className="w-full h-1.5 bg-border rounded-full appearance-none accent-gold cursor-pointer" />
                     </div>
                     <div>
                       <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-gray mb-4">
                         <span>Comisión del hotel</span>
                         <span className="font-bold text-char">{simComm}%</span>
                       </div>
                       <input type="range" min="10" max="20" value={simComm} onChange={(e)=>setSimComm(+e.target.value)} className="w-full h-1.5 bg-border rounded-full appearance-none accent-gold cursor-pointer" />
                     </div>
                   </div>
                   <div className="bg-white border border-border text-char rounded-2xl p-10 flex flex-col justify-center items-center text-center shadow-sm">
                      <div className="text-[0.6rem] uppercase tracking-[0.25em] text-gray mb-3 font-bold">Ingreso mensual estimado</div>
                      <div className="font-serif text-5xl lg:text-6xl text-gold">${commission.toLocaleString('es-CL')}</div>
                      <div className="text-[0.7rem] text-gray mt-2 mb-10">Proyección 30 días operando</div>
                      <div className="w-full grid grid-cols-2 gap-y-6 pt-10 border-t border-border">
                        <div className="text-left">
                          <div className="text-[0.55rem] uppercase text-gray mb-1 font-bold">Servicios/mes</div>
                          <div className="text-lg font-serif">{services}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[0.55rem] uppercase text-gray mb-1 font-bold">Facturación Total</div>
                          <div className="text-lg font-serif">${totalSales.toLocaleString('es-CL')}</div>
                        </div>
                        <div className="col-span-2 text-center mt-2">
                          <div className="text-[0.55rem] uppercase text-gold mb-1 font-bold">Proyección Anual Estimada</div>
                          <div className="text-3xl font-serif text-gold-d">${(commission * 12).toLocaleString('es-CL')}</div>
                        </div>
                      </div>
                   </div>
                 </div>
               </div>
            </section>
          </motion.div>
        )}

        {activeSubTab === 'catalogo' && (
          <motion.div key="catalogo" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="py-20 lg:py-32 px-6 max-w-6xl mx-auto">
             <div className="text-center mb-16 lg:mb-20">
                <div className="text-gold text-[0.6rem] tracking-[0.3em] uppercase font-bold mb-4">Catálogo B2B</div>
                <h2 className="editorial-title text-4xl lg:text-5xl mt-2 mb-4">Servicios In-Room para Hoteles</h2>
                <p className="text-gray text-sm max-w-xl mx-auto">Una selección de nuestras experiencias más solicitadas por huéspedes internacionales. Todos los servicios incluyen ambientación, equipos profesionales y productos de la más alta gama.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 {
                   name: 'Spa Anti-Jetlag',
                   duration: '90 min',
                   desc: 'Masaje de tejido profundo con aromaterapia relajante y reflexología, diseñado especialmente para viajeros internacionales buscando recuperar su ritmo circadiano.',
                   category: 'Wellness'
                 },
                 {
                   name: 'Corte & Styling Ejecutivo',
                   duration: '60 min',
                   desc: 'Servicio premium de peluquería y barbería en la comodidad de la habitación antes de una reunión importante o evento de gala.',
                   category: 'Beauty'
                 },
                 {
                   name: 'Facial Revitalizante',
                   duration: '60 min',
                   desc: 'Limpieza profunda, exfoliación y mascarilla de oro o arcillas purificantes, ideal para combatir la deshidratación del vuelo.',
                   category: 'Skin Care'
                 },
                 {
                   name: 'Ritual Parejas Deluxe',
                   duration: '120 min',
                   desc: 'Masaje relajante en simultáneo para dos personas, con ambientación romántica, velas aromáticas y música de relajación.',
                   category: 'Wellness'
                 },
                 {
                   name: 'Maquillaje de Gala',
                   duration: '90 min',
                   desc: 'Maquillaje profesional HD de larga duración y peinado para eventos, bodas o galas. Productos de marcas de lujo europeas.',
                   category: 'Beauty'
                 },
                 {
                   name: 'In-Room Yoga',
                   duration: '60 min',
                   desc: 'Sesión privada de Vinyasa o Yin Yoga con un instructor certificado, adaptada al nivel del huésped, incluyendo meditación guiada.',
                   category: 'Fitness' /* O Wellness */
                 }
               ].map((service, i) => (
                 <div key={i} className="bg-white border border-border p-8 rounded-3xl shadow-sm hover:shadow-lux transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[0.6rem] uppercase tracking-widest text-gold-d font-bold bg-gold/10 px-3 py-1 rounded-full">{service.category}</span>
                       <span className="text-[0.65rem] text-char/50 flex items-center gap-1"><Clock size={12} /> {service.duration}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-char mb-3">{service.name}</h3>
                    <p className="text-gray text-sm leading-relaxed">{service.desc}</p>
                 </div>
               ))}
             </div>

             <div className="mt-16 text-center border-t border-border pt-16">
               <h3 className="editorial-title text-3xl mb-6">¿Busca otra experiencia para su huésped?</h3>
               <p className="text-gray text-sm mb-8 max-w-lg mx-auto">Nuestro equipo de concierge puede coordinar servicios personalizados como entrenadores personales, chefs privados o cualquier requerimiento a medida de su huésped.</p>
               <button onClick={() => setActiveSubTab('alianza')} className="btn btn-dark px-10">Crear Alianza</button>
             </div>
          </motion.div>
        )}

        {activeSubTab === 'portal' && (
          <motion.div key="portal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-20 lg:py-32 px-6 max-w-4xl mx-auto">
             <div className="text-center mb-16 lg:mb-20">
                <div className="text-gold text-[0.6rem] tracking-[0.3em] uppercase font-bold mb-4">Portal exclusivo · Hoteles aliados</div>
                <h2 className="editorial-title text-4xl lg:text-5xl mt-2 mb-4">Solicitar servicio para un huésped</h2>
                <p className="text-gray text-sm max-w-lg mx-auto">Complete la información del huésped y el servicio requerido. Confirmamos todas las solicitudes en menos de 30 minutos.</p>
             </div>
             <div className="bg-white border border-border p-10 lg:p-14 rounded-[2rem] shadow-lux grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                   <div className="border-b border-border pb-2 mb-6">
                     <h3 className="font-serif text-xl text-char">1. Datos del Hotel y Huésped</h3>
                   </div>
                   <div>
                     <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold mb-2 block">Hotel y Coordinador</label>
                     <input type="text" placeholder="Ej: Hotel W Santiago — Ana M." className="input-luxury" />
                   </div>
                   <div>
                     <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold mb-2 block">Nombre del Huésped</label>
                     <input type="text" placeholder="Majestad..." className="input-luxury" />
                   </div>
                   <div>
                     <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold mb-2 block">Habitación</label>
                     <input type="text" placeholder="412" className="input-luxury" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="border-b border-border pb-2 mb-6 mt-10 md:mt-0">
                     <h3 className="font-serif text-xl text-char">2. Detalles del Servicio</h3>
                   </div>
                   <div>
                     <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold mb-2 block">Categoría Solicitada</label>
                     <select className="input-luxury">
                        <option>Seleccionar servicio...</option>
                        <option>Masaje Relajante 90 min</option>
                        <option>Spa Parejas Deluxe</option>
                        <option>Corte & Peinado Pro</option>
                        <option>Facial Premium</option>
                        <option>Experiencia Personalizada</option>
                     </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold mb-2 block">Fecha</label>
                        <input type="date" className="input-luxury" />
                      </div>
                      <div>
                        <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold mb-2 block">Hora</label>
                        <input type="time" className="input-luxury" />
                      </div>
                   </div>
                   <div>
                     <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold mb-2 block">Notas / Alergias Especiales</label>
                     <textarea className="input-luxury min-h-[90px]" placeholder="Ej: Inglés nativo, ocasión aniversario, alergia a almendras..." />
                   </div>
                </div>
                <div className="col-span-1 md:col-span-2 mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="flex items-center gap-3 text-[0.65rem] text-char uppercase tracking-widest">
                     <Clock size={16} className="text-gold" />
                     <span>Confirmación impulsada por IA en <strong className="text-gold">menos de 30 minutos</strong></span>
                   </div>
                   <button className="btn btn-dark group px-12 py-4 w-full md:w-auto">
                     Enviar Solicitud <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}

        {activeSubTab === 'alianza' && (
          <motion.div key="alianza" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="py-20 lg:py-32 px-6 max-w-4xl mx-auto">
             <div className="text-center mb-16 lg:mb-20">
                <div className="text-gold text-[0.6rem] tracking-[0.3em] uppercase font-bold mb-4">Solo hoteles seleccionados</div>
                <h2 className="editorial-title text-4xl lg:text-5xl mt-2 mb-4">Solicite una alianza estratégica</h2>
                <p className="text-gray text-sm max-w-lg mx-auto">Complete el formulario a continuación. Respondemos cada solicitud personalmente en 24 horas hábiles.</p>
             </div>
             
             {showSuccess ? (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gold-l p-20 rounded-[3rem] text-center shadow-lux">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 text-gold">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="editorial-title text-3xl mb-4">Solicitud Recibida</h3>
                  <p className="text-gray text-sm mb-10 max-w-xs mx-auto">Su majestad, hemos recibido los datos de su hotel. Un concierge de alianzas se contactará en las próximas 24 horas.</p>
                  <button onClick={() => setShowSuccess(false)} className="btn btn-dark px-10">Entendido</button>
               </motion.div>
             ) : (
               <form onSubmit={handleAllianceSubmit} className="bg-white border border-border p-10 lg:p-14 rounded-[2rem] shadow-lux">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">Nombre del Hotel</label>
                      <input 
                        required
                        type="text" 
                        className="input-luxury" 
                        placeholder="Ej: The Ritz-Carlton" 
                        value={allianceForm.hotelName}
                        onChange={e => setAllianceForm({...allianceForm, hotelName: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">Categoría</label>
                      <select 
                        className="input-luxury"
                        value={allianceForm.category}
                        onChange={e => setAllianceForm({...allianceForm, category: e.target.value})}
                      >
                          <option>5 estrellas</option>
                          <option>Boutique Deluxe</option>
                          <option>Resort</option>
                          <option>Otro</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">Su Nombre y Cargo</label>
                      <input 
                        required
                        type="text" 
                        className="input-luxury" 
                        placeholder="Ej: María José - Concierge Jefe" 
                        value={allianceForm.contactName}
                        onChange={e => setAllianceForm({...allianceForm, contactName: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">Email corporativo</label>
                      <input 
                        required
                        type="email" 
                        className="input-luxury" 
                        placeholder="contacto@hotel.com" 
                        value={allianceForm.email}
                        onChange={e => setAllianceForm({...allianceForm, email: e.target.value})}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">¿Por qué le interesa esta alianza?</label>
                      <textarea 
                        className="input-luxury min-h-[120px]" 
                        placeholder="Cuéntenos sobre su hotel y cómo Reverencia Majestad podría sumar valor a sus huéspedes..." 
                        value={allianceForm.message}
                        onChange={e => setAllianceForm({...allianceForm, message: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="bg-ivory border-l-[3px] border-gold p-6 text-[0.75rem] text-char/70 leading-relaxed mb-10 italic rounded-r-xl">
                    "Su solicitud será evaluada según nuestros estándares de exclusividad y ubicación. Trabajamos exclusivamente con hoteles de alta gama en Santiago para garantizar la mejor experiencia para sus huéspedes."
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-magic w-full py-4 text-sm tracking-[0.2em]"
                  >
                    {loading ? 'Enviando...' : 'Enviar solicitud de alianza'} <ArrowRight size={16} className="ml-2 inline-block"/>
                  </button>
               </form>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem}
           type={selectedItem.type || 'hotel'}
          onClose={() => setSelectedItem(null)}
          onAction={() => { setSelectedItem(null); setActiveSubTab('alianza'); }}
        />
      )}
    </div>
  );
};

export default AlianzasView;
