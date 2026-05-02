import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Star, ChevronRight, ChevronLeft } from 'lucide-react';

interface ProductDetailModalProps {
  product: any;
  products: any[];
  onClose: () => void;
  addToCart: (product: any) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, products, onClose, addToCart }) => {
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-char/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto p-12 relative"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-10 right-10 p-3 bg-cream rounded-full hover:bg-gold hover:text-white transition-all text-char z-10">
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-cream relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div className="space-y-8 flex flex-col justify-center">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gray font-bold">{product.category}</p>
              <h2 className="editorial-title text-4xl lg:text-5xl leading-tight">{product.name}</h2>
              <p className="text-2xl font-serif text-gold">${product.price}</p>
              <p className="text-gray leading-relaxed text-sm lg:text-base font-light">{product.description}</p>
              
              <div className="pt-6">
                <button 
                  onClick={() => addToCart(product)}
                  className="btn btn-gold rounded-full w-full py-5 px-12 flex justify-center items-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all text-xs tracking-[0.2em]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  AÑADIR AL CARRITO
                </button>
                <div className="text-center mt-6">
                  <span className="text-[0.6rem] uppercase tracking-widest text-gray/50 font-mono">www.reverenciamajestad.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-border pt-16">
              <h3 className="text-2xl font-serif mb-10 text-char">Colección Relacionada</h3>
              <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
                {relatedProducts.map(p => (
                  <div key={p.id} className="w-64 shrink-0 group cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-cream">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply" />
                    </div>
                    <h4 className="font-serif text-lg text-char mb-1">{p.name}</h4>
                    <p className="text-gold font-sans text-sm">${p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;
