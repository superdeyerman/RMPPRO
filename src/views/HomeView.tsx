import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Star, 
  Heart,
  Gift,
  Award,
  Zap,
  Building,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Clock,
  Phone
} from 'lucide-react';
import ItemDetailModal from '../components/ui/ItemDetailModal';

interface HomeViewProps {
  setActiveTab?: (query: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setActiveTab }) => {
  const [services, setServices] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [counters, setCounters] = useState({ exp: 0, cat: 0, pro: 0, rat: 0 });
  const [selectedItem, setSelectedItem] = useState<{ type: 'service' | 'professional' | 'hotel' | 'package', data: any } | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
        else console.error('Invalid services data:', data);
        setLoading(false);
      });

    // Animate counters
    const target = { exp: 1250, cat: 9, pro: 16, rat: 5.0 };
    let frame = 0;
    const totalFrames = 80;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCounters({
        exp: Math.floor(target.exp * progress),
        cat: Math.floor(target.cat * progress),
        pro: Math.floor(target.pro * progress),
        rat: Number((target.rat * progress).toFixed(1))
      });
      if (frame === totalFrames) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (setActiveTab) setActiveTab(query);
  };

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category.toLowerCase() === filter.toLowerCase());

  const categories = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'Beauty', label: 'Beauty', icon: '💇' },
    { id: 'Wellness', label: 'Bienestar', icon: '🌿' },
    { id: 'Cuidado', label: 'Cuidado Especial', icon: '🤱' },
    { id: 'Fitness', label: 'Fitness', icon: '💪' },
    { id: 'Salud', label: 'Salud a domicilio', icon: '🏥' },
    { id: 'Gastronomía', label: 'Gastronomía', icon: '🍳' }
    ];

const heroImages = [
  "/images/foto1.png", // Primera imagen: logo o portada principal// Foto dinámica 2
];

