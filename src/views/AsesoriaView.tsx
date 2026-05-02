import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Camera, 
  Plus, 
  Crown, 
  Check, 
  X
} from 'lucide-react';
import { 
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
  addDoc
} from '../firebase';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';

interface AsesoriaViewProps {
  setActiveTab: (tab: string) => void;
}

const AsesoriaView: React.FC<AsesoriaViewProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [asesorias, setAsesorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsesoria, setSelectedAsesoria] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'asesorias'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAsesorias(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'asesorias');
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#f5f2ed]">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-serif uppercase tracking-widest mb-2">Mis Asesorías</h2>
          <p className="text-xs text-gray uppercase tracking-widest">Diagnóstico capilar inteligente</p>
        </div>
        <button 
          onClick={() => setActiveTab('chat')}
          className="btn-premium flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Asesoría</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {asesorias.map(asesoria => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={asesoria.id} 
            className="bg-white p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <span className="text-[8px] uppercase tracking-widest font-bold text-gray">
                {new Date(asesoria.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            
            <div className="mb-4">
              <span className={`text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                asesoria.prioridad === 'alta' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
              }`}>
                Prioridad {asesoria.prioridad}
              </span>
            </div>

            <h4 className="text-xl font-serif mb-4 text-[#c5a059]">{asesoria.tipo_servicio}</h4>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full mt-1.5 shrink-0"></div>
                <p className="text-xs text-gray leading-relaxed italic line-clamp-3">"{asesoria.resumen}"</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedAsesoria(asesoria)}
              className="w-full btn-premium py-4 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Ver Detalles Completos
            </button>
          </motion.div>
        ))}
        
        {asesorias.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm text-[#c5a059]">
              <Camera className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-serif mb-4 italic">"Su majestad, aún no hemos realizado su primer diagnóstico."</h3>
            <p className="text-xs text-gray uppercase tracking-widest mb-8 max-w-md mx-auto leading-relaxed">
              Inicie una conversación con nuestra IA para recibir una asesoría personalizada y profesional.
            </p>
            <button 
              onClick={() => setActiveTab('chat')}
              className="btn-premium px-12 py-5"
            >
              Iniciar Asesoría IA
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAsesoria && (
          <div className="fixed inset-0 bg-char/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif">Detalle de Asesoría</h3>
                    <p className="text-[8px] uppercase tracking-widest text-gray">Diagnóstico del {new Date(selectedAsesoria.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAsesoria(null)} className="w-10 h-10 rounded-full bg-[#f5f2ed] flex items-center justify-center text-gray hover:text-char transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-[#f5f2ed] rounded-[2.5rem]">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray mb-2">Servicio Recomendado</p>
                    <p className="text-xl font-serif text-[#c5a059]">{selectedAsesoria.tipo_servicio}</p>
                  </div>
                  <div className="p-8 bg-[#f5f2ed] rounded-[2.5rem]">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray mb-2">Prioridad</p>
                    <p className="text-xl font-serif uppercase tracking-widest">{selectedAsesoria.prioridad}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray mb-4">Resumen del Diagnóstico</h4>
                  <p className="text-sm text-gray leading-relaxed italic bg-white p-6 rounded-3xl border border-border">
                    "{selectedAsesoria.resumen}"
                  </p>
                </div>

                {selectedAsesoria.productos_sugeridos && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray mb-4">Productos Sugeridos</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedAsesoria.productos_sugeridos.map((p: string, i: number) => (
                        <span key={i} className="px-6 py-3 bg-white border border-border rounded-full text-[10px] uppercase tracking-widest font-bold text-[#c5a059] shadow-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray mb-4">Próximos Pasos</h4>
                  <p className="text-sm text-gray leading-relaxed">
                    {selectedAsesoria.proximos_pasos}
                  </p>
                </div>

                <div className="pt-8 border-t border-border flex gap-4">
                  <button 
                    onClick={() => {
                      setSelectedAsesoria(null);
                      setActiveTab('agenda');
                    }}
                    className="flex-1 btn-premium py-6 text-xs"
                  >
                    Agendar Cita
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedAsesoria(null);
                      setActiveTab('tienda');
                    }}
                    className="flex-1 bg-[#1a1a1a] text-white rounded-full py-6 text-[10px] uppercase tracking-widest font-bold hover:bg-[#c5a059] transition-all"
                  >
                    Ver Productos
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AsesoriaView;
