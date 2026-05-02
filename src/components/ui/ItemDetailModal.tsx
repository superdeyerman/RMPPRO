import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Calendar, MapPin, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ItemDetailModalProps {
  item: any;
  type: 'service' | 'professional' | 'hotel' | 'package' | null;
  onClose: () => void;
  onAction?: (item: any) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, type, onClose, onAction }) => {
  const navigate = useNavigate();

  if (!item || !type) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-char/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10 border border-border">
            <X size={20} />
          </button>

          {type === 'service' && (
            <div className="flex flex-col">
              <div className="h-48 bg-gradient-to-br from-gold-l to-ivory relative flex items-center justify-center overflow-hidden">
                <span className="text-6xl drop-shadow-xl">
                  {item.icon || (item.category === 'Beauty' ? '💇' : item.category === 'Wellness' ? '🌿' : '✨')}
                </span>
                <div className="absolute top-4 left-4"><span className="tag shadow-sm">{item.category}</span></div>
                <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs flex items-center gap-2 shadow-sm font-medium">
                   <div className="w-2 h-2 rounded-full bg-green animate-pulse" /> Disponible para reservar
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                   <div>
                      <h2 className="editorial-title text-4xl leading-tight mb-2">{item.name}</h2>
                      <div className="text-gray flex items-center gap-2 text-sm">
                        <Star size={14} className="text-gold fill-gold" /> 
                        <span className="font-medium text-char">{item.rating || '5.0'}</span> 
                        <span className="opacity-60">({item.bookings?.length || 120} valoraciones)</span>
                      </div>
                   </div>
                   <div className="bg-ivory border border-border px-4 py-2 rounded-xl text-center min-w-[120px]">
                      <div className="text-[0.6rem] uppercase tracking-widest text-gold-d mb-1 font-bold">Valor Base</div>
                      <div className="font-serif text-2xl text-char">${Number(item.price).toLocaleString('es-CL')}</div>
                   </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-gray mb-3 font-bold">Sobre esta experiencia</h3>
                  <p className="text-gray/90 leading-relaxed font-light">{item.description || 'Experiencia exclusiva diseñada para su bienestar integral. Seleccionamos los mejores productos y técnicas para brindarle un servicio digno de la realeza en la comodidad de su espacio preferido.'}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-cream p-4 rounded-xl text-center border border-border">
                    <Calendar size={18} className="mx-auto text-gold mb-2" />
                    <div className="text-[0.65rem] uppercase text-gray mb-1">Duración</div>
                    <div className="font-medium text-sm text-char">{item.duration_minutes || 60} min</div>
                  </div>
                  <div className="bg-cream p-4 rounded-xl text-center border border-border">
                    <MapPin size={18} className="mx-auto text-gold mb-2" />
                    <div className="text-[0.65rem] uppercase text-gray mb-1">Modalidad</div>
                    <div className="font-medium text-sm text-char">Domicilio / Hotel</div>
                  </div>
                  <div className="bg-cream p-4 rounded-xl text-center border border-border">
                    <Award size={18} className="mx-auto text-gold mb-2" />
                    <div className="text-[0.65rem] uppercase text-gray mb-1">Calidad</div>
                    <div className="font-medium text-sm text-char">Premium 5★</div>
                  </div>
                  <div className="bg-cream p-4 rounded-xl text-center border border-border">
                    <Star size={18} className="mx-auto text-gold mb-2" />
                    <div className="text-[0.65rem] uppercase text-gray mb-1">Garantía</div>
                    <div className="font-medium text-sm text-char">Total</div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onClose();
                    if (onAction) onAction(item);
                  }} 
                  className="btn btn-gold w-full py-4 text-sm tracking-[0.2em] shadow-xl hover:shadow-2xl hover:shadow-gold/20 flex items-center justify-center gap-2"
                >
                  <Calendar size={18} /> AGENDAR EXPERIENCIA
                </button>
              </div>
            </div>
          )}

          {type === 'professional' && (
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="w-32 h-32 rounded-full flex-shrink-0 bg-gold-l flex items-center justify-center font-serif text-4xl text-gold-d border-4 border-white shadow-lg relative">
                  {item.init}
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green border-4 border-white" title="Disponible ahora" />
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-widest text-gold-d mb-2 font-bold">{item.role}</div>
                  <h2 className="editorial-title text-4xl leading-tight mb-2">{item.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray">
                     <span className="flex items-center gap-1"><Star size={14} className="text-gold fill-gold" /> 5.0 Rating</span>
                     <span>·</span>
                     <span>+200 servicios realizados</span>
                     <span>·</span>
                     <span className="text-green font-medium text-xs bg-green/10 px-2 py-0.5 rounded-full">Background Check ✓</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-[0.15em] text-gray mb-3 font-bold">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {item.spec.split(', ').map((s: string, j: number) => <span key={j} className="text-xs px-3 py-1.5 bg-ivory border border-border rounded-full text-char font-medium">{s}</span>)}
                </div>
              </div>

              <div className="bg-cream border border-border p-6 rounded-2xl mb-8">
                 <p className="font-serif text-lg italic text-char/80 leading-relaxed border-l-2 border-gold/40 pl-4">
                   "Mi objetivo es revelar la mejor versión de cada cliente. Trabajo exclusivamente con herramientas de alta gama técnica y productos orgánicos, asegurando una experiencia revitalizante en cada sesión."
                 </p>
              </div>

              <button 
                  onClick={() => {
                    onClose();
                    if (onAction) onAction(item);
                  }} 
                  className="btn btn-dark w-full py-4 text-sm tracking-[0.2em]"
                >
                  SOLICITAR SERVICIO CON {item.name.split(' ')[0].toUpperCase()} →
                </button>
            </div>
          )}

          {type === 'hotel' && (
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-3xl mb-6">
                {item.icon}
              </div>
              <div className="text-[0.65rem] uppercase tracking-widest text-gold-d mb-2 font-bold">{item.loc}</div>
              <h2 className="editorial-title text-4xl leading-tight mb-2">{item.name}</h2>
              <div className="font-serif text-2xl text-char mb-6">Habitaciones desde ${item.price} / noche</div>

              <p className="text-gray/90 leading-relaxed font-light mb-8">
                Disfrute de una estadía de lujo con servicios premium de peluquería, masajes y cuidado facial directamente en su suite. Un oasis de bienestar en el medio de la ciudad de Santiago, con todos los servicios Reverencia Majestad a solo una llamada de distancia.
              </p>

              <button 
                onClick={() => {
                    onClose();
                    if (onAction) onAction(item);
                  }} 
                className="btn btn-gold w-full py-4 text-sm tracking-[0.2em] uppercase shadow-lg shadow-gold/20"
              >
                Reservar experiencia en {item.name}
              </button>
            </div>
          )}

          {type === 'package' && (
            <div className="p-8 text-center bg-gradient-to-br from-char to-neutral-900 text-white relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <div className="text-5xl mb-6 relative z-10">{item.icon}</div>
              <div className="text-[0.65rem] uppercase tracking-widest text-gold mb-2 font-bold relative z-10">Paquete Curado</div>
              <h2 className="editorial-title text-4xl text-white mb-4 relative z-10">{item.name}</h2>
              
              <p className="text-white/70 leading-relaxed font-light mb-8 max-w-sm mx-auto relative z-10">
                {item.desc}
              </p>

              <div className="flex flex-col items-center gap-2 mb-8 relative z-10">
                 <span className="font-serif text-5xl text-gold">${item.price}</span>
                 <div className="flex items-center gap-3">
                   <span className="text-sm text-white/40 line-through">Valor regular: ${item.was}</span>
                   <span className="bg-green/20 text-green px-2 py-0.5 rounded text-[0.65rem] font-bold tracking-tight border border-green/30">Ahorras {item.disc}</span>
                 </div>
              </div>

              <button 
                onClick={() => {
                  onClose();
                  if (onAction) onAction(item);
                }} 
                className="btn btn-gold w-full py-4 text-sm tracking-[0.2em] relative z-10 uppercase hover:scale-105"
              >
                Adquirir este paquete exclusivo
              </button>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ItemDetailModal;
