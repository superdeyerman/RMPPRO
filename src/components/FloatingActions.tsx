import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Gift, 
  Plus, 
  X, 
  Mail, 
  MapPin, 
  Calendar,
  Sparkles,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingActionsProps {
  onNotify: (m: string) => void;
  onNavigate: (t: string) => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ onNotify, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: 'bot'|'user', text: string}[]>([
    { sender: 'bot', text: 'Hola ✨ Soy tu concierge virtual. ¿Cómo puedo ayudarte hoy?' }
  ]);

  const toggleActions = () => setIsOpen(!isOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    
    const newHistory: {sender: 'bot'|'user', text: string}[] = [...chatHistory, { sender: 'user', text: chatMsg }];
    setChatHistory(newHistory);
    setChatMsg('');

    // Simulated bot response
    setTimeout(() => {
      let response = "Te puedo ayudar con reservas, precios o recomendaciones personalizadas. ¿En qué estás pensando?";
      const lower = chatMsg.toLowerCase();
      if (lower.includes('reserva')) response = "¡Claro! Te llevo directo a nuestro selector inteligente de experiencias.";
      if (lower.includes('precio')) response = "Nuestros servicios premium empiezan en $35.000. El precio exacto se calcula según su majestad lo requiera.";
      
      setChatHistory(prev => [...prev, { sender: 'bot', text: response }]);
    }, 1000);
  };

  const fabItems = [
    { icon: <Calendar size={20} />, label: 'Reservar ahora', action: () => { onNavigate('reservas'); setIsOpen(false); } },
    { icon: <Phone size={20} />, label: 'Llamar Concierge', action: () => onNotify('Llamando: +56 9 6392 9354') },
    { icon: <Gift size={20} />, label: 'Gift Card', action: () => { onNavigate('home'); setIsOpen(false); } },
    { icon: <Search size={20} />, label: 'Buscar (⌘K)', action: () => { setIsOpen(false); } },
  ];

  return (
    <>
      {/* WA FLOAT */}
      <a 
        href="https://wa.me/56963929354" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[1000] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
      >
        <MessageCircle size={28} />
      </a>
      
      {/* CART INDICATOR */}
      <div 
        className="fixed top-20 right-6 z-[1499] bg-gradient-to-br from-char to-[#2A2520] text-white px-5 py-2.5 rounded-full text-[0.72rem] hidden items-center gap-3 shadow-lg cursor-pointer"
        id="cart-indicator"
        onClick={() => onNavigate('reservas')}
      >
        <span className="bg-gold text-char rounded-full px-2 py-0.5 font-bold" id="cart-indicator-qty">0</span>
        servicios · <strong className="text-gold font-serif text-lg" id="cart-indicator-tot">$0</strong>
      </div>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-[1500] w-[360px] max-w-[calc(100vw-48px)] h-[520px] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col border border-border"
          >
            <div className="p-6 bg-char text-white flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-char font-serif text-lg relative">
                    R
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green rounded-full border-2 border-char" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Concierge RM</div>
                    <div className="text-[0.6rem] uppercase tracking-widest opacity-60">Responde al instante</div>
                  </div>
               </div>
               <button onClick={toggleChat} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ivory/30">
               {chatHistory.map((m, i) => (
                 <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-xs leading-relaxed ${m.sender === 'user' ? 'bg-char text-white rounded-br-none' : 'bg-white border border-border shadow-sm rounded-bl-none'}`}>
                     {m.text}
                   </div>
                 </div>
               ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-border flex items-center gap-3">
               <input 
                 type="text" 
                 value={chatMsg}
                 onChange={(e) => setChatMsg(e.target.value)}
                 placeholder="Escribe tu mensaje..."
                 className="flex-1 bg-cream/50 px-5 py-3 rounded-full text-xs focus:outline-none focus:border-gold transition-all"
               />
               <button type="submit" className="w-10 h-10 bg-char text-white rounded-full flex items-center justify-center hover:bg-gold hover:text-char transition-all">
                  <Plus size={20} className="rotate-45" />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB MENU */}
      <div className="fixed bottom-24 right-6 z-[1000] flex flex-col items-end gap-3 translate-y-[-60px]">
        <AnimatePresence>
          {isOpen && (
             <div className="flex flex-col items-end gap-3 mb-3">
                {fabItems.map((it, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={it.action}
                    className="flex items-center gap-3 group"
                  >
                    <span className="bg-char text-white text-[0.6rem] uppercase tracking-widest font-bold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lux">{it.label}</span>
                    <div className="w-12 h-12 bg-white rounded-full border border-border flex items-center justify-center text-char shadow-lux hover:bg-gold-l transition-all">
                      {it.icon}
                    </div>
                  </motion.button>
                ))}
             </div>
          )}
        </AnimatePresence>

        <button 
           onClick={toggleActions}
           className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${isOpen ? 'bg-char rotate-45' : 'bg-char hover:scale-110'}`}
        >
          {isOpen ? <X size={28} /> : <div className="font-serif text-2xl text-gold">✦</div>}
        </button>

        <button 
          onClick={toggleChat}
          className="w-14 h-14 bg-char text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative"
        >
           <Sparkles size={28} />
           <div className="absolute top-1 right-1 w-4 h-4 bg-green rounded-full border-2 border-char animate-pulse" />
        </button>
      </div>
    </>
  );
};

export default FloatingActions;
