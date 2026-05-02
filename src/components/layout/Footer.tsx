import React from 'react';
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF8F5] text-char pt-24 pb-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6">
          <div className="nav-logo cursor-pointer flex items-center">
            <img src="/logo.png" alt="Reverencia Majestad Logo" className="h-16 w-auto object-contain" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling!.style.display='block'; }} />
            <span style={{display: 'none'}} className="font-serif text-xl tracking-[0.18em]">
              Reverencia <em className="text-gold not-italic">Majestad</em>
            </span>
          </div>
          <p className="text-[0.75rem] text-gray leading-relaxed max-w-[280px]">
            Mas que una peluquería, un santuario de bienestar integral en Santiago de Chile. Tratamos a cada persona como <em>Su Majestad</em>.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-gold hover:text-white transition-all text-gray">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://wa.me/56963929354" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-gold hover:text-white transition-all text-gray">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-[0.6rem] tracking-widest uppercase font-bold text-gold mb-6">Explorar</h4>
          <ul className="space-y-4 text-[0.75rem] text-gray">
            <li><a href="#" className="hover:text-gold transition-colors">Servicios Premium</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Portal de Hoteles</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Tienda Online</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Membresías VIP</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-[0.6rem] tracking-widest uppercase font-bold text-gold mb-6">Legal</h4>
          <ul className="space-y-4 text-[0.75rem] text-gray">
            <li><a href="#" className="hover:text-gold transition-colors">Términos de Servicio</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Condiciones de Cancelación</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[0.6rem] tracking-widest uppercase font-bold text-gold mb-6">Contacto</h4>
          <ul className="space-y-4 text-[0.75rem] text-gray">
            <li className="flex items-center gap-3">
               <Phone className="w-4 h-4 text-gold shrink-0" />
               <a href="tel:+56963929354" className="hover:text-gold">+56 9 6392 9354</a>
            </li>
            <li className="flex items-center gap-3">
               <Mail className="w-4 h-4 text-gold shrink-0" />
               <div className="flex flex-col gap-1">
                 <a href="mailto:reverenciamajestad@gmail.com" className="hover:text-gold text-[0.7rem] break-all">reverenciamajestad@gmail.com</a>
                 <a href="mailto:reverenciamajestad@hotmail.com" className="hover:text-gold text-[0.7rem] break-all">reverenciamajestad@hotmail.com</a>
               </div>
            </li>
            <li className="flex items-center gap-3 mt-2">
               <MapPin className="w-4 h-4 text-gold shrink-0" />
               <span>Santiago, Chile</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-gray text-[0.65rem] tracking-widest uppercase">
        <p>© {currentYear} REVERENCIA MAJESTAD · TODOS LOS DERECHOS RESERVADOS</p>
        <p>CHILE · COLOMBIA · LATAM</p>
      </div>
    </footer>
  );
};

export default Footer;
