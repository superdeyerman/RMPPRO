import React from 'react';
import { 
  Home, 
  Scissors, 
  Sparkles, 
  History, 
  Wallet, 
  Users, 
  Calendar, 
  Briefcase, 
  ShoppingBag, 
  Hotel, 
  LayoutDashboard, 
  Crown, 
  LogOut, 
  User 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { user, userData, logout, login } = useAuth();
  
  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home, roles: ['public', 'client', 'vip', 'stylist', 'admin', 'dueño', 'hotel'] },
    { id: 'agenda', label: 'Reservar Ritual', icon: Scissors, roles: ['client', 'vip'] },
    { id: 'chat', label: 'Asistente IA', icon: Sparkles, roles: ['client', 'vip', 'stylist', 'admin', 'dueño'] },
    { id: 'asesoria', label: 'Asesoría Gratuita', icon: Sparkles, roles: ['client', 'vip', 'stylist', 'admin', 'dueño'] },
    { id: 'mis-citas', label: 'Mis Citas', icon: History, roles: ['client', 'vip'] },
    { id: 'mis-ganancias', label: 'Mis Ganancias', icon: Wallet, roles: ['stylist'] },
    { id: 'crm', label: 'CRM Clientes', icon: Users, roles: ['admin', 'dueño'] },
    { id: 'agenda', label: 'Agenda Global', icon: Calendar, roles: ['admin', 'dueño'] },
    { id: 'servicios', label: 'Mis Servicios', icon: Briefcase, roles: ['stylist', 'admin', 'dueño'] },
    { id: 'tienda', label: 'Tienda', icon: ShoppingBag, roles: ['client', 'vip', 'admin', 'dueño'] },
    { id: 'hotel-portal', label: 'Portal Hotel', icon: Hotel, roles: ['hotel', 'admin', 'dueño'] },
    { id: 'admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'dueño'] },
  ].filter(item => item.roles.includes(userData?.role || 'public'));

  return (
    <aside className="w-full md:w-80 bg-[#1a1a1a] text-white p-8 flex flex-col border-r border-white/10 shrink-0">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="text-[#c5a059] w-8 h-8" />
          <h1 className="text-2xl font-serif tracking-widest uppercase">Reverencia</h1>
        </div>
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#c5a059] font-light">Majestad</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all",
              activeTab === item.id ? "bg-[#c5a059] text-white" : "text-white/60 hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/10">
        {user ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <img src={user?.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-[#c5a059]" />
              <div className="overflow-hidden">
                <p className="text-xs font-medium truncate">{user?.displayName}</p>
                <p className="text-[9px] text-[#c5a059] uppercase tracking-widest">{userData?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Cerrar Sesión
            </button>
          </>
        ) : (
          <button 
            onClick={login}
            className="w-full bg-[#c5a059] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b08d4a] transition-all uppercase text-[10px] tracking-widest font-bold"
          >
            <User className="w-4 h-4" />
            Iniciar Sesión
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
