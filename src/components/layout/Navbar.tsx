import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User, LogOut, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onLogin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, activeTab, setActiveTab, onSearch }) => {
  const { user, userData, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        setActiveTab('reservas');
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'reservas', label: 'Reservar' },
    { id: 'b2b', label: 'Hoteles' },
    { id: 'tienda', label: 'Tienda' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[2000] h-[var(--nav)] bg-[#faf8f5]/96 backdrop-blur-[16px] border-b border-border flex items-center px-4 lg:px-6 gap-4">
        <div className="nav-logo font-serif text-lg tracking-[0.18em] cursor-pointer shrink-0 whitespace-nowrap" onClick={() => setActiveTab('home')}>
          Reverencia <em className="text-gold not-italic">Majestad</em>
        </div>

        <div className="nav-search flex-1 max-w-[380px] relative hidden lg:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray text-sm"><Search className="w-4 h-4" /></span>
          <input 
            type="text" 
            placeholder="Yoga privado, chef, masaje..." 
            className="w-full py-2 pl-9 pr-4 border border-border bg-white text-[0.8rem] rounded-full outline-none focus:border-gold transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="nav-links flex gap-1 items-center hidden md:flex">
          {navItems.map((item) => (
            <div 
              key={item.id}
              className={`nav-link px-3.5 py-2 text-[0.68rem] tracking-wider text-gray cursor-pointer rounded-full transition-all hover:bg-gray-l hover:text-char ${activeTab === item.id ? 'bg-char !text-white' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="nav-end ml-auto flex items-center gap-3 shrink-0">
          {!user ? (
            <button className="nav-pro-btn px-4 py-1.5 text-[0.65rem] tracking-widest uppercase bg-gold-l text-gold-d rounded-full font-medium transition-all hover:bg-gold hover:text-char" onClick={onLogin}>
              Ingresar
            </button>
          ) : (
            <>
              {(userData?.role === 'admin' || userData?.role === 'stylist' || userData?.role === 'hotel') && (
                <button 
                  className="nav-pro-btn px-4 py-1.5 text-[0.65rem] tracking-widest uppercase bg-gold-l text-gold-d rounded-full font-medium transition-all hover:bg-gold hover:text-char hidden sm:block" 
                  onClick={() => setActiveTab('dashboard')}
                >
                  Panel {userData.role === 'admin' ? 'Admin' : 'Pro'}
                </button>
              )}
              <button className="notif-btn relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-l transition-all" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <Bell className="w-5 h-5 text-gray" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red border-[1.5px] border-cream rounded-full"></span>
              </button>
              <div 
                className="nav-avatar w-8 h-8 rounded-full bg-gold-l flex items-center justify-center font-serif text-sm text-gold-d cursor-pointer border-2 border-transparent hover:border-gold transition-all"
                onClick={() => setActiveTab('dashboard')}
                title="Mi Perfil"
              >
                {userData?.initials || userData?.displayName?.charAt(0) || 'U'}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Notification Panel */}
      <div className={`notif-panel fixed top-[var(--nav)] right-0 w-[320px] bg-white border-l border-border z-[1900] shadow-xl max-h-[calc(100vh-var(--nav))] overflow-y-auto transition-transform duration-300 ease-in-out ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="np-header p-4 border-b border-border flex justify-between items-center bg-[#faf8f5]">
          <h4 className="text-[0.68rem] tracking-widest uppercase font-bold">Notificaciones</h4>
          <button onClick={() => setIsNotifOpen(false)} className="text-gray hover:text-char">✕</button>
        </div>
        <div className="np-item p-5 border-b border-border cursor-pointer hover:bg-cream transition-all unread border-l-4 border-gold">
          <div className="np-type text-[0.58rem] tracking-widest uppercase text-gold mb-1">Nueva reserva</div>
          <div className="np-text text-[0.78rem] leading-snug">Constanza B. agendó Spa Parejas · 20 Abr 16:00</div>
          <div className="np-time text-[0.65rem] text-gray mt-1">Hace 5 min</div>
        </div>
        <div className="np-item p-5 border-b border-border cursor-pointer hover:bg-cream transition-all">
          <div className="np-type text-[0.58rem] tracking-widest uppercase text-gold mb-1">Hotel W — B2B</div>
          <div className="np-text text-[0.78rem] leading-snug">Solicitud masaje hab. 412 para hoy</div>
          <div className="np-time text-[0.65rem] text-gray mt-1">Hace 18 min</div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
