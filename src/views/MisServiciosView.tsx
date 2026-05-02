import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Clock, 
  DollarSign, 
  Plus, 
  X, 
  Check
} from 'lucide-react';
import { 
  onSnapshot,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  doc
} from '../firebase';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';

const MisServiciosView = () => {
  const { user } = useAuth();
  const [servicios, setServicios] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newServicio, setNewServicio] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: '',
    categoria: 'Restauración'
  });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'services'), where('stylistId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServicios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'services'), {
        ...newServicio,
        stylistId: user.uid,
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setNewServicio({ nombre: '', descripcion: '', precio: '', duracion: '', categoria: 'Restauración' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-serif uppercase tracking-widest mb-2">Mis Servicios</h2>
          <p className="text-xs text-gray uppercase tracking-widest">Gestión de Catálogo Profesional</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-premium flex items-center gap-3">
          <Plus className="w-4 h-4" />
          <span>Añadir Servicio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicios.map(servicio => (
          <div key={servicio.id} className="bg-white p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]">
                <Scissors className="w-8 h-8" />
              </div>
              <span className="text-[8px] uppercase tracking-widest font-bold text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-full">{servicio.categoria}</span>
            </div>
            <h4 className="text-xl font-serif mb-4">{servicio.nombre}</h4>
            <p className="text-xs text-gray mb-8 leading-relaxed">{servicio.descripcion}</p>
            <div className="flex items-center justify-between pt-8 border-t border-border">
              <div className="flex items-center gap-2 text-gray">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{servicio.duracion} min</span>
              </div>
              <p className="text-xl font-serif text-[#c5a059]">${servicio.precio}</p>
            </div>
          </div>
        ))}
        {servicios.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Scissors className="text-char/20 w-8 h-8" />
            </div>
            <p className="text-sm text-gray uppercase tracking-widest">No tiene servicios registrados.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-char/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-serif">Nuevo Servicio</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-[#f5f2ed] flex items-center justify-center text-gray hover:text-char transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddServicio} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray ml-4">Nombre del Servicio</label>
                  <input 
                    required
                    type="text" 
                    className="input-luxury"
                    value={newServicio.nombre}
                    onChange={e => setNewServicio({...newServicio, nombre: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray ml-4">Categoría</label>
                  <select 
                    className="input-luxury"
                    value={newServicio.categoria}
                    onChange={e => setNewServicio({...newServicio, categoria: e.target.value})}
                  >
                    <option>Restauración</option>
                    <option>Extensiones</option>
                    <option>Color</option>
                    <option>Corte</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray ml-4">Descripción</label>
                <textarea 
                  required
                  className="input-luxury h-32 py-4 resize-none"
                  value={newServicio.descripcion}
                  onChange={e => setNewServicio({...newServicio, descripcion: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray ml-4">Precio ($)</label>
                  <input 
                    required
                    type="number" 
                    className="input-luxury"
                    value={newServicio.precio}
                    onChange={e => setNewServicio({...newServicio, precio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray ml-4">Duración (min)</label>
                  <input 
                    required
                    type="number" 
                    className="input-luxury"
                    value={newServicio.duracion}
                    onChange={e => setNewServicio({...newServicio, duracion: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full btn-premium py-6 text-xs mt-4">Guardar Servicio</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisServiciosView;