const [heroIndex, setHeroIndex] = useState(0); // Guarda cuál imagen se está mostrando ahora

 useEffect(() => {
  const interval = setInterval(() => {
    setHeroIndex((prev) => (prev + 1) % heroImages.length); // Cambia a la siguiente imagen
  }, 4500); // Cambia cada 4.5 segundos

  return () => clearInterval(interval); // Limpia el intervalo para evitar errores
 }, []);

  //{/* ── HERO SECTION ── */}//
  return (

  <div className="animate-fade-up"> {/* Animación general de entrada */}
    <section className="min-h-[88vh] grid grid-cols-1 lg:grid-cols-2 relative bg-ivory"> {/* Hero dividido en 2 columnas */}

      {/* ── LADO IZQUIERDO: TEXTO Y BUSCADOR ── */}
      <div className="flex flex-col justify-center px-6 lg:px-20 py-12 lg:py-0"> {/* Contenedor izquierdo */}
        <div className="label mb-6 flex items-center gap-3"> {/* Etiqueta superior */}
          <span className="w-8 h-[1px] bg-gold" /> Santiago de Chile · Servicios Exclusivos
        </div>

        <h1 className="editorial-title text-5xl lg:text-7xl mb-6"> {/* Título principal */}
          Más que una peluquería,<br />
          <em className="italic text-gold">un santuario</em><br />
          de bienestar integral
        </h1>

        <p className="text-lg text-gray/90 font-light leading-relaxed max-w-lg mb-10"> {/* Texto descriptivo */}
          Somos la elección preferida de quienes entienden que verse bien empieza por sentirse bien.{" "}
          <strong className="text-char">
            Mientras más servicios eliges, mayor es tu descuento.
          </strong>
        </p>

        <div className="bg-white border border-border p-4 flex flex-col md:flex-row items-center gap-4 mb-8 rounded-lg shadow-sm max-w-2xl"> {/* Caja de búsqueda */}
          <div className="flex-1 w-full"> {/* Campo experiencia */}
            <label className="text-[0.6rem] uppercase tracking-widest text-gray mb-1 block">
              ¿Qué experiencia buscas?
            </label>

            <div className="flex items-center gap-2"> {/* Input con ícono */}
              <Search size={16} className="text-gold" />
              <input
                type="text"
                className="bg-transparent border-none outline-none text-sm w-full"
                placeholder="Yoga, chef privado, masaje..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          <div className="hidden md:block w-[1px] h-8 bg-border" /> {/* Separador */}

          <div className="flex-1 w-full"> {/* Campo fecha */}
            <label className="text-[0.6rem] uppercase tracking-widest text-gray mb-1 block">
              ¿Cuándo?
            </label>

            <div className="flex items-center gap-2 text-char/40 text-sm">
              <Calendar size={16} className="text-gold" />
              <span>Hoy · Flexible</span>
            </div>
          </div>

          <button onClick={handleSearch} className="btn btn-gold btn-sm w-full md:w-auto"> {/* Botón buscar */}
            Buscar →
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[0.72rem] text-gray"> {/* Indicadores inferiores */}
          <div className="flex items-center gap-2">
            <div className="live-dot" /> 12 profesionales disponibles ahora
          </div>
          <div className="w-1 h-1 rounded-full bg-gold-l" />
          <div>⭐ 5.0 · Reputación impecable</div>
          <div className="w-1 h-1 rounded-full bg-gold-l" />
          <div>🏨 12 hoteles 5★ aliados</div>
        </div>
      </div>

      {/* ── LADO DERECHO: HERO DINÁMICO CON FOTOS ── */}
      <div className="hidden lg:block relative overflow-hidden bg-[#EDE5DB]"> {/* Contenedor derecho solo desktop */}

        <div className="absolute inset-0 bg-gradient-to-br from-[#EDE5DB] via-[#D5C8B8] to-[#C2B09A]" /> {/* Fondo base elegante */}

        <motion.div
          key={heroIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
         <img
        src={window.location.origin + heroImages[heroIndex]}
        alt="Reverencia Majestad"
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          console.log("ERROR IMG:", e.currentTarget.src);
        }}

        />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" /> {/* Capa para que se vea más premium */}

        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="absolute bottom-10 left-10 bg-white/95 p-6 min-w-[240px] shadow-lux rounded-sm backdrop-blur"
          >
          <div className="flex items-center gap-2 text-green uppercase tracking-widest text-[0.6rem] mb-2">
            <div className="live-dot" /> Disponible ahora
          </div>

          <div className="font-serif text-lg mb-1">
            Ritual Spa Integral 90 min
          </div>

            <div className="text-[0.72rem] text-gray mb-2">
              Con Camila S. · ⭐ 5.0 · 287 sesiones
            </div>

            <div className="w-full h-[1px] bg-border my-2"></div>

            <div className="text-[0.72rem] text-gray flex items-center gap-2">
              <span className="text-gold">★★★★★</span>
              <span className="font-medium text-char">5.0</span>
              <span className="text-gray/70">· 370 reseñas en Google</span>
            </div>
        </motion.div>
          {/* Sello lujo */}
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.85 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="absolute bottom-10 right-10 w-28 h-28 rounded-full border border-white/50 bg-white/10 backdrop-blur-md flex items-center justify-center text-white/75 font-serif text-center text-xs tracking-[0.18em] uppercase"
            >
              5★<br />LUJOS
            </motion.div>
            
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="absolute top-24 right-10 bg-white/95 p-5 min-w-[200px] shadow-lux rounded-sm backdrop-blur"          >
          <div className="text-[0.58rem] uppercase tracking-widest text-gray mb-3">
            Profesionales online
          </div>

          <div className="flex flex-col gap-2">
            {[
              "Andrea M. — Estilista",
              "Camila S. — Terapeuta",
              "Valentina C. — Facial",
              "Valentina C. — Facial",
              "Sofía H. — En servicio",
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-[0.72rem]">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    p.includes("servicio") ? "bg-orange" : "bg-green"
                  }`}
                />
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
       {/* Texto editorial vertical */}
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.1, duration: 1 }}
    className="absolute right-8 top-1/2 -translate-y-1/2 writing-mode-vertical text-white/45 tracking-[0.45em] text-[0.7rem] uppercase"
    style={{ writingMode: "vertical-rl" }}
  >
    Luxury Hair & Spa Mobile
  </motion.div>
    </section>   
       
         {/* ── STATS STRIP ──*/}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border bg-white">
        {[
          { label: 'Experiencias realizadas', val: counters.exp, live: '+5 hoy' },
          { label: 'Áreas de cuidado integral', val: counters.cat, live: null },
          { label: 'Profesionales certificados', val: counters.pro, live: '12 online ahora' },
          { label: 'Reputación impecable', val: counters.rat.toFixed(1), live: null },
        ].map((s, i) => (
          <div key={i} className={`p-8 lg:p-10 border-r border-border last:border-none flex flex-col justify-center items-center text-center ${i === 1 ? 'h-[259.2px]' : ''}`}>
            <div className="font-serif text-4xl text-gold leading-none">{s.val}</div>
            <div className="text-[0.65rem] uppercase tracking-widest text-gray mt-2">{s.label}</div>
            {s.live && <div className="text-[0.62rem] text-green mt-1 flex items-center"><div className="live-dot" /> {s.live}</div>}
          </div>
        ))}
      </div>
      
           {/* ── STATS STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-border bg-white divide-x divide-y lg:divide-y-0 divide-border">
        {[
          { label: 'Experiencias de lujo', val: counters.exp, prefix: '+', suffix: '', desc: 'En todo Santiago' },
          { label: 'Categorías premium', val: counters.cat, prefix: '', suffix: '', desc: 'Bienestar y estilo' },
          { label: 'Profesionales', val: counters.pro, prefix: '', suffix: '+', desc: 'Certificados & VIP' },
          { label: 'Satisfacción', val: counters.rat.toFixed(1), prefix: '', suffix: '/5', desc: 'Basado en 370 reseñas' },
        ].map((s, i) => (
          <div key={i} className="p-10 lg:p-12 flex flex-col justify-center items-center text-center group hover:bg-cream/30 transition-colors">
            <div className="font-serif text-[2.5rem] lg:text-[3.2rem] text-char leading-none mb-3 group-hover:text-gold transition-colors">
              <span className="text-gold/60 font-light text-2xl align-super pr-1">{s.prefix}</span>
              {s.val}
              <span className="text-gold/60 font-light text-2xl pl-1">{s.suffix}</span>
            </div>
            <div className="text-[0.68rem] uppercase tracking-[0.15em] text-gold-d font-medium">{s.label}</div>
            <div className="text-[0.7rem] text-gray/60 mt-2">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {['Masaje a domicilio', 'Chef privado', 'Yoga en casa', 'Clases de piano', 'Estilista al hotel', 'Coaching ejecutivo', 'Pilates privado', 'Sommelier & Cata', 'Facial premium', 'Entrenador personal', 'Color & Balayage', 'Clases de inglés'].map((text, j) => (
                <React.Fragment key={j}>
                  <span className="marquee-item">{text}</span>
                  <span className="marquee-sep">✦</span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── GOOGLE REPUTATION SECTION ── */}
      <section className="py-20 px-6 lg:px-20 bg-gradient-to-br from-[#FBF8F2] to-white border-b border-gold-l">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="text-left">
            <div className="text-[0.62rem] tracking-[0.18em] uppercase text-gold-d mb-3">Nuestra reputación habla por nosotros</div>
            <h2 className="editorial-title text-4xl lg:text-5xl font-light leading-[1.25] mb-4">
              370 clientes nos dieron<br />
              <em className="text-gold-d italic">5 estrellas en Google</em>
            </h2>
            <p className="text-[0.88rem] text-gray/80 font-light leading-relaxed mb-8 max-w-lg">
              No somos nosotros quienes decimos que hacemos las cosas bien. Son cientos de personas reales, con nombre y apellido, que dejaron su testimonio público en Google. Tu tranquilidad está respaldada por la opinión de muchos otros que ya confiaron en nosotros.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white border border-border text-char px-5 py-3 rounded-md text-[0.78rem] font-medium transition-all hover:border-gold hover:shadow-md hover:-translate-y-[1px]">
                <svg className="w-[18px] h-[18px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Ver las 370 reseñas en Google →
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white border border-border rounded-2xl p-8 lg:p-10 shadow-lux relative overflow-hidden">
              <div className="absolute -top-[100px] -right-[100px] w-[260px] h-[260px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(251,188,4,0.08), transparent 70%)' }}></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                  <div>
                    <div className="text-[0.85rem] font-medium text-char leading-none mb-1">Reverencia Majestad</div>
                    <div className="text-[0.65rem] text-gray/80 font-light">Peluquería a Domicilio · Santiago de Chile</div>
                  </div>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <div className="font-serif text-[4.5rem] leading-none text-char font-normal">5.0</div>
                  <div className="text-[1.3rem] text-gray/60 font-serif font-light">/ 5.0</div>
                </div>
                <div className="text-[#fbbc04] text-[1.7rem] tracking-[2px] mb-3 leading-none">★★★★★</div>
                <div className="text-[0.85rem] text-gray/80 font-light mb-6">Basado en <strong className="text-char font-serif text-[1.1rem]">370 reseñas</strong> verificadas de Google</div>
                
                <div className="space-y-2">
                  {[
                    { stars: '5★', pct: '94%', w: 94 },
                    { stars: '4★', pct: '4%', w: 4 },
                    { stars: '3★', pct: '1%', w: 1 },
                    { stars: '2★', pct: '0%', w: 0 },
                    { stars: '1★', pct: '1%', w: 1 },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3 text-[0.72rem]">
                      <span className="text-[#fbbc04] w-6 shrink-0">{row.stars}</span>
                      <div className="flex-1 h-1.5 bg-gray-l rounded-full overflow-hidden">
                        <div className="h-full bg-[#fbbc04] rounded-full transition-all duration-1000" style={{ width: `${row.w}%` }}></div>
                      </div>
                      <span className="text-gray/60 w-8 text-right tabular-nums">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKETPLACE ── */}
      <section className="px-6 lg:px-20 py-20 bg-ivory">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <div className="label">Servicios Exclusivos</div>
            <h2 className="editorial-title text-4xl lg:text-5xl mt-2">Un universo de cuidado<br />a la medida de <em>Su Majestad</em></h2>
            <p className="text-gray text-sm mt-4 max-w-xl font-light">
              Agrega los servicios que desees al carrito. Elige dónde: en nuestro estudio privado, en tu hogar o en tu habitación de hotel. <strong className="text-gold-d">Mientras más eliges, más descuento obtienes.</strong>
            </p>
          </div>
          <button onClick={() => setActiveTab?.('reservas')} className="btn btn-outline btn-sm rounded-full">Ver todos los servicios</button>
        </div>

        {/* DISCOUNT LADDER */}
        <div className="discount-ladder group mb-12">
          <div className="dl-step"><div className="dl-n">1</div><div className="dl-t">servicio</div><div className="dl-p">Precio base</div></div>
          <div className="text-gold/40 px-2">→</div>
          <div className="dl-step"><div className="dl-n">2</div><div className="dl-t">servicios</div><div className="dl-p text-green font-bold">−5%</div></div>
          <div className="text-gold/40 px-2">→</div>
          <div className="dl-step"><div className="dl-n">3</div><div className="dl-t">servicios</div><div className="dl-p text-green font-bold">−10%</div></div>
          <div className="text-gold/40 px-2">→</div>
          <div className="dl-step featured shadow-xl scale-110"><div className="dl-n">4+</div><div className="dl-t text-white/50">servicios</div><div className="dl-p text-gold font-bold">−15%</div></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 text-[0.68rem] tracking-widest border rounded-full transition-all duration-300 shrink-0 ${filter === cat.id ? 'bg-char text-white border-char' : 'bg-white text-gray border-border hover:border-gold'}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.slice(0, 12).map((s, i) => (
            <motion.div 
              key={s.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedItem({ type: 'service', data: s })}
              className="svc-card group overflow-hidden"
            >
              <div className="h-44 bg-gradient-to-br from-gold-l to-ivory relative flex items-center justify-center overflow-hidden">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-500">
                  {s.icon || (s.category === 'Beauty' ? '✂' : s.category === 'Wellness' ? '🌿' : '✨')}
                </span>
                <div className="absolute top-3 left-3"><span className="tag">{s.category}</span></div>
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-[0.6rem] flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green" /> Disponible
                </div>
              </div>
              <div className="p-6 bg-white flex flex-col h-[180px]">
                <div className="text-[0.58rem] uppercase tracking-[0.1em] text-gold mb-2 font-medium">{s.category}</div>
                <h3 className="font-serif text-xl mb-2 text-char leading-snug">{s.name}</h3>
                <p className="text-[0.75rem] text-gray line-clamp-2 mb-4 leading-relaxed font-light">{s.description || 'Experiencia exclusiva diseñada para su bienestar integral.'}</p>
              </div>
              <div className="px-6 py-4 border-t border-border bg-ivory/50 flex justify-between items-center text-[0.8rem]">
                <div className="price-pill bg-gold-l/50 text-gold-d">Desde ${Number(s.price).toLocaleString('es-CL')}</div>
                <div className="text-gray flex items-center gap-1 text-xs">⭐ {s.rating || '5.0'} <span className="text-[0.65rem] opacity-60">({s.bookings?.length || 120})</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OUR TEAM ── */}
      <section className="px-6 lg:px-20 py-24 bg-white">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12 border-b border-border pb-10">
          <div>
            <div className="label">Nuestro equipo</div>
            <h2 className="editorial-title text-4xl lg:text-5xl mt-2">Profesionales certificados,<br />disponibles para ti ahora</h2>
            <p className="text-gray text-sm mt-4 max-w-xl">
              Cada profesional es cuidadosamente seleccionado por su excelencia y discreción. Conocemos su trayectoria, validamos sus certificaciones y garantizamos una experiencia de 5 estrellas.
            </p>
          </div>
          <button className="btn btn-outline btn-sm rounded-full">Quiero ser profesional</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { name: 'Andrea Molina', role: 'Estilista Senior', spec: 'Color, Balayage, Extensiones', rat: '5.0', init: 'AM' },
            { name: 'Camila Soto', role: 'Terapeuta SPA', spec: 'Masajes, Piedras Calientes', rat: '5.0', init: 'CS' },
            { name: 'Valentina Cruz', role: 'Especialista Facial', spec: 'Cosmetología, Rituales', rat: '5.0', init: 'VC' },
            { name: 'Sofía Herrera', role: 'Maquilladora Pro', spec: 'Novias, HD, Editorial', rat: '5.0', init: 'SH' },
          ].map((p, i) => (
            <div key={i} onClick={() => setSelectedItem({ type: 'professional', data: p })} className="pro-card border border-border p-6 rounded-2xl hover:shadow-lux transition-all cursor-pointer group hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-gold-l flex items-center justify-center font-serif text-xl text-gold-d border-2 border-white shadow-sm relative shrink-0">
                  {p.init}
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green border-2 border-white" />
                </div>
                <div>
                  <h4 className="font-serif text-lg leading-tight">{p.name}</h4>
                  <div className="text-[0.65rem] uppercase tracking-widest text-gold mt-1">{p.role}</div>
                  <div className="text-char/40 text-[0.72rem] mt-1">⭐ {p.rat} · +200 servicios</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {p.spec.split(', ').map((s, j) => <span key={j} className="text-[0.58rem] px-2 py-1 bg-ivory border border-border rounded-full text-gray">{s}</span>)}
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center text-[0.72rem]">
                <div className="font-medium text-gold-d">8 certif.</div>
                <div className="text-green font-medium">● Disponible hoy</div>
              </div>
            </div>
          ))}
        </div>

        {/* FOUNDER BANNER */}
        <div className="bg-ivory border border-border text-char p-8 lg:p-16 rounded-[3rem] grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-12 items-center relative overflow-hidden mt-12 mx-auto max-w-5xl shadow-sm">
           <div className="absolute top-[-40px] left-[-20px] font-serif text-[240px] text-gold/10 leading-none select-none">"</div>
           <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-gold to-gold-l mx-auto lg:mx-0 flex items-center justify-center font-serif text-5xl text-char shadow-[0_8px_30px_rgba(201,169,110,0.3)] relative z-10 font-bold">
             DR
           </div>
           <div className="relative z-10 text-center lg:text-left">
             <div className="text-[0.62rem] tracking-[0.18em] uppercase text-gold mb-3">Un mensaje del fundador</div>
             <h3 className="font-serif text-3xl lg:text-4xl mb-2 font-normal">Deyerman Rivero</h3>
             <div className="text-gray text-[0.78rem] mb-6">Fundador y Director · Reverencia Majestad</div>
             <p className="font-serif text-xl border-l-[3px] border-gold/40 pl-6 mb-8 leading-relaxed text-char/90 italic">
               "Reverencia Majestad nació de una idea sencilla y poderosa: que todas las personas merecen ser tratadas como <em className="text-gold not-italic font-medium text-2xl ml-2">Su Majestad</em>. Empezó como una peluquería a domicilio, y hoy es una plataforma de bienestar integral que dignifica el trabajo de profesionales de toda Latinoamérica."
             </p>
             <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <button className="btn btn-gold btn-sm rounded-full px-8 py-3">Conversar conmigo</button>
               <button className="btn btn-outline btn-sm rounded-full bg-white px-8 py-3">Únete al equipo</button>
             </div>
           </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 lg:px-20 py-24 bg-[#F8F6F2] text-char">
        <div className="text-[0.6rem] uppercase tracking-[0.22em] text-gold mb-4">Cómo funciona</div>
        <h2 className="editorial-title text-4xl lg:text-5xl mb-16">Cinco pasos hacia la experiencia perfecta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border border border-border overflow-hidden rounded-2xl shadow-sm">
          {[
            { n: '01', icon: <Search />, title: 'Elige tu experiencia', desc: 'Explora el catálogo, filtra por categoría y selecciona el profesional.' },
            { n: '02', icon: <Zap />, title: 'Precio dinámico', desc: 'Motor de precios en tiempo real. Cada variable ajusta el total automáticamente.' },
            { n: '03', icon: <div className="text-xl">💳</div>, title: 'Abono de $5.000', desc: 'Confirma tu hora con un mínimo abono. El saldo se paga al finalizar.' },
            { n: '04', icon: <Sparkles />, title: 'El profesional llega', desc: 'Puntual, equipado y preparado. Tu espacio se convierte en un santuario.' },
            { n: '05', icon: <Star />, title: 'Vive y repite', desc: 'Post-servicio de élite. Reseña y seguimiento de su majestad.' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-10 flex flex-col items-start group hover:bg-ivory transition-colors">
               <div className="font-serif text-[2.5rem] text-gold/30 mb-6 group-hover:text-gold transition-colors leading-none">{s.n}</div>
               <div className="text-gold mb-4">{s.icon}</div>
               <h4 className="font-serif text-lg mb-2">{s.title}</h4>
               <p className="text-gray text-[0.75rem] leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-6 lg:px-20 py-24 bg-ivory">
        <div className="label mb-4">Testimonios reales</div>
        <h2 className="editorial-title text-4xl lg:text-5xl mb-16">La diferencia que recordará siempre</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { author: 'Valentina R.', place: 'Las Condes', svc: 'Ritual Spa Integral', text: 'Jamás pensé que me iban a cuidar tan bien. La terapeuta llegó con todo lo necesario. Me sentí literalmente tratada como una reina.' },
             { author: 'Francisca M.', place: 'Vitacura', svc: 'Post-Parto Integral', text: 'Después de mi parto no tenía energía para salir. Constanza vino a casa, masaje post-parto, lactancia, todo. Me salvó el alma y el cuerpo.' },
             { author: 'Amanda T.', place: 'Ritz-Carlton', svc: 'Beauty Express', text: 'Viajo por trabajo y no podía ir a peluquería. La estilista llegó al hotel, me atendió en la suite y parecí de cover de revista.' },
           ].map((t, i) => (
             <div key={i} className="bg-white p-8 rounded-2xl border border-border flex flex-col justify-between">
                <div>
                   <div className="text-gold mb-6">★★★★★</div>
                   <p className="font-serif text-lg italic text-char/80 leading-relaxed mb-8">"{t.text}"</p>
                </div>
                <div>
                   <div className="text-[0.58rem] uppercase tracking-widest text-gold-d mb-2">{t.svc}</div>
                   <div className="font-bold text-sm text-char">{t.author}</div>
                   <div className="text-xs text-gray">{t.place}</div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* ── PAQUETES CURADOS ── */}
      <section className="px-6 lg:px-20 py-24 bg-white">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-16">
          <div>
            <div className="label">Paquetes curados</div>
            <h2 className="editorial-title text-4xl lg:text-5xl mt-2">Experiencias diseñadas<br />para momentos únicos</h2>
          </div>
          <div className="ai-chip">
            <Sparkles size={14} className="animate-pulse" /> Creados por nuestro equipo curatorial
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { name: 'Ritual Romance', icon: '💕', desc: 'Una noche inolvidable para dos. Spa, cena gourmet y ambiente sensorial.', price: '280.000', was: '340.000', disc: '-18%' },
             { name: 'Escape Wellness', icon: '🌿', desc: 'Desconexión total. Ideal para resetear cuerpo y mente.', price: '180.000', was: '220.000', disc: '-18%', feat: true },
             { name: 'Novia Perfecta', icon: '👰', desc: 'Todo lo necesario para tu día más importante. Prueba + evento.', price: '420.000', was: '520.000', disc: '-19%' },
             { name: 'Ejecutivo Premium', icon: '💼', desc: 'Para quienes viajan por negocios y no se detienen. Full service.', price: '150.000', was: '180.000', disc: '-17%' },
           ].map((p, i) => (
             <div key={i} onClick={() => setSelectedItem({ type: 'package', data: p })} className={`relative p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-lux cursor-pointer ${p.feat ? 'bg-gradient-to-br from-char to-neutral-900 text-white border-gold shadow-2xl' : 'bg-ivory border-border text-char hover:border-gold'}`}>
               {p.feat && <div className="absolute -top-3 right-6 text-[0.55rem] uppercase tracking-widest bg-gold text-char px-4 py-2 font-bold rounded-full shadow-lg">MÁS ELEGIDO</div>}
               <div className="text-4xl mb-6">{p.icon}</div>
               <h3 className={`font-serif text-2xl mb-2 ${p.feat ? 'text-gold' : ''}`}>{p.name}</h3>
               <p className={`text-[0.75rem] leading-relaxed mb-10 ${p.feat ? 'text-white/60' : 'text-gray'}`}>{p.desc}</p>
               <div className="flex items-baseline gap-2 mb-8">
                 <span className={`font-serif text-3xl ${p.feat ? 'text-gold' : 'text-gold-d'}`}>${p.price}</span>
                 <span className="text-[0.75rem] text-gray line-through opacity-50">${p.was}</span>
                 <span className="bg-green text-white px-2 py-0.5 rounded text-[0.6rem] font-bold tracking-tight">{p.disc}</span>
               </div>
               <button onClick={(e) => { e.stopPropagation(); setActiveTab?.('reservas'); }} className={`btn btn-sm btn-w rounded-full py-4 tracking-widest ${p.feat ? 'btn-gold shadow-lg shadow-gold/20' : 'btn-dark'}`}>Reservar paquete →</button>
             </div>
           ))}
        </div>
      </section>

      {/* ── HOTEL SECTION ── */}
      <section className="px-6 lg:px-20 py-32 bg-white text-char overflow-hidden relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.08)_0%,transparent_70%)]" />
         <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="label text-gold mb-6 tracking-[0.3em]">Hotel 5★ + Servicios Premium</div>
            <h2 className="editorial-title text-4xl lg:text-5xl mb-8 leading-tight">Tu habitación,<br />tu santuario personal</h2>
            <p className="text-gray text-lg lg:text-xl max-w-2xl mx-auto mb-16 font-light leading-relaxed">
               Reserva una habitación en los mejores hoteles 5★ de Santiago con servicios de belleza, spa y bienestar incluidos. Ideal para un día de paz, un retiro creativo o una escapada romántica.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
               {[
                 { name: 'Hotel W Santiago', loc: 'El Golf', price: '680K', icon: '✦' },
                 { name: 'Ritz-Carlton', loc: 'Las Condes', price: '420K', icon: '🏛' },
                 { name: 'Mandarin Oriental', loc: 'Vitacura', price: '750K', icon: '🌸' }
               ].map((h, i) => (
                 <div key={i} onClick={() => setSelectedItem({ type: 'hotel', data: h })} className="bg-ivory border border-border p-6 rounded-2xl hover:border-gold hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-2">
                    <div className="text-gold text-2xl mb-4 group-hover:scale-110 transition-transform">{h.icon}</div>
                    <div className="font-serif text-xl mb-1">{h.name}</div>
                    <div className="text-[0.65rem] uppercase tracking-widest text-gray mb-4">{h.loc}</div>
                    <div className="text-gold-d text-sm font-medium">Desde ${h.price} / noche</div>
                 </div>
               ))}
            </div>

            <button onClick={() => setActiveTab?.('reservas')} className="btn btn-gold px-12 py-5 rounded-full shadow-2xl shadow-gold/20 hover:scale-105 active:scale-95 transition-all text-sm tracking-[0.2em]">RESERVAR EXPERIENCIA HOTEL →</button>
            
            <div className="flex flex-wrap justify-center gap-8 text-[0.62rem] uppercase tracking-[0.25em] text-gray mt-20 font-bold">
               <span className="flex items-center gap-3 border border-border px-6 py-3 rounded-full"><Clock size={14} className="text-gold" /> Check-in flexible</span>
               <span className="flex items-center gap-3 border border-border px-6 py-3 rounded-full"><Gift size={14} className="text-gold" /> VIP Amenidades</span>
               <span className="flex items-center gap-3 border border-border px-6 py-3 rounded-full"><Award size={14} className="text-gold" /> Servicio a la suite</span>
            </div>
         </div>
      </section>

      {/* ── GIFT CARDS ── */}
      <section className="px-6 lg:px-20 py-24 bg-ivory border-t border-border relative">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="label mb-6">Gift Cards Reverencia Majestad</div>
              <h2 className="editorial-title text-4xl lg:text-6xl mb-8 leading-[1.1]">Regale una experiencia<br />inolvidable</h2>
              <p className="text-gray text-base leading-relaxed mb-12 max-w-md font-light">
                Válidas por 12 meses en cualquiera de nuestros +60 servicios. Envío digital instantáneo por WhatsApp o tarjeta física premium en estuche de lujo entregada a domicilio.
              </p>
              <div className="space-y-10">
                 <div>
                   <label className="text-[0.62rem] uppercase tracking-widest text-char mb-5 block font-bold">Monto del regalo</label>
                   <div className="flex gap-4">
                      {['$50K', '$100K', '$200K', '$500K'].map(m => (
                        <button key={m} className={`flex-1 py-4 border rounded-2xl font-serif text-xl transition-all duration-300 shadow-sm ${m==='$50K' ? 'bg-gold-l/30 text-gold-d border-gold scale-105' : 'bg-white border-border text-char hover:border-gold hover:bg-gold-l/5'}`}>{m}</button>
                      ))}
                    </div>
                  </div>
                  <button className="btn btn-dark px-12 py-5 rounded-full shadow-2xl tracking-[0.2em] text-xs">REGALAR AHORA →</button>
               </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[3rem]" />
              <div className="bg-white border border-border p-10 lg:p-14 rounded-[3rem] shadow-sm text-char aspect-[1.6/1] relative overflow-hidden flex flex-col justify-between transform -rotate-2 group-hover:rotate-0 transition-transform duration-700">
                 <div className="absolute top-[-60px] right-[-40px] text-gold/5 text-[22rem] leading-none select-none group-hover:scale-110 transition-transform duration-1000 rotate-12">✦</div>
                 <div className="relative z-20">
                   <div className="font-serif text-3xl tracking-[0.2em] uppercase text-char">REVERENCIA <em className="text-gold not-italic font-light">MAJESTAD</em></div>
                   <div className="text-[0.5rem] tracking-[0.5em] font-bold mt-3 text-gray uppercase">Premium Wellness & Beauty Card</div>
                 </div>
                 <div className="relative z-20">
                   <div className="text-[0.6rem] tracking-widest text-gray uppercase mb-3 font-semibold">Valor canjeable</div>
                   <div className="font-serif text-6xl lg:text-7xl text-gold font-light">$50.000</div>
                 </div>
                 <div className="relative z-20 flex justify-between items-end border-t border-border pt-8 mt-4">
                    <div className="text-[0.8rem] italic text-gray font-serif font-light">"Un detalle especial para ti..."</div>
                    <div className="text-[0.6rem] font-bold tracking-widest uppercase text-gray/50 font-mono">RM-ORD: 8829-SCL</div>
                 </div>
              </div>
            </div>
         </div>
      </section>

      {/* ── B2B STRIP ── */}
      <section className="bg-gold px-6 lg:px-20 py-16 flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="text-center lg:text-left relative z-10">
          <h2 className="editorial-title text-4xl text-char font-normal mb-2 leading-tight">¿Tu hotel merece ofrecer esto?</h2>
          <p className="text-char/60 text-lg font-light max-w-xl">Diferencie su establecimiento con servicios wellness de élite. Sin inversión inicial y con ingresos pasivos automáticos.</p>
        </div>
        <button onClick={() => setActiveTab?.('b2b')} className="btn btn-dark group px-10 py-5 rounded-full text-xs tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all relative z-10 overflow-hidden">
          <span className="relative z-10 flex items-center gap-3">VER MODELO DE ALIANZAS <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></span>
        </button>
      </section>
      {selectedItem && (
  <ItemDetailModal 
    item={selectedItem.data} 
    type={selectedItem.type} 
    onClose={() => setSelectedItem(null)}
    onAction={() => {
      if (selectedItem?.data?.id) {
        sessionStorage.setItem("selectedServiceId", String(selectedItem.data.id));
      } else {
        console.warn("Servicio sin ID:", selectedItem);
      }

      setSelectedItem(null);
      setActiveTab?.("reservas");
    }}
  />
)}

</div>
);
};

export default HomeView;