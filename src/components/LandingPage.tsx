import React from 'react';
import { motion } from 'motion/react';
import { Crown, Scissors, Sparkles, MapPin, Star, ChevronRight, Instagram, Facebook, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-[#c5a059] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="RM Logo" className="h-10 w-auto object-contain" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling!.style.display='flex'; }} />
          <div style={{display: 'none'}} className="flex-col">
            <span className="text-xl font-serif tracking-[0.2em] uppercase leading-none">Reverencia</span>
            <span className="text-[8px] tracking-[0.4em] uppercase text-[#c5a059] font-light mt-1">Majestad</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-medium">
          <a href="#servicios" className="hover:text-[#c5a059] transition-colors">Servicios</a>
          <a href="#nosotros" className="hover:text-[#c5a059] transition-colors">Nosotros</a>
          <a href="#alianzas" className="hover:text-[#c5a059] transition-colors">Alianzas</a>
          <button onClick={onLogin} className="btn-premium">Acceso Privado</button>
        </div>
        <button className="md:hidden text-[#c5a059]">
          <div className="w-6 h-0.5 bg-current mb-1.5"></div>
          <div className="w-6 h-0.5 bg-current mb-1.5"></div>
          <div className="w-4 h-0.5 bg-current ml-auto"></div>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Hair Salon" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#c5a059] mb-6 block font-medium">Beauty Concierge & Hair Restoration</span>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-[1.1] tracking-tight">
              La Majestad de tu <br /> <span className="italic text-[#c5a059]">Transformación</span>
            </h1>
            <p className="text-sm md:text-base text-gray mb-12 max-w-xl mx-auto leading-relaxed font-light">
              Experiencia de lujo en restauración capilar y extensiones premium. Llevamos el salón de cinco estrellas a la comodidad de tu hogar o habitación de hotel.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button onClick={onLogin} className="btn-premium px-12 py-5">Reservar Experiencia</button>
              <a href="#servicios" className="btn-outline px-12 py-5">Ver Catálogo</a>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[8px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-char/20"></div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-32 px-8 bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a059] mb-4 block">Nuestras Especialidades</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">Servicios de Alta Gama <br /> para Cabellos Exigentes</h2>
            </div>
            <p className="text-sm text-gray max-w-xs leading-relaxed">
              Cada tratamiento es una obra de arte personalizada, diseñada para restaurar la salud y potenciar la belleza natural.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Restauración Profunda",
                desc: "Tratamientos intensivos con tecnología de vanguardia para cabellos dañados.",
                icon: <Sparkles className="w-6 h-6" />,
                img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Extensiones Premium",
                desc: "Cabello 100% humano de la más alta calidad con técnicas imperceptibles.",
                icon: <Crown className="w-6 h-6" />,
                img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Beauty at Home",
                desc: "Servicio exclusivo a domicilio y en hoteles con estándares de cinco estrellas.",
                icon: <MapPin className="w-6 h-6" />,
                img: "https://images.unsplash.com/photo-1620331713240-ed6fd4114454?auto=format&fit=crop&q=80&w=800"
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] mb-8">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-char/20 group-hover:bg-char/40 transition-colors"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
                    <p className="text-xs text-white/80 uppercase tracking-widest">Saber más</p>
                  </div>
                </div>
                <p className="text-sm text-gray leading-relaxed px-4">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Alliances */}
      <section id="alianzas" className="py-32 px-8 bg-[#1a1a1a] text-white rounded-[4rem] mx-4 md:mx-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a059] mb-6 block">Alianzas Corporativas</span>
            <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">El Aliado de Lujo para <br /> Hoteles y Hospedajes</h2>
            <p className="text-base text-white/60 mb-12 leading-relaxed font-light">
              Ofrecemos un servicio de Beauty Concierge integrado para sus huéspedes. Transformamos habitaciones en spas privados con atención inmediata y profesional.
            </p>
            <ul className="space-y-6 mb-12">
              {[
                "Servicio In-Room en menos de 60 minutos",
                "Estilistas bilingües y altamente calificados",
                "Facturación corporativa simplificada",
                "Garantía de satisfacción premium"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-sm font-light">
                  <div className="w-5 h-5 rounded-full border border-[#c5a059] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn-premium bg-[#c5a059] hover:bg-white hover:text-[#1a1a1a]">Solicitar Alianza</button>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200" 
                alt="Luxury Hotel Service" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[2rem] text-[#1a1a1a] hidden md:block shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <Star className="text-[#c5a059] fill-[#c5a059] w-4 h-4" />
                <Star className="text-[#c5a059] fill-[#c5a059] w-4 h-4" />
                <Star className="text-[#c5a059] fill-[#c5a059] w-4 h-4" />
                <Star className="text-[#c5a059] fill-[#c5a059] w-4 h-4" />
                <Star className="text-[#c5a059] fill-[#c5a059] w-4 h-4" />
              </div>
              <p className="text-xl font-serif italic mb-2">"Servicio impecable"</p>
              <p className="text-[10px] uppercase tracking-widest text-gray">Hotel Ritz Carlton Guest</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-border mt-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="RM Logo" className="h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling!.style.display='flex'; }} />
              <div style={{display: 'none'}} className="flex-col">
                <span className="text-xl font-serif tracking-[0.2em] uppercase leading-none">Reverencia</span>
                <span className="text-[8px] tracking-[0.4em] uppercase text-[#c5a059] font-light mt-1">Majestad</span>
              </div>
            </div>
            <p className="text-sm text-gray max-w-sm leading-relaxed mb-8">
              Redefiniendo el lujo capilar a través de la restauración profunda y la exclusividad del servicio personalizado.
            </p>
            <div className="flex gap-6">
              <Instagram className="w-5 h-5 text-gray hover:text-[#c5a059] cursor-pointer" />
              <Facebook className="w-5 h-5 text-gray hover:text-[#c5a059] cursor-pointer" />
              <MessageCircle className="w-5 h-5 text-gray hover:text-[#c5a059] cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Explorar</h4>
            <ul className="space-y-4 text-sm text-gray">
              <li className="hover:text-[#c5a059] cursor-pointer">Servicios</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Tienda</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Alianzas</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray">
              <li>Santiago, Chile</li>
              <li>+56 9 6392 9354</li>
              <li>reverenciamajestad@gmail.com</li>
              <li>reverenciamajestad@hotmail.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-border mt-20 pt-8 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-[10px] text-gray uppercase tracking-widest">© 2024 Reverencia Majestad. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] text-gray uppercase tracking-widest">
            <span>Privacidad</span>
            <span>Términos</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
