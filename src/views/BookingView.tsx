import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Building, 
  Sparkles, 
  Check, 
  X, 
  User, 
  Heart,
  Gift,
  ShieldCheck,
  Zap
  } from 'lucide-react';
    import { useAuth } from '../context/AuthContext';

    interface BookingViewProps {
  initialQuery?: string;
  }

  const BookingView: React.FC<BookingViewProps> = ({ initialQuery }) => {
  const { userData } = useAuth();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const storedId = sessionStorage.getItem("selectedServiceId");

  if (storedId && services.length > 0) {
    const found = services.find(s => String(s.id) === storedId);

    if (found) {
      setSelectedServices([found]);
      setStep(2);

      sessionStorage.removeItem("selectedServiceId");
    }
  }
  }, [services]);

  // Sync selected cart with cart indicator if needed though floatingactions provides global navigation,
  // We should make global state available to other components, but since it's just visual for now we'll update the physical DOM
  useEffect(() => {
    const qty = document.getElementById('cart-indicator-qty');
    const tot = document.getElementById('cart-indicator-tot');
    const ind = document.getElementById('cart-indicator');
    
    if (qty && tot && ind) {
      if (selectedServices.length > 0) {
        ind.classList.remove('hidden');
        ind.classList.add('flex');
        qty.textContent = String(selectedServices.length);
        const subtotal = selectedServices.reduce((acc, s) => acc + Number(s.price), 0);
        let discPct = 0;
        if (selectedServices.length >= 4) discPct = 15;
        else if (selectedServices.length === 3) discPct = 10;
        else if (selectedServices.length === 2) discPct = 5;
        const discount = Math.round(subtotal * (discPct / 100));
        tot.textContent = '$' + (subtotal - discount).toLocaleString('es-CL');
      } else {
        ind.classList.add('hidden');
        ind.classList.remove('flex');
      }
    }
  }, [selectedServices]);

  const [booking, setBooking] = useState({
    forWhom: 'self',
    modality: '',
    address: '',
    commune: '',
    hotelName: '',
    roomNumber: '',
    date: '',
    time: '',
    name: userData?.displayName || '',
    phone: '',
    email: userData?.email || '',
    notes: '',
    urgency: false,
    hairLength: 'Corto',
    hairVolume: 'Fino'
  });

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
          if (initialQuery) {
            const matched = data.find(s => 
              s.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
              s.category.toLowerCase().includes(initialQuery.toLowerCase())
            );
            if (matched) setSelectedServices([matched]);
          }
        }
      });
  }, [initialQuery]);

  useEffect(() => {
    if (userData) {
      setBooking(prev => ({
        ...prev,
        name: userData.displayName || prev.name,
        email: userData.email || prev.email
      }));
    }
  }, [userData]);

  const toggleService = (s: any) => {
    if (selectedServices.find(x => x.id === s.id)) {
      setSelectedServices(selectedServices.filter(x => x.id !== s.id));
    } else {
      setSelectedServices([...selectedServices, s]);
    }
  };

  const getSubtotal = () => selectedServices.reduce((acc, s) => acc + Number(s.price), 0);
  
  const getDiscountPct = () => {
    const n = selectedServices.length;
    if (n >= 4) return 15;
    if (n === 3) return 10;
    if (n === 2) return 5;
    return 0;
  };

  const discount = Math.round(getSubtotal() * (getDiscountPct() / 100));
  
  // Extra costs
  const hairCost = (booking.hairLength === 'Medio' ? 8000 : booking.hairLength === 'Largo' ? 15000 : booking.hairLength === 'Muy largo' ? 25000 : 0) +
                  (booking.hairVolume === 'Normal' ? 5000 : booking.hairVolume === 'Abundante' ? 12000 : 0);
  
  const [travelFee, setTravelFee] = useState(0);
  const [mapDistanceText, setMapDistanceText] = useState('—');
  const [mapDurationText, setMapDurationText] = useState('—');
  const [partnerHotels, setPartnerHotels] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/hotels')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPartnerHotels(data);
      });
  }, []);

  useEffect(() => {
    if (booking.modality === 'Domicilio' && booking.commune) {
      const fetchDistance = async () => {
        try {
          const destination = `${booking.address ? booking.address + ', ' : ''}${booking.commune}, Santiago, Chile`;
          const res = await fetch('/api/distance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destination })
          });
          const data = await res.json();
          setTravelFee(data.fee || 0);
          setMapDistanceText(data.distanceText || '—');
          setMapDurationText(data.durationText || '—');
        } catch (error) {
          console.error(error);
          setTravelFee(10000); // Default fallback
        }
      };
      fetchDistance();
    } else {
      setTravelFee(0);
      setMapDistanceText('—');
      setMapDurationText('—');
    }
  }, [booking.modality, booking.commune, booking.address]);

  const urgencyFee = booking.urgency ? Math.round(getSubtotal() * 0.15) : 0;
  
  const total = getSubtotal() - discount + hairCost + travelFee + urgencyFee;
  const downPayment = 5000;

  const handleFinalConfirm = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const dateVal = booking.date; // YYYY-MM-DD
      const timeVal = booking.time; // HH:mm
      const isoDateTime = `${dateVal}T${timeVal}:00.000Z`;

      const payload = {
        guestName: booking.name,
        guestPhone: booking.phone,
        guestEmail: booking.email,
        services: selectedServices.map((s) => s.id),
        totalPrice: total,
        discount,
        travelFee,
        urgencyFee,
        downPayment,
        dateTime: isoDateTime,
        modality: booking.modality,
        address: booking.address,
        hotelName: booking.hotelName,
        roomNumber: booking.roomNumber,
        notes: booking.notes,
        hairLength: booking.hairLength,
        hairVolume: booking.hairVolume,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("Booking error:", data);
        alert(data.error || "Error al procesar la reserva. Por favor intenta nuevamente.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && selectedServices.length === 0) return alert('Por favor selecciona al menos una experiencia.');
    if (step === 2 && !booking.modality) return alert('Por favor selecciona una modalidad.');
    if (step === 3 && (!booking.date || !booking.time)) return alert('Por favor selecciona fecha y hora.');
    if (step === 4 && (!booking.name || !booking.phone)) return alert('Por favor completa tus datos básicos.');
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const steps = [
    { n: 1, label: 'experiencia' },
    { n: 2, label: 'Modalidad' },
    { n: 3, label: 'Fecha & Hora' },
    { n: 4, label: 'Tus datos' },
    { n: 5, label: 'Confirmar' }
  ];

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] min-h-[calc(100vh-60px)]">
        
        {/* ── LEFT MAIN AREA ── */}
        <div className="p-6 lg:p-12">
          {/* PROGRESS */}
          <div className="flex items-center gap-2 mb-10 max-w-2xl overflow-x-auto pb-4 no-scrollbar">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[0.65rem] transition-all ${step >= s.n ? 'bg-char text-gold border-char' : 'bg-white border-border text-gray'}`}>
                    {step > s.n ? <Check size={14} /> : s.n}
                  </div>
                  <span className={`text-[0.6rem] uppercase tracking-widest font-bold ${step >= s.n ? 'text-char' : 'text-gray'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-[1px] ${step > s.n ? 'bg-gold' : 'bg-border'}`} />}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="font-serif text-3xl mb-1">¿Qué experiencias deseas?</h2>
                <p className="text-gray text-xs mb-8">Agrega una o varias experiencias. Mientras más elijas, mayor será tu descuento automático.</p>
                
                {/* FOR WHOM */}
                <div className="bg-white border border-gold-l p-6 rounded-2xl mb-8 shadow-sm">
                   <div className="text-[0.7rem] uppercase tracking-widest text-gold-d font-bold mb-4">¿Para quién es esta experiencia?</div>
                   <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'self', label: 'Para mí', icon: '👤' },
                        { id: 'couple', label: 'Pareja', icon: '💕' },
                        { id: 'mother', label: 'Madre reciente', icon: '🤱' },
                        { id: 'elder', label: 'Adulto mayor', icon: '🌹' },
                        { id: 'gift', label: 'Regalo', icon: '🎁' },
                      ].map(o => (
                        <button 
                          key={o.id}
                          onClick={() => setBooking({...booking, forWhom: o.id})}
                          className={`px-5 py-3 border rounded-full text-xs flex items-center gap-2 transition-all ${booking.forWhom === o.id ? 'bg-char text-white border-char' : 'bg-white border-border text-char hover:border-gold'}`}
                        >
                          <span>{o.icon}</span> {o.label}
                        </button>
                      ))}
                   </div>
                </div>

                {/* FILTERS */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                  {['all', 'Beauty', 'Wellness', 'Cuidado', 'Salud', 'Fitness', 'Gastronomía'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setFilter(c)}
                      className={`px-4 py-2 text-[0.65rem] tracking-widest border rounded-full shrink-0 transition-all ${filter === c ? 'bg-char text-white border-char' : 'bg-white border-border text-gray hover:border-gold'}`}
                    >
                      {c === 'all' ? 'Todos' : c}
                    </button>
                  ))}
                </div>

                {/* SERVICES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
                  {services.filter(s => filter === 'all' || s.category === filter).map(s => {
                    const isSelected = selectedServices.find(x => x.id === s.id);
                    return (
                      <div 
                        key={s.id}
                        onClick={() => toggleService(s)}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative ${isSelected ? 'border-char bg-ivory shadow-inner' : 'border-border bg-white hover:border-gold-l'}`}
                      >
                         {isSelected && <div className="absolute top-3 right-3 w-5 h-5 bg-char text-white rounded-full flex items-center justify-center"><Check size={12} /></div>}
                         <div className="text-[0.55rem] uppercase tracking-[0.15rem] text-gold mb-1">{s.category}</div>
                         <h4 className="font-serif text-lg leading-tight mb-2">{s.name}</h4>
                         <div className="text-[0.7rem] text-gray line-clamp-2 leading-relaxed h-10 mb-4">{s.description || 'Experiencia exclusiva para su bienestar.'}</div>
                         <div className="flex justify-between items-center text-[0.8rem]">
                            <span className="font-medium text-gold-d">Desde ${Number(s.price).toLocaleString('es-CL')}</span>
                            <span className="text-gray/40">⭐ 5.0</span>
                         </div>
                      </div>
                    );
                  })}
                </div>

                {/* HAIR VARS (conditional) */}/*
                {selectedServices.some(s => s.category === 'Beauty') && (
                  <div className="bg-white border border-border mt-8 p-6 rounded-xl animate-fade-up">
                    <div className="text-[0.65rem] uppercase tracking-widest text-gray font-bold mb-6 flex items-center gap-2">
                       <Zap size={14} className="text-gold" /> Ajustes técnicos de peluquería
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div>
                         <label className="text-[0.65rem] text-gray uppercase mb-3 block">Largo del cabello</label>
                         <div className="flex flex-wrap gap-2">
                            {['Corto', 'Medio', 'Largo', 'Muy largo'].map(l => (
                              <button key={l} onClick={() => setBooking({...booking, hairLength: l})} className={`px-4 py-2 border rounded-full text-[0.7rem] transition-all ${booking.hairLength === l ? 'bg-char text-white' : 'hover:border-gold'}`}>
                                {l}
                              </button>
                            ))}
                         </div>
                       </div>
                       <div>
                         <label className="text-[0.65rem] text-gray uppercase mb-3 block">Abundancia</label>
                         <div className="flex flex-wrap gap-2">
                            {['Fino', 'Normal', 'Abundante'].map(v => (
                              <button key={v} onClick={() => setBooking({...booking, hairVolume: v})} className={`px-4 py-2 border rounded-full text-[0.7rem] transition-all ${booking.hairVolume === v ? 'bg-char text-white' : 'hover:border-gold'}`}>
                                {v}
                              </button>
                            ))}
                         </div>
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                
                <div className="bg-white border border-gold-l p-6 rounded-2xl mb-8 shadow-sm">
  <div className="text-[0.7rem] uppercase tracking-widest text-gold-d font-bold mb-3">
    Experiencia seleccionada
  </div>

  <div className="space-y-3 mb-6">
    {selectedServices.map((s) => (
      <div key={s.id} className="flex justify-between items-center border border-border rounded-xl px-4 py-3 bg-ivory">
        <div>
          <div className="font-serif text-lg">{s.name}</div>
          <div className="text-[0.65rem] uppercase tracking-widest text-gray">{s.category}</div>
        </div>
        <div className="text-gold-d font-serif">
          ${Number(s.price).toLocaleString("es-CL")}
        </div>
      </div>
    ))}
  </div>

  <div className="text-[0.7rem] uppercase tracking-widest text-gold-d font-bold mb-3">
    ¿Quieres agregar otra experiencia?
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
    {services
      .filter((s) => !selectedServices.some((x) => x.id === s.id))
      .slice(0, 6)
      .map((s) => (
        <button
          key={s.id}
          onClick={() =>
            setSelectedServices(prev =>
              prev.some(x => x.id === s.id) ? prev : [...prev, s]
            )
          }
          className="text-left p-4 rounded-xl border border-border bg-white hover:border-gold transition-all"
        >
          <div className="text-[0.55rem] uppercase tracking-widest text-gold mb-1">
            {s.category}
          </div>
          <div className="font-serif text-base">{s.name}</div>
          <div className="text-[0.75rem] text-gray mt-1">
            Desde ${Number(s.price).toLocaleString("es-CL")}
          </div>
        </button>
      ))}
  </div>
</div>
<h2 className="font-serif text-3xl mb-1">¿Dónde te atendemos?</h2>
<p className="text-gray text-xs mb-8">Selecciona la modalidad de tu preferencia.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                   {[
                     { id: 'Estudio Privado', label: 'Estudio Privado', desc: 'Espacio exclusivo en Santiago. Sin recargo.', icon: <Sparkles className="text-gold" /> },
                     { id: 'Domicilio', label: 'A Domicilio', desc: 'Llegamos a tu hogar con todo lo necesario.', icon: <MapPin className="text-gold" /> },
                     { id: 'Hotel 5★', label: 'Tu Hotel 5★', desc: 'Coordinamos con el concierge para tu habitación.', icon: <Building className="text-gold" /> },
                   ].map(m => (
                     <div 
                       key={m.id}
                       onClick={() => setBooking({...booking, modality: m.id})}
                       className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${booking.modality === m.id ? 'border-char bg-white shadow-lux' : 'border-border bg-white/50 hover:border-gold-l'}`}
                     >
                       <div className="mb-4">{m.icon}</div>
                       <h3 className="font-serif text-xl mb-1">{m.label}</h3>
                       <p className="text-[0.72rem] text-gray leading-relaxed">{m.desc}</p>
                     </div>
                   ))}
                </div>

                {booking.modality === 'Domicilio' && (
                  <div className="bg-white border border-border p-8 rounded-2xl animate-fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                         <label className="text-[0.62rem] uppercase tracking-widest text-gray font-bold">Dirección completa</label>
                         <input type="text" className="input-luxury" placeholder="Ej: Av. Vitacura 1234, Deph 402" value={booking.address} onChange={(e)=>setBooking({...booking, address: e.target.value})} />
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="text-[0.62rem] uppercase tracking-widest text-gray font-bold">Comuna</label>
                         <select className="input-luxury" value={booking.commune} onChange={(e)=>setBooking({...booking, commune: e.target.value})}>
                            <option value="">Selecciona comuna</option>
                            <option>Providencia</option><option>Vitacura</option><option>Las Condes</option><option>Lo Barnechea</option><option>Santiago Centro</option><option>Ñuñoa</option>
                         </select>
                       </div>
                    </div>
                  </div>
                )}

                {booking.modality === 'Hotel 5★' && (
                  <div className="bg-white border border-border p-8 rounded-2xl animate-fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                         <label className="text-[0.62rem] uppercase tracking-widest text-gray font-bold">Nombre del Hotel</label>
                         <select className="input-luxury" value={booking.hotelName} onChange={(e)=>setBooking({...booking, hotelName: e.target.value})}>
                            <option value="">Selecciona hotel</option>
                            {partnerHotels.map(h => (
                               <option key={h.id} value={h.name}>{h.name}</option>
                            ))}
                            <option value="Otro">Otro (Especificar en notas)</option>
                         </select>
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="text-[0.62rem] uppercase tracking-widest text-gray font-bold">N° Habitación</label>
                         <input type="text" className="input-luxury" placeholder="Ej: 412" value={booking.roomNumber} onChange={(e)=>setBooking({...booking, roomNumber: e.target.value})} />
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-serif text-3xl mb-1">¿Cuándo te atendemos?</h2>
                <p className="text-gray text-xs mb-8">Elige el momento perfecto para su majestad.</p>
                <div className="flex flex-col lg:flex-row gap-10">
                   <div className="flex-1">
                      <label className="text-[0.65rem] uppercase tracking-widest text-gray font-bold mb-3 block">Selecciona el día</label>
                      <input type="date" className="input-luxury text-lg py-5" value={booking.date} onChange={(e)=>setBooking({...booking, date: e.target.value})} />
                   </div>
                   <div className="flex-1">
                      <label className="text-[0.65rem] uppercase tracking-widest text-gray font-bold mb-3 block">Selecciona el horario</label>
                      <div className="grid grid-cols-3 gap-2">
                         {['09:00','10:30','12:00','14:30','16:00','18:30','20:00'].map(t => (
                           <button 
                             key={t}
                             onClick={() => setBooking({...booking, time: t})}
                             className={`py-3 border rounded-lg text-sm transition-all ${booking.time === t ? 'bg-char text-white' : 'hover:border-gold'}`}
                           >
                             {t}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-serif text-3xl mb-1">Tus datos</h2>
                <p className="text-gray text-xs mb-8">Información esencial para que tu experiencia sea impecable.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                   <div className="flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">Nombre completo</label>
                      <input type="text" className="input-luxury" value={booking.name} onChange={(e)=>setBooking({...booking, name: e.target.value})} />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">WhatsApp (+569...)</label>
                      <input type="tel" className="input-luxury" placeholder="+56 9 XXXX XXXX" value={booking.phone} onChange={(e)=>setBooking({...booking, phone: e.target.value})} />
                   </div>
                   <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">Email</label>
                      <input type="email" className="input-luxury" value={booking.email} onChange={(e)=>setBooking({...booking, email: e.target.value})} />
                   </div>
                   <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-gray font-bold">Notas o requerimientos especiales</label>
                      <textarea className="input-luxury min-h-[100px]" placeholder="Ej: Piel sensible, prefiero productos sin fragancia, instrucciones de acceso..." value={booking.notes} onChange={(e)=>setBooking({...booking, notes: e.target.value})} />
                   </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <h2 className="font-serif text-3xl mb-1">Revisa y confirma</h2>
                <p className="text-gray text-xs mb-8">Su majestad, verifique que todo esté correcto antes de proceder.</p>
                
                <div className="bg-white border border-border p-8 rounded-2xl mb-8 space-y-6 shadow-sm">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <div className="text-[0.55rem] uppercase text-gray mb-1">Experiencias</div>
                        <div className="text-sm font-medium">{selectedServices.map(s => s.name).join(' + ')}</div>
                      </div>
                      <div>
                        <div className="text-[0.55rem] uppercase text-gray mb-1">Modalidad</div>
                        <div className="text-sm font-medium">{booking.modality}</div>
                      </div>
                      <div>
                        <div className="text-[0.55rem] uppercase text-gray mb-1">Día</div>
                        <div className="text-sm font-medium">{booking.date}</div>
                      </div>
                      <div>
                        <div className="text-[0.55rem] uppercase text-gray mb-1">Hora</div>
                        <div className="text-sm font-medium">{booking.time} hrs</div>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gold-l rounded-full flex items-center justify-center text-gold-d"><ShieldCheck /></div>
                         <div>
                            <div className="text-[0.7rem] font-bold">Reserva Segura</div>
                            <div className="text-[0.6rem] text-gray uppercase tracking-widest">Garantía Reverencia Majestad</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[0.55rem] uppercase text-gray">Total Final Estimado</div>
                         <div className="font-serif text-3xl text-gold-d">${total.toLocaleString('es-CL')}</div>
                      </div>
                   </div>
                </div>

                <div className="bg-green/5 border border-green/20 p-6 rounded-xl flex items-center gap-4 mb-10">
                   <div className="text-2xl">💳</div>
                   <div>
                     <p className="text-[0.75rem] font-medium text-emerald-900">Se requiere un abono de <strong className="text-green">${downPayment.toLocaleString('es-CL')}</strong> para confirmar la hora.</p>
                     <p className="text-[0.65rem] text-emerald-700/60 mt-1">El resto se paga directamente al profesional al finalizar la experiencia.</p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12 py-8 border-t border-border">
            {step > 1 ? (
              <button onClick={prevStep} className="btn btn-outline btn-sm">
                <ChevronLeft size={16} /> Volver
              </button>
            ) : <div />}
            
            {step < 5 ? (
              <button onClick={nextStep} className="btn btn-dark btn-sm group">
                Siguiente <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handleFinalConfirm} 
                disabled={loading}
                className="btn btn-magic group px-10"
              >
                {loading ? 'Procesando...' : 'Confirmar & Pagar Abono'} <Zap size={14} className="ml-2 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL (SUMMARY) ── */}
        <div className="bg-char text-white p-8 sticky top-0 h-[calc(100vh-60px)] overflow-y-auto hidden lg:flex flex-col">
           <div className="label text-gold/50 mb-8 tracking-[0.3em]">Resumen de experiencia</div>
           
           <div className="space-y-6 mb-12 flex-1">
             {selectedServices.length > 0 ? (
               selectedServices.map(s => (
                 <div key={s.id} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-[0.6rem] text-gold/60 uppercase tracking-widest mt-1">{s.category}</div>
                    </div>
                    <div className="font-serif text-gold text-lg">${Number(s.price).toLocaleString('es-CL')}</div>
                 </div>
               ))
             ) : (
               <div className="text-white/20 italic text-sm text-center py-20">Ninguna experiencia seleccionada</div>
             )}

             <div className="pt-6 border-t border-white/5 space-y-3">
                {getDiscountPct() > 0 && (
                  <div className="flex justify-between text-[0.7rem] text-green">
                    <span className="opacity-80 uppercase tracking-widest">Descuento multi-experiencia ({getDiscountPct()}%)</span>
                    <span>−${discount.toLocaleString('es-CL')}</span>
                  </div>
                )}
                {hairCost > 0 && (
                  <div className="flex justify-between text-[0.7rem] text-white/40">
                    <span className="uppercase tracking-widest">Ajuste técnico cabello</span>
                    <span>+${hairCost.toLocaleString('es-CL')}</span>
                  </div>
                )}
                {travelFee > 0 && (
                  <div className="flex justify-between text-[0.7rem] text-white/40">
                    <span className="uppercase tracking-widest">Recargo zona {booking.commune}</span>
                    <span>+${travelFee.toLocaleString('es-CL')}</span>
                  </div>
                )}
                {urgencyFee > 0 && (
                  <div className="flex justify-between text-[0.7rem] text-orange">
                    <span className="opacity-80 uppercase tracking-widest">Reserva urgente (+15%)</span>
                    <span>+${urgencyFee.toLocaleString('es-CL')}</span>
                  </div>
                )}
             </div>
           </div>

           <div className="mt-auto">
              <div className="flex justify-between items-end mb-6">
                 <div className="text-[0.6rem] uppercase tracking-[0.25em] text-white/30">Total Estimado</div>
                 <div className="font-serif text-3xl text-gold">${total.toLocaleString('es-CL')}</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-xl mb-8">
                 <div className="text-[0.55rem] uppercase tracking-widest text-gold mb-1">Abono hoy</div>
                 <div className="font-serif text-2xl mb-1">${downPayment.toLocaleString('es-CL')}</div>
                 <div className="text-[0.6rem] text-white/30 leading-relaxed">Saldo pendiente a pagar en persona: <strong>${(total - downPayment).toLocaleString('es-CL')}</strong></div>
              </div>

              <div className="space-y-3 text-[0.65rem] text-white/40 leading-relaxed border-t border-white/5 pt-6">
                 <p className="flex gap-2">✓ <span className="flex-1">Garantía de puntualidad Majestad.</span></p>
                 <p className="flex gap-2">✓ <span className="flex-1">Cancelación gratuita hasta 24h antes.</span></p>
                 <p className="flex gap-2">✓ <span className="flex-1">Confirmación por WhatsApp en 5 min.</span></p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingView;
