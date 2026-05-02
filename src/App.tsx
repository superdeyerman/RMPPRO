import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import FloatingActions from './components/FloatingActions';
import Footer from './components/layout/Footer';
import HomeView from './views/HomeView';
import BookingView from './views/BookingView';
import AlianzasView from './views/AlianzasView';
import DashboardView from './views/DashboardView';
import DashboardLayout from './components/layout/DashboardLayout';
import AgendaView from './views/AgendaView';
import CRMView from './views/CRMView';
import HotelPortalView from './views/HotelPortalView';
import TiendaView from './views/TiendaView';
import MisGananciasView from './views/MisGananciasView';
import MisServiciosView from './views/MisServiciosView';
import MisCitasView from './views/MisCitasView';
import IdentityVerificationView from './views/IdentityVerificationView';

import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { userData, loading, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Manage active tab state based on location
  const activeTab = location.pathname.substring(1) || 'home';
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'paid') {
      setShowSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const navigateToTab = (tab: string) => {
    navigate('/' + tab);
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate('/reservas');
  };

  const isDashboard = activeTab.startsWith('dashboard');

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF8F5] gap-8">
       <div className="relative flex items-center justify-center">
         <div className="absolute w-24 h-24 rounded-full border border-gold/30 animate-[spin_3s_linear_infinite]" />
         <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-gold animate-[spin_1s_ease-in-out_infinite]" />
       </div>
       <div className="flex flex-col items-center gap-2">
         <div className="text-[0.65rem] uppercase tracking-[0.3em] font-bold text-gold-d">Preparando</div>
         <div className="font-serif italic text-4xl text-char">Su Majestad...</div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F5F1EB] to-[#EFE8DD] text-char tracking-[0.02em]">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }} 
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-char/40 p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-border relative overflow-hidden"
            >
              <button 
                 onClick={() => setShowSuccess(false)}
                 className="absolute top-8 right-8 text-gray hover:text-char transition-colors"
                >
                  <X size={24} />
              </button>
              <div className="w-20 h-20 rounded-full bg-cream border border-border flex items-center justify-center mx-auto mb-8 text-gold-d shadow-sm">
                 <Sparkles size={32} className="animate-pulse" />
              </div>
              <h2 className="font-serif text-3xl mb-4 text-char tracking-tight">Reserva Confirmada</h2>
              <p className="text-gray text-sm leading-relaxed mb-10 font-light">
                Su majestad, su experiencia ha sido procesada con éxito. Nos pondremos en contacto a la brevedad para afinar los detalles de su atención.
              </p>
              <button onClick={() => setShowSuccess(false)} className="btn btn-gold w-full py-4 text-xs font-bold tracking-widest uppercase shadow-lg shadow-gold/20 hover:-translate-y-1 transition-transform">Entendido</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar onNavigate={navigateToTab} activeTab={activeTab} onLogout={logout} onLogin={login} userData={userData} onSearch={handleSearch} />
      
        <main className={isDashboard ? "" : "pt-[75px]"}>
          {isDashboard ? (
          userData && ['admin', 'pro', 'hotel'].includes(userData.role) ? (
            <DashboardLayout onLogout={logout} activeTab={activeTab} setActiveTab={navigateToTab} onSearch={handleSearch}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={activeTab}
                className="py-6"
              >
                <Routes>
                  {/* ADMIN ROUTES */}
                  {userData.role === 'admin' && (
                    <>
                      <Route path="/dashboard" element={<DashboardView />} />
                      <Route path="/dashboard-crm" element={<CRMView />} />
                      <Route path="/dashboard-tienda" element={<TiendaView isAdmin={true} />} />
                      <Route path="/dashboard-verificacion" element={<IdentityVerificationView />} />
                    </>
                  )}
                  {/* PPO & ADMIN ROUTES */}
                  {['admin', 'pro'].includes(userData.role) && (
                    <>
                      <Route path="/dashboard-agenda" element={<AgendaView />} />
                      <Route path="/dashboard-ganancias" element={<MisGananciasView />} />
                      <Route path="/dashboard-servicios" element={<MisServiciosView />} />
                    </>
                  )}
                  {/* HOTEL ROUTES */}
                  {['admin', 'hotel'].includes(userData.role) && (
                     <Route path="/dashboard-hotel" element={<HotelPortalView />} />
                  )}
                  
                  {/* FALLBACK REDIRECT WITHIN DASHBOARD BASED ON ROLE */}
                  <Route path="*" element={
                    <Navigate to={
                    userData.role === 'hotel' ? "/dashboard-hotel" : 
                    userData.role === 'pro' ? "/dashboard-agenda" : 
                    "/dashboard"
                    } replace />
                    
                  } />
                </Routes>
              </motion.div>
            </DashboardLayout>
          ) : (
            /* IF TRYING TO ACCESS DASHBOARD BUT NO PERMISSION, REDIRECT HOME */
            <Navigate to="/home" replace />
          )
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes>
                <Route path="/home" element={<HomeView setActiveTab={navigateToTab} />} />
                <Route path="/reservas" element={<BookingView initialQuery={searchQuery} />} />
                <Route path="/mis-citas" element={<MisCitasView />} />
                <Route path="/b2b" element={<AlianzasView />} />
                <Route path="/tienda" element={<TiendaView isAdmin={false} />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {!isDashboard && <Footer />}

      {!isDashboard && (
        <FloatingActions 
          onNotify={(m) => alert(m)} 
          onNavigate={navigateToTab} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;