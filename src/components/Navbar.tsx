import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  LogOut, 
  CreditCard, 
  Settings, 
  Building,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate: (tab: string) => void;
  activeTab: string;
  onLogout?: () => void;
  onLogin?: (role?: string) => Promise<void>;
  userData?: any;
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeTab, onLogout, onLogin, userData, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const links = [
    { id: 'home', label: 'Inicio' },
    { id: 'reservas', label: 'Reservar' },
    { id: 'tienda', label: 'Boutique' },
    { id: 'b2b', label: 'Hoteles' },
    { id: 'dashboard', label: 'Dashboard', roles: ['admin'] },
  ];

  const filteredLinks = links.filter(link => {
    if (!link.roles) return true;
    return link.roles.includes(userData?.role || '');
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gold/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] px-6 lg:px-10 flex items-center gap-10 py-5">
      {/* LOGO */}
      <div 
        onClick={() => onNavigate('home')} 
        className="nav-logo shrink-0 cursor-pointer flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="text-lg font-serif tracking-[0.25em] text-char uppercase">
          Reverencia<span className="text-gold italic ml-2 lowercase text-xl">Majestad</span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm relative group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-d transition-colors group-focus-within:text-gold" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Yoga, chef, masaje..."
          className="w-full bg-white/40 border border-gold/20 rounded-full py-2 pl-12 pr-6 text-sm focus:outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-gray/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
        />
      </form>

      {/* DESKTOP LINKS */}
      <div className="hidden lg:flex items-center gap-1">
        {filteredLinks.map(link => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className={`px-5 py-2 text-[0.65rem] tracking-[0.2em] uppercase font-bold rounded-full transition-all duration-300 cursor-pointer hover:scale-[1.02] ${activeTab === link.id ? 'bg-cream text-char shadow-sm border border-gold/10' : 'text-gray hover:bg-cream/50 hover:text-char'}`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* END TOOLS */}
      <div className="ml-auto flex items-center gap-5">
        <a href="#" className="hidden xl:flex items-center gap-2 bg-white border border-gold/20 rounded-full px-4 py-1.5 text-[0.68rem] text-char hover:border-gold transition-all duration-300 hover:scale-[1.02] cursor-pointer whitespace-nowrap shadow-sm">
          <svg className="w-3.5 h-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          <span className="text-[#fbbc04] tracking-[0.5px]">★★★★★</span>
          <strong className="font-serif text-[0.8rem] text-gold-d">5.0</strong>
          <span className="text-gray text-[0.62rem]">· 370 reseñas</span>
        </a>

        {!userData && (
          <button onClick={() => onLogin?.('pro')} className="hidden sm:block text-[0.62rem] uppercase tracking-[0.15em] font-bold border border-gold text-gold-d px-5 py-2 rounded-full hover:bg-gold hover:text-white transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            Portal Pro
          </button>
        )}

        {userData && (
          <button className="relative p-2 text-char/60 hover:text-char transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full border-2 border-white shadow-sm" />
          </button>
        )}

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-serif text-char border border-gold/20 shadow-sm hover:border-gold transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            {userData?.displayName?.charAt(0) || <User size={18} />}
          </button>

          <AnimatePresence>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-gold/10 shadow-2xl rounded-2xl z-20 overflow-hidden"
                >
                   {userData ? (
                     <>
                       <div className="p-6 bg-cream/30 border-b border-gold/10">
                          <div className="text-sm font-bold text-char tracking-wide">{userData.displayName}</div>
                          <div className="text-[0.65rem] text-gray uppercase tracking-[0.15em] mt-1">{userData.role}</div>
                       </div>
                       <div className="p-3">
                          {['admin','pro','hotel'].includes(userData.role) && (
                            <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-char hover:bg-cream/50 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                              <Building size={16} className="text-gold" /> Panel {userData.role === 'admin' ? 'Admin' : 'Operativo'}
                            </button>
                          )}
                          <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-char hover:bg-cream/50 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                            <User size={16} className="text-gold" /> Mi Perfil
                          </button>
                          {userData.role === 'client' && (
                            <button onClick={() => onNavigate('mis-citas')} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-char hover:bg-cream/50 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                              <Calendar size={16} className="text-gold" /> Mis Citas
                            </button>
                          )}
                          {userData.role === 'client' && (
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-xs text-char hover:bg-cream/50 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                              <CreditCard size={16} className="text-gold" /> Mis Pagos
                            </button>
                          )}
                          {onLogout && (
                            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red hover:bg-red/5 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer mt-2 pt-4 border-t border-gold/10">
                              <LogOut size={16} /> Cerrar Sesión
                            </button>
                          )}
                       </div>
                     </>
                   ) : (
                     <div className="p-3">
                        <div className="px-4 py-2 text-xs font-bold text-gray uppercase tracking-widest mb-2 border-b border-gold/10 pb-3">Iniciar Sesión Como:</div>
                        <button onClick={() => { onLogin?.('client'); setShowProfile(false); }} className="w-full text-left px-4 py-2 text-xs text-char hover:bg-cream/50 rounded-lg transition-all">Cliente VIP</button>
                        <button onClick={() => { onLogin?.('admin'); setShowProfile(false); }} className="w-full text-left px-4 py-2 text-xs text-char hover:bg-cream/50 rounded-lg transition-all">Admin (Demo)</button>
                        <button onClick={() => { onLogin?.('hotel'); setShowProfile(false); }} className="w-full text-left px-4 py-2 text-xs text-char hover:bg-cream/50 rounded-lg transition-all">Hotel / B2B</button>
                     </div>
                   )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-char transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-[72px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gold/10 overflow-hidden shadow-2xl"
          >
            <div className="p-6 flex flex-col gap-2">
               {filteredLinks.map(link => (
                 <button
                   key={link.id}
                   onClick={() => { onNavigate(link.id); setIsMenuOpen(false); }}
                   className={`w-full text-left px-6 py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-bold transition-all duration-300 cursor-pointer ${activeTab === link.id ? 'bg-cream text-char border border-gold/10' : 'text-gray hover:bg-cream/50 hover:text-char'}`}
                 >
                   {link.label}
                 </button>
               ))}
               <button className="mt-4 text-[0.62rem] uppercase tracking-[0.15em] font-bold border border-gold text-gold-d px-5 py-4 rounded-xl hover:bg-gold hover:text-white transition-all duration-300 cursor-pointer text-center">
                 Portal Profesional
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
