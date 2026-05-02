import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  X, 
  ShoppingCart, 
  ArrowRight, 
  Star, 
  Heart,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import ProductDetailModal from '../components/ui/ProductDetailModal';

const TiendaView = ({ isAdmin = false }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    { id: '1', name: 'Aceite de Argán Real', price: 85000, category: 'Cuidado Capilar', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800', rating: 5 },
    { id: '2', name: 'Shampoo Restauración', price: 45000, category: 'Cuidado Capilar', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800', rating: 4.8 },
    { id: '3', name: 'Kit Extensiones Premium', price: 450000, category: 'Extensiones', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800', rating: 5 },
    { id: '4', name: 'Sérum Oro 24K', price: 95000, category: 'Lujo', image: 'https://images.unsplash.com/photo-1594125355935-db5930730146?auto=format&fit=crop&q=80&w=800', rating: 5 },
  ];

  const addToCart = (p: any) => {
    setCart([...cart, p]);
    setIsCartOpen(true);
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-transparent' : 'bg-cream pt-[120px] pb-32 text-char'}`}>
      <div className="max-w-7xl mx-auto px-6">
         
         {/* ── HERO ── */}
         {!isAdmin && (
           <header className="mb-24 pb-12 border-b border-border">
              <div className="label text-gold mb-4">La Boutique RM</div>
              <h1 className="editorial-title text-4xl lg:text-7xl mb-6">Elixires y <br /> <em className="text-gold italic">Cuidado de Autor.</em></h1>
              <p className="text-char/40 font-serif italic text-xl max-w-xl">“Una selección curada de los productos más exclusivos utilizados en nuestras experiencias de hotel.”</p>
           </header>
         )}

         <div className="flex flex-col lg:flex-row gap-20">
            {/* ── SIDEBAR ── */}
            <aside className="w-full lg:w-64 shrink-0 space-y-12">
               <div>
                  <h4 className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-char/20 mb-6">Selección por categoría</h4>
                  <ul className="space-y-4">
                     {['all', 'Extensiones', 'Cuidado Capilar', 'Lujo'].map(c => (
                       <li 
                         key={c}
                         onClick={() => setFilter(c)}
                         className={`text-[0.7rem] uppercase tracking-widest font-bold cursor-pointer transition-all ${filter === c ? 'text-gold' : 'text-char/30 hover:text-char'}`}
                       >
                          {c === 'all' ? 'Ver Todo' : c}
                       </li>
                     ))}
                  </ul>
               </div>

               <div className="bg-char p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden hidden lg:block">
                  <div className="relative z-10">
                     <Award className="text-gold mb-4" />
                     <div className="text-[0.6rem] uppercase tracking-widest text-gold font-bold mb-2">Suscripción VIP</div>
                     <p className="text-[0.75rem] font-serif italic opacity-60">Reciba un 10% de descuento automático en todas sus compras de la boutique.</p>
                  </div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/5 blur-3xl"></div>
               </div>
            </aside>

            {/* ── GRID ── */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
               {products.filter(p => filter === 'all' || p.category === filter).map(p => (
                 <motion.div 
                   layout
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   key={p.id} 
                   onClick={() => setSelectedProduct(p)}
                   className="group space-y-6 cursor-pointer"
                 >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-white border border-border shadow-lux group-hover:shadow-2xl transition-all duration-700">
                       <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2]" />
                       
                       <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       
                       <div className="absolute inset-x-8 bottom-8 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="btn btn-dark w-full !py-5 shadow-2xl">Añadir a su Selección</button>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <div className="text-[0.55rem] uppercase tracking-widest text-char/30 font-bold">{p.category}</div>
                             <h3 className="font-serif text-2xl group-hover:text-gold transition-colors">{p.name}</h3>
                          </div>
                          <div className="font-serif text-2xl text-gold-d">${p.price.toLocaleString()}</div>
                       </div>
                       <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < Math.floor(p.rating) ? "text-gold fill-gold" : "text-border"} />)}
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </div>

      {/* ── DRAWER ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-char/40 backdrop-blur-md z-[5000]" />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-[5001] flex flex-col p-12"
            >
               <button onClick={() => setIsCartOpen(false)} className="absolute top-10 right-10 text-char/20 hover:text-char"><X /></button>
               
               <div className="mb-12">
                  <div className="label text-gold mb-2">Su Carrito</div>
                  <h3 className="editorial-title text-4xl">Selección <br /> <em className="italic text-gold">Final.</em></h3>
               </div>

               <div className="flex-1 overflow-y-auto space-y-10 pr-4 scrollbar-hide">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center">
                       <div className="w-20 h-24 bg-cream rounded-2xl overflow-hidden shadow-sm shrink-0">
                          <img src={item.image} className="w-full h-full object-cover grayscale-[0.2]" />
                       </div>
                       <div className="flex-1">
                          <div className="text-[0.65rem] font-bold uppercase tracking-widest leading-none mb-1">{item.name}</div>
                          <div className="text-gold-d text-lg font-serif italic">${item.price.toLocaleString()}</div>
                          <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-[0.55rem] text-char/20 uppercase tracking-widest font-bold mt-2 hover:text-red transition-colors">Retirar</button>
                       </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="text-center py-20 text-char/20 font-serif italic text-2xl">Sin artículos elegidos.</div>
                  )}
               </div>

               <div className="pt-12 border-t border-border mt-10 space-y-8">
                  <div className="flex justify-between items-end">
                     <span className="uppercase text-[0.6rem] font-bold tracking-[0.4em] text-char/30">Total Inversión</span>
                     <span className="font-serif text-3xl text-gold-d">${total.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-[0.55rem] uppercase tracking-widest font-bold text-char/40">
                        <ShieldCheck size={14} className="text-gold" /> Embalaje de lujo biodegradable incluido
                     </div>
                     <button className="btn btn-dark w-full !py-6 text-lg group">
                        Finalizar Pedido <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          products={products}
          onClose={() => setSelectedProduct(null)}
          addToCart={(p) => { addToCart(p); setSelectedProduct(null); }}
        />
      )}
    </div>
  );
};

export default TiendaView;
